import {
  collection, doc, addDoc, updateDoc, deleteDoc,
  query, orderBy, limit, serverTimestamp, onSnapshot,
  getDocs, setDoc, getDoc, deleteField, arrayUnion, writeBatch,
} from 'firebase/firestore'
import { db } from '../../../lib/firebase'

// ── Collections ───────────────────────────────────────────────────────────────
const roomsCol = collection(db, 'rooms')
const msgsCol  = roomId => collection(db, 'rooms', roomId, 'messages')

// ── Rooms ─────────────────────────────────────────────────────────────────────
export async function createRoom(name, user) {
  return addDoc(roomsCol, {
    name,
    createdBy:   user.uid,
    createdAt:   serverTimestamp(),
    lastMessage: '',
    lastMessageAt: serverTimestamp(),
    memberCount: 1,
  })
}

export function subscribeRooms(callback) {
  const q = query(roomsCol, orderBy('lastMessageAt', 'desc'))
  return onSnapshot(q, snap =>
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  )
}

export async function getRoom(roomId) {
  const snap = await getDoc(doc(db, 'rooms', roomId))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

// ── Messages ──────────────────────────────────────────────────────────────────
export async function sendMessage(roomId, text, user) {
  const ref = await addDoc(msgsCol(roomId), {
    text,
    uid:         user.uid,
    displayName: user.displayName,
    photoURL:    user.photoURL,
    createdAt:   serverTimestamp(),
  })
  // Update room preview
  await updateDoc(doc(db, 'rooms', roomId), {
    lastMessage:   text,
    lastMessageAt: serverTimestamp(),
  })
  return ref
}

export function subscribeMessages(roomId, callback, msgLimit = 50) {
  const q = query(msgsCol(roomId), orderBy('createdAt', 'asc'), limit(msgLimit))
  return onSnapshot(q, snap =>
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  )
}

export async function deleteMessage(roomId, messageId) {
  return deleteDoc(doc(db, 'rooms', roomId, 'messages', messageId))
}

// ── Typing indicator ──────────────────────────────────────────────────────────
export async function setTyping(roomId, user, isTyping) {
  const roomRef = doc(db, 'rooms', roomId)
  await updateDoc(roomRef, {
    [`typing.${user.uid}`]: isTyping
      ? { displayName: user.displayName, at: serverTimestamp() }
      : deleteField(),
  })
}

export function subscribeTyping(roomId, callback) {
  return onSnapshot(doc(db, 'rooms', roomId), snap => {
    const typing = snap.data()?.typing || {}
    callback(typing)
  })
}

// ── Read receipts ─────────────────────────────────────────────────────────────
// Accepts already-loaded messages array (no extra getDocs needed)
export async function markMessagesRead(roomId, userId, messages) {
  if (!messages?.length) return
  const batch = writeBatch(db)
  let count = 0
  messages.forEach(m => {
    if (m.uid !== userId && !(m.readBy || []).includes(userId)) {
      batch.update(doc(db, 'rooms', roomId, 'messages', m.id), {
        readBy: arrayUnion(userId),
      })
      count++
    }
  })
  if (count > 0) await batch.commit()
}

// ── User profile ──────────────────────────────────────────────────────────────
export async function upsertUser(user) {
  await setDoc(doc(db, 'users', user.uid), {
    displayName: user.displayName,
    photoURL:    user.photoURL,
    email:       user.email,
    lastSeen:    serverTimestamp(),
  }, { merge: true })
}

export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, 'users', uid))
  return snap.exists() ? snap.data() : null
}

export function subscribeProfile(uid, callback) {
  return onSnapshot(doc(db, 'users', uid), snap => {
    callback(snap.exists() ? snap.data() : null)
  })
}

export async function updateUserProfile(uid, { username, bio, customPhotoURL }) {
  const data = { username, bio, updatedAt: serverTimestamp() }
  if (customPhotoURL !== undefined) data.customPhotoURL = customPhotoURL
  await updateDoc(doc(db, 'users', uid), data)
}

export async function isUsernameTaken(username, myUid) {
  const { getDocs: gd, where, query: q2 } = await import('firebase/firestore')
  const snap = await gd(q2(collection(db, 'users'),
    where('username', '==', username.toLowerCase())))
  return snap.docs.some(d => d.id !== myUid)
}

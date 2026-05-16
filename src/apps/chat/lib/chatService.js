import {
  collection, doc, addDoc, updateDoc, deleteDoc,
  query, orderBy, limit, serverTimestamp, onSnapshot,
  getDocs, setDoc, getDoc,
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

// ── User profile (store display name + photo in Firestore) ────────────────────
export async function upsertUser(user) {
  await setDoc(doc(db, 'users', user.uid), {
    displayName: user.displayName,
    photoURL:    user.photoURL,
    email:       user.email,
    lastSeen:    serverTimestamp(),
  }, { merge: true })
}

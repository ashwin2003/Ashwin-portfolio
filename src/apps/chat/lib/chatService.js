import {
  collection, doc, addDoc, updateDoc, deleteDoc,
  query, where, orderBy, limit, serverTimestamp, onSnapshot,
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
export async function sendMessage(roomId, text, user, username) {
  const ref = await addDoc(msgsCol(roomId), {
    text,
    uid:         user.uid,
    displayName: user.displayName,
    photoURL:    user.photoURL,
    ...(username ? { username } : {}),
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

export async function setDMTyping(dmId, user, isTyping) {
  await updateDoc(doc(db, 'dms', dmId), {
    [`typing.${user.uid}`]: isTyping
      ? { displayName: user.displayName, at: serverTimestamp() }
      : deleteField(),
  })
}

export function subscribeDMTyping(dmId, callback) {
  return onSnapshot(doc(db, 'dms', dmId), snap => {
    callback(snap.data()?.typing || {})
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
  const snap = await getDocs(query(collection(db, 'users'),
    where('username', '==', username.toLowerCase())))
  return snap.docs.some(d => d.id !== myUid)
}

// ── Direct Messages ───────────────────────────────────────────────────────────
export function getDMId(uid1, uid2) {
  return [uid1, uid2].sort().join('_')
}

export async function getOrCreateDM(myUid, myInfo, otherUid, otherInfo) {
  const dmId  = getDMId(myUid, otherUid)
  const dmRef = doc(db, 'dms', dmId)
  const snap  = await getDoc(dmRef)
  if (!snap.exists()) {
    await setDoc(dmRef, {
      participants: [myUid, otherUid],
      participantInfo: {
        [myUid]:    myInfo,
        [otherUid]: otherInfo,
      },
      lastMessage:   '',
      lastMessageAt: serverTimestamp(),
      createdAt:     serverTimestamp(),
    })
  }
  return dmId
}

export async function getDM(dmId) {
  const snap = await getDoc(doc(db, 'dms', dmId))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

export function subscribeDMs(uid, callback) {
  const q = query(collection(db, 'dms'), where('participants', 'array-contains', uid))
  return onSnapshot(q, snap => {
    const dms = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    dms.sort((a, b) =>
      (b.lastMessageAt?.toMillis?.() || 0) - (a.lastMessageAt?.toMillis?.() || 0))
    callback(dms)
  })
}

export async function sendDMMessage(dmId, text, user, username) {
  await addDoc(collection(db, 'dms', dmId, 'messages'), {
    text,
    uid:         user.uid,
    displayName: user.displayName,
    photoURL:    user.photoURL,
    ...(username ? { username } : {}),
    createdAt:   serverTimestamp(),
  })
  await updateDoc(doc(db, 'dms', dmId), {
    lastMessage:   text,
    lastMessageAt: serverTimestamp(),
  })
}

export function subscribeDMMessages(dmId, callback, msgLimit = 50) {
  const q = query(
    collection(db, 'dms', dmId, 'messages'),
    orderBy('createdAt', 'asc'),
    limit(msgLimit),
  )
  return onSnapshot(q, snap =>
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  )
}

export async function markDMsRead(dmId, userId, messages) {
  if (!messages?.length) return
  const batch = writeBatch(db)
  let count = 0
  messages.forEach(m => {
    if (m.uid !== userId && !(m.readBy || []).includes(userId)) {
      batch.update(doc(db, 'dms', dmId, 'messages', m.id), { readBy: arrayUnion(userId) })
      count++
    }
  })
  if (count > 0) await batch.commit()
}

export async function searchUsers(queryStr, currentUid) {
  if (!queryStr.trim()) return []
  const snap = await getDocs(collection(db, 'users'))
  const q    = queryStr.toLowerCase()
  return snap.docs
    .filter(d => d.id !== currentUid)
    .map(d => ({ uid: d.id, ...d.data() }))
    .filter(u =>
      (u.username    && u.username.includes(q)) ||
      (u.displayName && u.displayName.toLowerCase().includes(q))
    )
    .slice(0, 10)
}

// ── Friend Requests ───────────────────────────────────────────────────────────
export async function sendFriendRequest(fromUid, fromInfo, toUid) {
  await setDoc(doc(db, 'friendRequests', `${fromUid}_${toUid}`), {
    from:     fromUid,
    to:       toUid,
    fromInfo,
    status:   'pending',
    createdAt: serverTimestamp(),
  })
}

export async function acceptFriendRequest(reqId, myUid, myInfo, fromUid, fromInfo) {
  await updateDoc(doc(db, 'friendRequests', reqId), { status: 'accepted' })
  return getOrCreateDM(myUid, myInfo, fromUid, fromInfo)
}

export async function declineFriendRequest(reqId) {
  await deleteDoc(doc(db, 'friendRequests', reqId))
}

export function subscribeIncomingRequests(uid, callback) {
  const q = query(collection(db, 'friendRequests'), where('to', '==', uid))
  return onSnapshot(q, snap =>
    callback(
      snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(r => r.status === 'pending')
    )
  )
}

export function subscribeOutgoingRequests(uid, callback) {
  const q = query(collection(db, 'friendRequests'), where('from', '==', uid))
  return onSnapshot(q, snap =>
    callback(
      snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(r => r.status === 'pending')
    )
  )
}

import { useState, useEffect } from 'react'
import { subscribeTyping, subscribeDMTyping } from '../lib/chatService'

const TYPING_EXPIRE_MS = 6000

function parseTypers(typing, myUid) {
  const now = Date.now()
  return Object.entries(typing)
    .filter(([uid, data]) =>
      uid !== myUid && data?.at && now - data.at.toMillis() < TYPING_EXPIRE_MS
    )
    .map(([, data]) => data.displayName)
}

export function useTyping(roomId, myUid) {
  const [typers, setTypers] = useState([])
  useEffect(() => {
    if (!roomId) return
    const unsub = subscribeTyping(roomId, typing => setTypers(parseTypers(typing, myUid)))
    return unsub
  }, [roomId, myUid])
  return typers
}

export function useDMTyping(dmId, myUid) {
  const [typers, setTypers] = useState([])
  useEffect(() => {
    if (!dmId) return
    const unsub = subscribeDMTyping(dmId, typing => setTypers(parseTypers(typing, myUid)))
    return unsub
  }, [dmId, myUid])
  return typers
}

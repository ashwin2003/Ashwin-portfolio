import { useState, useEffect } from 'react'
import { subscribeTyping } from '../lib/chatService'

const TYPING_EXPIRE_MS = 6000

export function useTyping(roomId, myUid) {
  const [typers, setTypers] = useState([])

  useEffect(() => {
    if (!roomId) return
    const unsub = subscribeTyping(roomId, typing => {
      const now = Date.now()
      const active = Object.entries(typing)
        .filter(([uid, data]) =>
          uid !== myUid &&
          data?.at &&
          now - data.at.toMillis() < TYPING_EXPIRE_MS
        )
        .map(([, data]) => data.displayName)
      setTypers(active)
    })
    return unsub
  }, [roomId, myUid])

  return typers  // e.g. ['Ashwin', 'Priya']
}

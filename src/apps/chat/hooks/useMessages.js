import { useState, useEffect } from 'react'
import { subscribeMessages } from '../lib/chatService'

export function useMessages(roomId) {
  const [messages, setMessages] = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    if (!roomId) return
    setLoading(true)
    const unsub = subscribeMessages(roomId, data => {
      setMessages(data)
      setLoading(false)
    })
    return unsub
  }, [roomId])

  return { messages, loading }
}

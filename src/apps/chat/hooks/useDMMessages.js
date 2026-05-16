import { useState, useEffect } from 'react'
import { subscribeDMMessages } from '../lib/chatService'

export function useDMMessages(dmId) {
  const [messages, setMessages] = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    if (!dmId) return
    setLoading(true)
    const unsub = subscribeDMMessages(dmId, data => {
      setMessages(data)
      setLoading(false)
    })
    return unsub
  }, [dmId])

  return { messages, loading }
}

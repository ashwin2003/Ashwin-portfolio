import { useState, useEffect } from 'react'
import { subscribeDMs } from '../lib/chatService'

export function useDMs(uid) {
  const [dms,     setDMs]     = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!uid) return
    const unsub = subscribeDMs(uid, data => {
      setDMs(data)
      setLoading(false)
    })
    return unsub
  }, [uid])

  return { dms, loading }
}

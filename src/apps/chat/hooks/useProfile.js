import { useState, useEffect } from 'react'
import { subscribeProfile } from '../lib/chatService'

export function useProfile(uid) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!uid) return
    const unsub = subscribeProfile(uid, data => {
      setProfile(data)
      setLoading(false)
    })
    return unsub
  }, [uid])

  return { profile, loading }
}

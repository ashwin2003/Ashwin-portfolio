import { useState, useEffect } from 'react'
import { subscribeProfile } from '../lib/chatService'

export function useProfiles(uids = []) {
  const [profiles, setProfiles] = useState({})
  const key = [...uids].sort().join(',')

  useEffect(() => {
    if (!uids.length) return
    const unsubs = uids.map(uid =>
      subscribeProfile(uid, data => {
        setProfiles(prev => ({ ...prev, [uid]: data }))
      })
    )
    return () => unsubs.forEach(u => u())
  }, [key]) // eslint-disable-line react-hooks/exhaustive-deps

  return profiles
}

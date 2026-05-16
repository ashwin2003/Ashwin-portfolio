import { useState, useEffect } from 'react'
import { subscribeRooms } from '../lib/chatService'

export function useRooms() {
  const [rooms,   setRooms]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = subscribeRooms(data => {
      setRooms(data)
      setLoading(false)
    })
    return unsub
  }, [])

  return { rooms, loading }
}

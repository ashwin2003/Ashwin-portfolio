import { useState, useEffect } from 'react'
import { subscribeIncomingRequests, subscribeOutgoingRequests } from '../lib/chatService'

export function useFriendRequests(uid) {
  const [incoming, setIncoming] = useState([])
  const [outgoing, setOutgoing] = useState([])

  useEffect(() => {
    if (!uid) return
    const unsubIn  = subscribeIncomingRequests(uid, setIncoming)
    const unsubOut = subscribeOutgoingRequests(uid, setOutgoing)
    return () => { unsubIn(); unsubOut() }
  }, [uid])

  return { incoming, outgoing }
}

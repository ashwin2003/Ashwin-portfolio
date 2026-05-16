import { createContext, useContext } from 'react'
import { useAuth } from '../../../hooks/useAuth'
import { upsertUser } from '../lib/chatService'
import { useEffect } from 'react'

const AuthCtx = createContext(null)

export function ChatAuthProvider({ children }) {
  const auth = useAuth()

  // Sync user profile to Firestore on login
  useEffect(() => {
    if (auth.user) upsertUser(auth.user)
  }, [auth.user])

  return <AuthCtx.Provider value={auth}>{children}</AuthCtx.Provider>
}

export const useChatAuth = () => useContext(AuthCtx)

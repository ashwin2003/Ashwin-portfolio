import { Navigate } from 'react-router-dom'
import { useChatAuth } from '../context/AuthContext'

export function ProtectedRoute({ children }) {
  const { user, loading } = useChatAuth()

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <div className="w-5 h-5 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
      </div>
    )
  }

  return user ? children : <Navigate to="/chat/login" replace />
}

import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ChatNavbar } from './components/ChatNavbar'

const Login    = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })))
const Rooms    = lazy(() => import('./pages/Rooms').then(m => ({ default: m.Rooms })))
const ChatRoom = lazy(() => import('./pages/ChatRoom').then(m => ({ default: m.ChatRoom })))

function Loader() {
  return (
    <div className="flex justify-center py-32">
      <div className="w-5 h-5 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
    </div>
  )
}

export function ChatApp() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 pt-14">
      <ChatNavbar />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route index             element={<Rooms />} />
          <Route path="login"      element={<Login />} />
          <Route path="room/:roomId" element={<ChatRoom />} />
        </Routes>
      </Suspense>
    </div>
  )
}

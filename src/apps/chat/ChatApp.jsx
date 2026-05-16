import { lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { ChatAuthProvider } from './context/AuthContext'
import { ChatNavbar } from './components/ChatNavbar'

const Login    = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })))
const Rooms    = lazy(() => import('./pages/Rooms').then(m => ({ default: m.Rooms })))
const ChatRoom = lazy(() => import('./pages/ChatRoom').then(m => ({ default: m.ChatRoom })))
const DMRoom   = lazy(() => import('./pages/DMRoom').then(m => ({ default: m.DMRoom })))

function Loader() {
  return (
    <div className="flex justify-center py-32">
      <div className="w-5 h-5 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
    </div>
  )
}

function ChatShell() {
  const { pathname } = useLocation()
  const inRoom = pathname.includes('/room/') || pathname.includes('/dm/')

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950">
      {/* Navbar shown everywhere except inside a room (room renders its own) */}
      {!inRoom && <ChatNavbar />}
      <div className={inRoom ? '' : 'pt-14'}>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route index               element={<Rooms />} />
            <Route path="login"        element={<Login />} />
            <Route path="room/:roomId" element={<ChatRoom />} />
            <Route path="dm/:dmId"     element={<DMRoom />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  )
}

export function ChatApp() {
  return (
    <ChatAuthProvider>
      <ChatShell />
    </ChatAuthProvider>
  )
}

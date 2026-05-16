import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useChatAuth } from '../context/AuthContext'
import { useRooms } from '../hooks/useRooms'
import { createRoom } from '../lib/chatService'
import { ProtectedRoute } from '../components/ProtectedRoute'

function timeAgo(ts) {
  if (!ts) return ''
  const secs = Math.floor((Date.now() - ts.toDate()) / 1000)
  if (secs < 60)   return 'just now'
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`
  return ts.toDate().toLocaleDateString()
}

function RoomsContent() {
  const { user } = useChatAuth()
  const { rooms, loading } = useRooms()
  const navigate = useNavigate()

  const [creating,  setCreating]  = useState(false)
  const [roomName,  setRoomName]  = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleCreate = async e => {
    e.preventDefault()
    if (!roomName.trim()) return
    setSubmitting(true)
    try {
      const ref = await createRoom(roomName.trim(), user)
      setRoomName('')
      setCreating(false)
      navigate(`/chat/room/${ref.id}`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="section-container py-8 max-w-2xl">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Rooms</h1>
          <p className="text-sm text-slate-500 dark:text-zinc-500 mt-0.5">
            {rooms.length} room{rooms.length !== 1 ? 's' : ''} available
          </p>
        </div>
        <button
          onClick={() => setCreating(c => !c)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500
                     hover:bg-emerald-600 text-white text-sm font-medium
                     transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          New Room
        </button>
      </div>

      {/* Create room form */}
      {creating && (
        <form onSubmit={handleCreate}
          className="card p-4 mb-4 flex gap-3 items-center animate-fade-in">
          <input
            autoFocus
            value={roomName}
            onChange={e => setRoomName(e.target.value)}
            placeholder="Room name…"
            maxLength={40}
            className="flex-1 bg-transparent text-sm text-slate-900 dark:text-white
                       placeholder:text-slate-400 dark:placeholder:text-zinc-600
                       focus:outline-none"
          />
          <button type="submit" disabled={submitting || !roomName.trim()}
            className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600
                       disabled:opacity-40 text-white text-sm font-medium transition-colors">
            {submitting ? '…' : 'Create'}
          </button>
          <button type="button" onClick={() => setCreating(false)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </form>
      )}

      {/* Room list */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-5 h-5 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin"/>
        </div>
      ) : rooms.length === 0 ? (
        <div className="text-center py-16 text-slate-400 dark:text-zinc-600">
          <p className="text-sm font-mono">No rooms yet. Create the first one ↑</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {rooms.map(room => (
            <li key={room.id}>
              <button
                onClick={() => navigate(`/chat/room/${room.id}`)}
                className="card card-hover w-full text-left p-4 flex items-center gap-4
                           hover:shadow-sm transition-all duration-200"
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20
                                flex items-center justify-center flex-shrink-0 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                  {room.name[0].toUpperCase()}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-slate-900 dark:text-white text-sm truncate">
                      {room.name}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-zinc-600 flex-shrink-0 font-mono">
                      {timeAgo(room.lastMessageAt)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-zinc-500 truncate mt-0.5">
                    {room.lastMessage || 'No messages yet'}
                  </p>
                </div>
                {/* Arrow */}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                  className="text-slate-300 dark:text-zinc-700 flex-shrink-0">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function Rooms() {
  return <ProtectedRoute><RoomsContent /></ProtectedRoute>
}

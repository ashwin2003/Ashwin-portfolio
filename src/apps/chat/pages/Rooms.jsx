import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useChatAuth } from '../context/AuthContext'
import { useProfile } from '../hooks/useProfile'
import { useRooms } from '../hooks/useRooms'
import { useDMs } from '../hooks/useDMs'
import { useFriendRequests } from '../hooks/useFriendRequests'
import {
  createRoom, getDMId,
  getOrCreateDM, searchUsers,
  sendFriendRequest, acceptFriendRequest, declineFriendRequest,
} from '../lib/chatService'
import { ProtectedRoute } from '../components/ProtectedRoute'

function timeAgo(ts) {
  if (!ts) return ''
  const secs = Math.floor((Date.now() - ts.toDate()) / 1000)
  if (secs < 60)    return 'just now'
  if (secs < 3600)  return `${Math.floor(secs / 60)}m ago`
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`
  return ts.toDate().toLocaleDateString()
}

// ── Shared helpers ────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <div className="flex justify-center py-12">
      <div className="w-5 h-5 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin"/>
    </div>
  )
}

function Empty({ text, sub }) {
  return (
    <div className="text-center py-12 text-slate-400 dark:text-zinc-600">
      <p className="text-sm font-mono">{text}</p>
      {sub && <p className="text-xs mt-1">{sub}</p>}
    </div>
  )
}

function Avatar({ src, name, size, rounded }) {
  const cls = `w-${size} h-${size} flex-shrink-0 ${rounded === 'full' ? 'rounded-full' : 'rounded-xl'}`
  if (src) return <img src={src} alt={name} className={`${cls} object-cover ring-1 ring-emerald-500/20`}/>
  return (
    <div className={`${cls} bg-slate-200 dark:bg-zinc-700 flex items-center justify-center
                    text-slate-500 dark:text-zinc-400 font-semibold text-sm`}>
      {(name || '?')[0].toUpperCase()}
    </div>
  )
}

// ── Rooms Tab ─────────────────────────────────────────────────────────────────
function RoomsTab({ rooms, loading, user, navigate }) {
  const [creating,   setCreating]   = useState(false)
  const [roomName,   setRoomName]   = useState('')
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
    } finally { setSubmitting(false) }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-slate-400 dark:text-zinc-500 font-mono">
          {rooms.length} room{rooms.length !== 1 ? 's' : ''} available
        </p>
        <button onClick={() => setCreating(c => !c)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500
                     hover:bg-emerald-600 text-white text-xs font-medium transition-colors">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          New Room
        </button>
      </div>

      {creating && (
        <form onSubmit={handleCreate} className="card p-3 mb-3 flex gap-2 items-center">
          <input autoFocus value={roomName} onChange={e => setRoomName(e.target.value)}
            placeholder="Room name…" maxLength={40}
            className="flex-1 bg-transparent text-sm text-slate-900 dark:text-white
                       placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:outline-none"/>
          <button type="submit" disabled={submitting || !roomName.trim()}
            className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-600
                       disabled:opacity-40 text-white text-xs font-medium transition-colors">
            {submitting ? '…' : 'Create'}
          </button>
          <button type="button" onClick={() => setCreating(false)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </form>
      )}

      {loading ? <Spinner /> : rooms.length === 0 ? (
        <Empty text="No rooms yet. Create the first one ↑" />
      ) : (
        <ul className="flex flex-col gap-2">
          {rooms.map(room => (
            <li key={room.id}>
              <button onClick={() => navigate(`/chat/room/${room.id}`)}
                className="card card-hover w-full text-left p-4 flex items-center gap-3
                           hover:shadow-sm transition-all duration-200">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20
                                flex items-center justify-center flex-shrink-0
                                text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                  {room.name[0].toUpperCase()}
                </div>
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

// ── Messages Tab ──────────────────────────────────────────────────────────────
function MessagesTab({ dms, loading, uid, navigate, incoming, user, profile }) {
  const [accepting, setAccepting] = useState(null)
  const [declining, setDeclining] = useState(null)

  const handleAccept = async req => {
    setAccepting(req.id)
    try {
      const myInfo = {
        displayName: user.displayName || '',
        photoURL:    user.photoURL    || '',
        username:    profile?.username || '',
      }
      const dmId = await acceptFriendRequest(req.id, uid, myInfo, req.from, req.fromInfo)
      navigate(`/chat/dm/${dmId}`)
    } finally { setAccepting(null) }
  }

  const handleDecline = async req => {
    setDeclining(req.id)
    try { await declineFriendRequest(req.id) }
    finally { setDeclining(null) }
  }

  const hasContent = incoming.length > 0 || dms.length > 0

  return (
    <div>
      {/* ── Incoming requests ── */}
      {incoming.length > 0 && (
        <div className="mb-5">
          <p className="text-xs font-mono font-semibold text-slate-400 dark:text-zinc-500
                       uppercase tracking-wider mb-3">
            Requests · {incoming.length}
          </p>
          <div className="flex flex-col gap-2">
            {incoming.map(req => {
              const info  = req.fromInfo || {}
              const label = info.username ? `@${info.username}` : (info.displayName || 'Unknown')
              return (
                <div key={req.id} className="card p-4 flex items-center gap-3">
                  <Avatar src={info.photoURL} name={label} size={10} rounded="full" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 dark:text-white text-sm truncate">{label}</p>
                    <p className="text-xs text-slate-500 dark:text-zinc-500 mt-0.5">wants to message you</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => handleDecline(req)} disabled={declining === req.id}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700
                                 text-xs font-medium text-slate-500 dark:text-zinc-400
                                 hover:bg-slate-50 dark:hover:bg-zinc-800
                                 disabled:opacity-50 transition-colors">
                      {declining === req.id ? '…' : 'Decline'}
                    </button>
                    <button onClick={() => handleAccept(req)} disabled={accepting === req.id}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600
                                 disabled:opacity-50 text-white text-xs font-medium transition-colors">
                      {accepting === req.id ? '…' : 'Accept'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
          {dms.length > 0 && (
            <div className="mt-5 mb-1 border-t border-slate-100 dark:border-zinc-800"/>
          )}
        </div>
      )}

      {/* ── DM conversations ── */}
      {loading ? <Spinner /> : dms.length === 0 ? (
        !hasContent ? (
          <Empty text="No direct messages yet." sub="Search for people in the People tab." />
        ) : null
      ) : (
        <ul className="flex flex-col gap-2">
          {dms.map(dm => {
            const otherUid = dm.participants.find(p => p !== uid)
            const other    = dm.participantInfo?.[otherUid] || {}
            const label    = other.username ? `@${other.username}` : (other.displayName || 'Unknown')
            const avatar   = other.customPhotoURL || other.photoURL
            return (
              <li key={dm.id}>
                <button onClick={() => navigate(`/chat/dm/${dm.id}`)}
                  className="card card-hover w-full text-left p-4 flex items-center gap-3
                             hover:shadow-sm transition-all duration-200">
                  <Avatar src={avatar} name={label} size={10} rounded="full" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-slate-900 dark:text-white text-sm truncate">
                        {label}
                      </span>
                      <span className="text-xs text-slate-400 dark:text-zinc-600 flex-shrink-0 font-mono">
                        {timeAgo(dm.lastMessageAt)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-zinc-500 truncate mt-0.5">
                      {dm.lastMessage || 'No messages yet'}
                    </p>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                    className="text-slate-300 dark:text-zinc-700 flex-shrink-0">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

// ── People Tab ────────────────────────────────────────────────────────────────
function PeopleTab({ uid, myInfo, navigate, dms, outgoing, incoming }) {
  const [queryStr,  setQueryStr]  = useState('')
  const [results,   setResults]   = useState([])
  const [searching, setSearching] = useState(false)
  const [sending,   setSending]   = useState(null)
  const [accepting, setAccepting] = useState(null)
  const [declining, setDeclining] = useState(null)

  useEffect(() => {
    if (!queryStr.trim()) { setResults([]); return }
    const t = setTimeout(async () => {
      setSearching(true)
      const res = await searchUsers(queryStr, uid)
      setResults(res)
      setSearching(false)
    }, 400)
    return () => clearTimeout(t)
  }, [queryStr, uid])

  // Returns: 'connected' | 'pending-sent' | 'pending-received' | 'none'
  const getRelation = otherUid => {
    if (dms.some(d => d.id === getDMId(uid, otherUid)))  return 'connected'
    if (outgoing.some(r => r.to   === otherUid))          return 'pending-sent'
    if (incoming.some(r => r.from === otherUid))          return 'pending-received'
    return 'none'
  }

  const getIncomingReq = otherUid => incoming.find(r => r.from === otherUid)

  const handleAdd = async other => {
    setSending(other.uid)
    try { await sendFriendRequest(uid, myInfo, other.uid) }
    finally { setSending(null) }
  }

  const handleAccept = async other => {
    const req = getIncomingReq(other.uid)
    if (!req) return
    setAccepting(other.uid)
    try {
      const dmId = await acceptFriendRequest(req.id, uid, myInfo, req.from, req.fromInfo)
      navigate(`/chat/dm/${dmId}`)
    } finally { setAccepting(null) }
  }

  const handleDecline = async other => {
    const req = getIncomingReq(other.uid)
    if (!req) return
    setDeclining(other.uid)
    try { await declineFriendRequest(req.id) }
    finally { setDeclining(null) }
  }

  return (
    <div>
      <div className="relative mb-4">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round"
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 pointer-events-none">
          <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
        </svg>
        <input value={queryStr} onChange={e => setQueryStr(e.target.value)}
          placeholder="Search by name or @username…"
          className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-zinc-800 rounded-xl
                     text-sm text-slate-900 dark:text-white
                     placeholder:text-slate-400 dark:placeholder:text-zinc-500
                     focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"/>
      </div>

      {searching ? <Spinner /> : results.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {results.map(u => {
            const label  = u.username ? `@${u.username}` : (u.displayName || 'Unknown')
            const avatar = u.customPhotoURL || u.photoURL
            const rel    = getRelation(u.uid)

            return (
              <li key={u.uid} className="card p-3 flex items-center gap-3">
                <Avatar src={avatar} name={label} size={10} rounded="full" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 dark:text-white text-sm truncate">{label}</p>
                  {u.username && (
                    <p className="text-xs text-slate-500 dark:text-zinc-500 truncate">{u.displayName}</p>
                  )}
                  {u.bio && (
                    <p className="text-xs text-slate-400 dark:text-zinc-600 truncate mt-0.5">{u.bio}</p>
                  )}
                </div>

                {/* Action area — varies by relation */}
                {rel === 'connected' && (
                  <button onClick={() => navigate(`/chat/dm/${getDMId(uid, u.uid)}`)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600
                               text-white text-xs font-medium transition-colors flex-shrink-0">
                    Message
                  </button>
                )}

                {rel === 'pending-sent' && (
                  <span className="px-3 py-1.5 rounded-lg text-xs font-medium flex-shrink-0
                                   bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400
                                   border border-amber-200 dark:border-amber-500/20">
                    Pending…
                  </span>
                )}

                {rel === 'pending-received' && (
                  <div className="flex gap-1.5 flex-shrink-0">
                    <button onClick={() => handleDecline(u)} disabled={declining === u.uid}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700
                                 text-xs font-medium text-slate-500 dark:text-zinc-400
                                 hover:bg-slate-50 dark:hover:bg-zinc-800 disabled:opacity-50 transition-colors">
                      {declining === u.uid ? '…' : 'Decline'}
                    </button>
                    <button onClick={() => handleAccept(u)} disabled={accepting === u.uid}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600
                                 disabled:opacity-50 text-white text-xs font-medium transition-colors">
                      {accepting === u.uid ? '…' : 'Accept'}
                    </button>
                  </div>
                )}

                {rel === 'none' && (
                  <button onClick={() => handleAdd(u)} disabled={sending === u.uid}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600
                               disabled:opacity-50 text-white text-xs font-medium transition-colors flex-shrink-0">
                    {sending === u.uid ? '…' : 'Add'}
                  </button>
                )}
              </li>
            )
          })}
        </ul>
      ) : (
        <p className="text-center text-sm text-slate-400 dark:text-zinc-600 py-10 font-mono">
          {queryStr.trim() ? `No users found for "${queryStr}"` : 'Type to search for people'}
        </p>
      )}
    </div>
  )
}

// ── Recent Activity ───────────────────────────────────────────────────────────
function RecentActivity({ rooms, dms, uid, navigate }) {
  const items = useMemo(() => {
    const roomItems = rooms.map(r => ({ ...r, _type: 'room' }))
    const dmItems   = dms.map(d => ({ ...d, _type: 'dm' }))
    return [...roomItems, ...dmItems]
      .filter(x => x.lastMessage)
      .sort((a, b) =>
        (b.lastMessageAt?.toMillis?.() || 0) - (a.lastMessageAt?.toMillis?.() || 0))
      .slice(0, 5)
  }, [rooms, dms])

  if (!items.length) return null

  return (
    <div className="mt-8">
      <p className="text-xs font-mono font-semibold text-slate-400 dark:text-zinc-500
                   uppercase tracking-wider mb-3">
        Recent Activity
      </p>
      <div className="flex flex-col gap-1">
        {items.map(item => {
          const isRoom = item._type === 'room'
          let label, avatar, href

          if (isRoom) {
            label = item.name
            href  = `/chat/room/${item.id}`
          } else {
            const otherUid = item.participants.find(p => p !== uid)
            const other    = item.participantInfo?.[otherUid] || {}
            label  = other.username ? `@${other.username}` : (other.displayName || 'Unknown')
            avatar = other.customPhotoURL || other.photoURL
            href   = `/chat/dm/${item.id}`
          }

          return (
            <button key={item.id} onClick={() => navigate(href)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl
                         hover:bg-slate-100 dark:hover:bg-zinc-800/60 text-left transition-colors">
              {isRoom ? (
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20
                                flex items-center justify-center flex-shrink-0
                                text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                  {label[0]?.toUpperCase()}
                </div>
              ) : (
                <Avatar src={avatar} name={label} size={8} rounded="full" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-800 dark:text-zinc-200 truncate">{label}</span>
                  <span className="text-[10px] text-slate-400 dark:text-zinc-600 font-mono flex-shrink-0">
                    {timeAgo(item.lastMessageAt)}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-zinc-500 truncate">{item.lastMessage}</p>
              </div>
              <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full flex-shrink-0
                ${isRoom
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'}`}>
                {isRoom ? 'room' : 'dm'}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Hub Root ──────────────────────────────────────────────────────────────────
function ChatHubContent() {
  const { user }    = useChatAuth()
  const { profile } = useProfile(user?.uid)
  const { rooms, loading: roomsLoading } = useRooms()
  const { dms,   loading: dmsLoading   } = useDMs(user?.uid)
  const { incoming, outgoing }           = useFriendRequests(user?.uid)
  const navigate    = useNavigate()
  const [tab, setTab] = useState('rooms')

  const myInfo = {
    displayName: user?.displayName || '',
    photoURL:    user?.photoURL    || '',
    username:    profile?.username || '',
  }

  const TABS = [
    { key: 'rooms',    label: 'Rooms'    },
    { key: 'messages', label: 'Messages', badge: incoming.length },
    { key: 'people',   label: 'People'   },
  ]

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 sm:py-8">

      {/* Tab bar */}
      <div className="flex gap-1 mb-6 bg-slate-100 dark:bg-zinc-800/60 rounded-xl p-1">
        {TABS.map(({ key, label, badge }) => (
          <button key={key} onClick={() => setTab(key)}
            className={`relative flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-150
              ${tab === key
                ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-300'
              }`}>
            {label}
            {badge > 0 && (
              <span className="absolute top-1 right-3 min-w-[16px] h-4 rounded-full
                               bg-red-500 text-white text-[10px] font-bold
                               flex items-center justify-center px-1">
                {badge > 9 ? '9+' : badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'rooms' && (
        <RoomsTab rooms={rooms} loading={roomsLoading} user={user} navigate={navigate} />
      )}
      {tab === 'messages' && (
        <MessagesTab
          dms={dms} loading={dmsLoading} uid={user?.uid} navigate={navigate}
          incoming={incoming} user={user} profile={profile}
        />
      )}
      {tab === 'people' && (
        <PeopleTab
          uid={user?.uid} myInfo={myInfo} navigate={navigate}
          dms={dms} outgoing={outgoing} incoming={incoming}
        />
      )}

      <RecentActivity rooms={rooms} dms={dms} uid={user?.uid} navigate={navigate} />
    </div>
  )
}

export function Rooms() {
  return <ProtectedRoute><ChatHubContent /></ProtectedRoute>
}

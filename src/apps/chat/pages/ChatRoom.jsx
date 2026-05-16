import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useChatAuth } from '../context/AuthContext'
import { useMessages } from '../hooks/useMessages'
import { sendMessage, getRoom } from '../lib/chatService'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { ChatNavbar } from '../components/ChatNavbar'

function fmtTime(ts) {
  if (!ts) return ''
  return ts.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function ChatRoomContent() {
  const { roomId }            = useParams()
  const { user }              = useChatAuth()
  const { messages, loading } = useMessages(roomId)

  const [room,    setRoom]    = useState(null)
  const [text,    setText]    = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef(null)
  const inputRef  = useRef(null)

  useEffect(() => { getRoom(roomId).then(setRoom) }, [roomId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async e => {
    e.preventDefault()
    if (!text.trim() || sending) return
    const msg = text.trim()
    setText('')
    setSending(true)
    try {
      await sendMessage(roomId, msg, user)
    } finally {
      setSending(false)
      inputRef.current?.focus()
    }
  }

  return (
    <div className="flex flex-col" style={{ height: '100vh' }}>
      <ChatNavbar roomName={room?.name} />

      {/* ── Messages scroll area — pt-14 clears the fixed navbar ── */}
      <div className="flex-1 overflow-y-auto pt-14 pb-4">
        {/* Centered column — same width as input */}
        <div className="max-w-2xl mx-auto px-4 space-y-1">

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-5 h-5 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin"/>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3
                            text-slate-400 dark:text-zinc-600">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
              </svg>
              <p className="text-sm font-mono">No messages yet — say hello!</p>
            </div>
          ) : (
            messages.map((msg, i) => {
              const isMe       = msg.uid === user.uid
              const prevSame   = i > 0 && messages[i - 1].uid === msg.uid
              const showAvatar = !isMe && !prevSame
              const showName   = !isMe && !prevSame
              const isLast     = i === messages.length - 1 ||
                                 messages[i + 1].uid !== msg.uid
              const gap        = prevSame ? 'mt-0.5' : 'mt-3'

              return (
                <div key={msg.id}
                  className={`flex items-end gap-2 ${gap} ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>

                  {/* Avatar slot — always reserve space so bubbles align */}
                  <div className="w-8 h-8 flex-shrink-0">
                    {showAvatar && (
                      <img src={msg.photoURL} alt={msg.displayName}
                        className="w-8 h-8 rounded-full ring-1 ring-emerald-500/30 object-cover" />
                    )}
                  </div>

                  <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}
                                  max-w-[75%] sm:max-w-[65%]`}>
                    {showName && (
                      <span className="text-[11px] text-slate-400 dark:text-zinc-500
                                       font-mono mb-1 px-1">
                        {msg.displayName}
                      </span>
                    )}

                    <div className={`px-3.5 py-2.5 text-sm leading-relaxed break-words
                      ${isMe
                        ? `bg-emerald-500 text-white
                           ${prevSame ? 'rounded-2xl rounded-tr-md' : 'rounded-2xl rounded-tr-md'}
                           ${isLast  ? 'rounded-br-sm' : ''}`
                        : `bg-white dark:bg-zinc-800
                           border border-slate-200 dark:border-zinc-700
                           text-slate-900 dark:text-white
                           ${prevSame ? 'rounded-2xl rounded-tl-md' : 'rounded-2xl rounded-tl-md'}
                           ${isLast  ? 'rounded-bl-sm' : ''}`
                      }`}>
                      {msg.text}
                    </div>

                    {isLast && (
                      <span className="text-[10px] text-slate-400 dark:text-zinc-600
                                       font-mono mt-1 px-1">
                        {fmtTime(msg.createdAt)}
                      </span>
                    )}
                  </div>
                </div>
              )
            })
          )}

          <div ref={bottomRef} className="h-2" />
        </div>
      </div>

      {/* ── Input bar ── */}
      <div className="border-t border-slate-200 dark:border-zinc-800
                      bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md
                      px-4 py-3"
           style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
        <form onSubmit={handleSend}
          className="flex items-center gap-2 max-w-2xl mx-auto">

          <img src={user.photoURL} alt=""
            className="w-8 h-8 rounded-full flex-shrink-0 hidden sm:block object-cover" />

          <input
            ref={inputRef}
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) handleSend(e) }}
            placeholder="Type a message…"
            autoComplete="off"
            className="flex-1 bg-slate-100 dark:bg-zinc-800 rounded-2xl
                       px-4 py-2.5 text-sm text-slate-900 dark:text-white
                       placeholder:text-slate-400 dark:placeholder:text-zinc-500
                       focus:outline-none focus:ring-2 focus:ring-emerald-500/50
                       transition-all duration-200 min-h-[44px]"
          />

          <button type="submit" disabled={!text.trim() || sending}
            className="w-11 h-11 rounded-2xl bg-emerald-500 hover:bg-emerald-600 active:scale-95
                       disabled:opacity-40 disabled:cursor-not-allowed
                       flex items-center justify-center flex-shrink-0
                       transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              className="text-white translate-x-px">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
            </svg>
          </button>
        </form>
      </div>
    </div>
  )
}

export function ChatRoom() {
  return <ProtectedRoute><ChatRoomContent /></ProtectedRoute>
}

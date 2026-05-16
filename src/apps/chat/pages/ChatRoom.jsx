import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useChatAuth } from '../context/AuthContext'
import { useMessages } from '../hooks/useMessages'
import { useTyping } from '../hooks/useTyping'
import { sendMessage, getRoom, setTyping, markMessagesRead } from '../lib/chatService'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { ChatNavbar } from '../components/ChatNavbar'

function fmtTime(ts) {
  if (!ts) return ''
  return ts.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// ── Tick icons ─────────────────────────────────────────────────────────────────
function Ticks({ msg, myUid }) {
  const isRead = (msg.readBy || []).some(uid => uid !== myUid)
  return isRead ? (
    // Double blue tick
    <span className="inline-flex items-center" aria-label="Read">
      <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
        <path d="M1 5l3 3 5-7" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6 5l3 3 5-7" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </span>
  ) : (
    // Single gray tick
    <span className="inline-flex items-center" aria-label="Delivered">
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <path d="M1 5l3 3 5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
          className="text-white/60"/>
      </svg>
    </span>
  )
}

// ── Typing dots ────────────────────────────────────────────────────────────────
function TypingBubble({ names }) {
  const label = names.length === 1
    ? `${names[0]} is typing`
    : `${names.join(', ')} are typing`

  return (
    <div className="flex items-end gap-2 mt-3">
      <div className="w-8 h-8 flex-shrink-0"/>
      <div className="flex flex-col items-start max-w-[75%] sm:max-w-[65%]">
        <span className="text-[11px] text-slate-400 dark:text-zinc-500 font-mono mb-1 px-1">
          {label}
        </span>
        <div className="bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700
                        rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
          {[0, 150, 300].map(delay => (
            <span key={delay}
              className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-zinc-500 animate-bounce"
              style={{ animationDelay: `${delay}ms`, animationDuration: '1s' }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
function ChatRoomContent() {
  const { roomId }            = useParams()
  const { user }              = useChatAuth()
  const { messages, loading } = useMessages(roomId)
  const typers                = useTyping(roomId, user.uid)

  const [room,    setRoom]    = useState(null)
  const [text,    setText]    = useState('')
  const [sending, setSending] = useState(false)

  const bottomRef   = useRef(null)
  const inputRef    = useRef(null)
  const typingTimer = useRef(null)

  useEffect(() => { getRoom(roomId).then(setRoom) }, [roomId])

  // Mark incoming messages as read whenever messages list changes
  useEffect(() => {
    if (!loading && messages.length > 0) {
      markMessagesRead(roomId, user.uid, messages)
    }
  }, [messages, roomId, user.uid, loading])

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typers])

  // Clear typing state on unmount
  useEffect(() => {
    return () => {
      clearTimeout(typingTimer.current)
      setTyping(roomId, user, false).catch(() => {})
    }
  }, [roomId, user])

  const handleInput = useCallback(e => {
    const val = e.target.value
    setText(val)

    if (val.trim()) {
      setTyping(roomId, user, true)
      clearTimeout(typingTimer.current)
      typingTimer.current = setTimeout(() => {
        setTyping(roomId, user, false)
      }, 3000)
    } else {
      clearTimeout(typingTimer.current)
      setTyping(roomId, user, false)
    }
  }, [roomId, user])

  const handleSend = useCallback(async e => {
    e.preventDefault()
    if (!text.trim() || sending) return
    const msg = text.trim()
    setText('')
    setSending(true)
    clearTimeout(typingTimer.current)
    setTyping(roomId, user, false)
    try {
      await sendMessage(roomId, msg, user)
    } finally {
      setSending(false)
      inputRef.current?.focus()
    }
  }, [text, sending, roomId, user])

  return (
    <div className="flex flex-col" style={{ height: '100vh' }}>
      <ChatNavbar roomName={room?.name} />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto pt-14 pb-2">
        <div className="max-w-2xl mx-auto px-4 py-4">

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
            <>
              {messages.map((msg, i) => {
                const isMe     = msg.uid === user.uid
                const prevSame = i > 0 && messages[i - 1].uid === msg.uid
                const isLast   = i === messages.length - 1 || messages[i + 1].uid !== msg.uid
                const gap      = prevSame ? 'mt-0.5' : 'mt-3'

                return (
                  <div key={msg.id}
                    className={`flex items-end gap-2 ${gap} ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>

                    {/* Avatar slot */}
                    <div className="w-8 h-8 flex-shrink-0">
                      {!isMe && !prevSame && (
                        <img src={msg.photoURL} alt={msg.displayName}
                          className="w-8 h-8 rounded-full ring-1 ring-emerald-500/30 object-cover"/>
                      )}
                    </div>

                    <div className={`flex flex-col max-w-[75%] sm:max-w-[65%]
                                    ${isMe ? 'items-end' : 'items-start'}`}>
                      {!isMe && !prevSame && (
                        <span className="text-[11px] text-slate-400 dark:text-zinc-500
                                         font-mono mb-1 px-1">
                          {msg.displayName}
                        </span>
                      )}

                      <div className={`px-3.5 py-2.5 text-sm leading-relaxed break-words
                        ${isMe
                          ? 'bg-emerald-500 text-white rounded-2xl rounded-tr-md' +
                            (isLast ? ' rounded-br-sm' : '')
                          : 'bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 ' +
                            'text-slate-900 dark:text-white rounded-2xl rounded-tl-md' +
                            (isLast ? ' rounded-bl-sm' : '')
                        }`}>
                        {msg.text}
                      </div>

                      {isLast && (
                        <div className={`flex items-center gap-1 mt-1 px-1
                                        ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                          <span className="text-[10px] text-slate-400 dark:text-zinc-600 font-mono">
                            {fmtTime(msg.createdAt)}
                          </span>
                          {isMe && <Ticks msg={msg} myUid={user.uid} />}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}

              {/* Typing indicator */}
              {typers.length > 0 && <TypingBubble names={typers} />}
            </>
          )}

          <div ref={bottomRef} className="h-1" />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-slate-200 dark:border-zinc-800
                      bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md px-4 py-3"
           style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
        <form onSubmit={handleSend}
          className="flex items-center gap-2 max-w-2xl mx-auto">
          <img src={user.photoURL} alt=""
            className="w-8 h-8 rounded-full flex-shrink-0 hidden sm:block object-cover"/>
          <input
            ref={inputRef}
            value={text}
            onChange={handleInput}
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

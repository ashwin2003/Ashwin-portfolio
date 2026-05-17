import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useChatAuth } from '../context/AuthContext'
import { useProfile } from '../hooks/useProfile'
import { ProfileModal } from './ProfileModal'

export function ChatNavbar({ roomName }) {
  const { user, logout }  = useChatAuth()
  const { profile }       = useProfile(user?.uid)
  const navigate          = useNavigate()
  const { pathname }      = useLocation()
  const inRoom            = pathname.includes('/room/') || pathname.includes('/dm/')
  const [showProfile, setShowProfile] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/chat/login', { replace: true })
  }

  const avatarSrc = profile?.customPhotoURL || user?.photoURL

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 h-14
                         bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md
                         border-b border-slate-200 dark:border-zinc-800">
        <div className="section-container h-full flex items-center justify-between gap-4">

          {/* Left — navigation */}
          <div className="flex items-center gap-1 min-w-0">
            {inRoom ? (
              <>
                {/* Back in history */}
                <button
                  onClick={() => navigate(-1)}
                  title="Go back"
                  className="p-1.5 rounded-lg text-slate-500 dark:text-zinc-400
                             hover:text-slate-900 dark:hover:text-white
                             hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all flex-shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5M12 5l-7 7 7 7"/>
                  </svg>
                </button>

                {/* Chat home */}
                <button
                  onClick={() => navigate('/chat')}
                  title="Chat home"
                  className="flex items-center gap-1 px-2 py-1 rounded-lg
                             hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all flex-shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    className="text-slate-400 dark:text-zinc-500">
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                  <span className="font-mono font-bold text-slate-400 dark:text-zinc-500 text-xs">
                    CHAT<span className="text-emerald-500">.</span>
                  </span>
                </button>

                {/* Separator + room/DM name */}
                {roomName && (
                  <>
                    <span className="text-slate-200 dark:text-zinc-700 text-sm flex-shrink-0">/</span>
                    <span className="font-mono font-semibold text-slate-900 dark:text-white text-sm
                                     truncate max-w-[120px] sm:max-w-[200px]">
                      {roomName}
                    </span>
                  </>
                )}
              </>
            ) : (
              <>
                <Link to="/"
                  title="Back to portfolio"
                  className="p-1.5 rounded-lg text-slate-400 dark:text-zinc-500
                             hover:text-emerald-500 hover:bg-slate-100 dark:hover:bg-zinc-800
                             transition-all flex-shrink-0"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5M12 5l-7 7 7 7"/>
                  </svg>
                </Link>
                <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                  CHAT<span className="text-emerald-500">.</span>
                </span>
              </>
            )}
          </div>

          {/* Right — user controls */}
          {user && (
            <div className="flex items-center gap-2 flex-shrink-0">

              {/* Portfolio link (only visible in rooms on desktop) */}
              {inRoom && (
                <Link to="/"
                  className="hidden md:block text-xs font-mono text-slate-400 dark:text-zinc-600
                             hover:text-emerald-500 transition-colors">
                  ← portfolio
                </Link>
              )}

              {/* Username */}
              <span className="hidden sm:block text-xs text-slate-500 dark:text-zinc-400
                               font-mono truncate max-w-[100px]">
                {profile?.username ? `@${profile.username}` : user.displayName}
              </span>

              {/* Avatar → profile modal */}
              <button
                onClick={() => setShowProfile(true)}
                className="relative group focus:outline-none"
                aria-label="Edit profile"
              >
                <img src={avatarSrc} alt={user.displayName}
                  className="w-7 h-7 rounded-full object-cover ring-2 ring-emerald-500/40
                             group-hover:ring-emerald-500 transition-all duration-200"/>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full
                                 bg-white dark:bg-zinc-950 flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"/>
                </span>
              </button>

              {/* Sign out */}
              <button onClick={handleLogout}
                title="Sign out"
                className="p-1.5 rounded-lg text-slate-400 dark:text-zinc-500
                           hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10
                           transition-all duration-200">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
                </svg>
              </button>
            </div>
          )}
        </div>
      </header>

      {showProfile && user && (
        <ProfileModal user={user} onClose={() => setShowProfile(false)} />
      )}
    </>
  )
}

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
  const inRoom            = pathname.includes('/room/')
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

          {/* Left */}
          <div className="flex items-center gap-3">
            {inRoom ? (
              <button onClick={() => navigate('/chat')}
                className="text-slate-500 dark:text-zinc-400 hover:text-slate-900
                           dark:hover:text-white transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 5l-7 7 7 7"/>
                </svg>
              </button>
            ) : (
              <Link to="/"
                className="text-xs font-mono text-slate-400 dark:text-zinc-500
                           hover:text-emerald-500 transition-colors">
                ← portfolio
              </Link>
            )}
            <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
              {inRoom && roomName
                ? roomName
                : <><span>CHAT</span><span className="text-emerald-500">.</span></>}
            </span>
          </div>

          {/* Right */}
          {user && (
            <div className="flex items-center gap-3">

              {/* Avatar — click to open profile */}
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

              {/* Username or display name */}
              <span className="hidden sm:block text-xs text-slate-600 dark:text-zinc-400
                               font-mono truncate max-w-[120px]">
                {profile?.username ? `@${profile.username}` : user.displayName}
              </span>

              <button onClick={handleLogout}
                className="text-xs font-mono text-slate-400 dark:text-zinc-500
                           hover:text-red-400 transition-colors duration-200">
                sign out
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

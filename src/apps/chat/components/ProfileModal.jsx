import { useState, useRef, useEffect } from 'react'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { storage } from '../../../lib/firebase'
import { updateUserProfile, isUsernameTaken } from '../lib/chatService'
import { useProfile } from '../hooks/useProfile'

const USERNAME_RE = /^[a-z0-9_]{3,20}$/

export function ProfileModal({ user, onClose }) {
  const { profile } = useProfile(user.uid)

  const [username,   setUsername]   = useState('')
  const [bio,        setBio]        = useState('')
  const [preview,    setPreview]    = useState(null)   // local blob URL
  const [uploadFile, setUploadFile] = useState(null)
  const [progress,   setProgress]   = useState(null)   // 0-100
  const [saving,     setSaving]     = useState(false)
  const [error,      setError]      = useState('')
  const [success,    setSuccess]    = useState(false)
  const fileRef = useRef(null)

  // Populate fields once profile loads
  useEffect(() => {
    if (!profile) return
    setUsername(profile.username || '')
    setBio(profile.bio || '')
    setPreview(profile.customPhotoURL || null)
  }, [profile])

  const avatarSrc = preview || user.photoURL

  const handleFileChange = e => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { setError('Please pick an image file.'); return }
    if (file.size > 5 * 1024 * 1024)    { setError('Image must be under 5 MB.');  return }
    setError('')
    setUploadFile(file)
    setPreview(URL.createObjectURL(file))
  }

  const uploadAvatar = () =>
    new Promise((resolve, reject) => {
      const storageRef = ref(storage, `avatars/${user.uid}`)
      const task = uploadBytesResumable(storageRef, uploadFile)
      task.on('state_changed',
        snap => setProgress(Math.round(snap.bytesTransferred / snap.totalBytes * 100)),
        reject,
        async () => resolve(await getDownloadURL(task.snapshot.ref))
      )
    })

  const handleSave = async () => {
    setError('')
    setSuccess(false)

    const uname = username.trim().toLowerCase()
    if (uname && !USERNAME_RE.test(uname)) {
      setError('Username: 3–20 chars, letters/numbers/underscore only.')
      return
    }
    if (uname) {
      const taken = await isUsernameTaken(uname, user.uid)
      if (taken) { setError('That username is already taken.'); return }
    }

    setSaving(true)
    try {
      let customPhotoURL = undefined
      if (uploadFile) customPhotoURL = await uploadAvatar()
      await updateUserProfile(user.uid, { username: uname, bio: bio.trim(), customPhotoURL })
      setSuccess(true)
      setUploadFile(null)
      setProgress(null)
      setTimeout(onClose, 800)
    } catch (e) {
      setError('Something went wrong. Try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}>

      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}/>

      {/* Card */}
      <div className="relative w-full max-w-md bg-white dark:bg-zinc-900
                      rounded-2xl shadow-2xl border border-slate-200 dark:border-zinc-800
                      overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4
                        border-b border-slate-200 dark:border-zinc-800">
          <h2 className="font-semibold text-slate-900 dark:text-white">Edit Profile</h2>
          <button onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300
                       transition-colors focus:outline-none">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">

          {/* Avatar upload */}
          <div className="flex flex-col items-center gap-3">
            <button onClick={() => fileRef.current?.click()}
              className="relative group focus:outline-none">
              <img src={avatarSrc} alt="Avatar"
                className="w-20 h-20 rounded-full object-cover ring-4 ring-emerald-500/20
                           group-hover:ring-emerald-500/60 transition-all duration-200"/>
              <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/35
                              flex items-center justify-center transition-all duration-200">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                </svg>
              </div>
            </button>
            <input ref={fileRef} type="file" accept="image/*"
              className="hidden" onChange={handleFileChange}/>
            {progress !== null && progress < 100 && (
              <div className="w-32 h-1.5 bg-slate-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full transition-all duration-200"
                  style={{ width: `${progress}%` }}/>
              </div>
            )}
            <p className="text-xs text-slate-400 dark:text-zinc-600">
              Click avatar to upload a new photo
            </p>
          </div>

          {/* Read-only: Google info */}
          <div className="space-y-3">
            <Field label="Name" value={user.displayName} locked />
            <Field label="Email" value={user.email} locked />
          </div>

          {/* Editable fields */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-zinc-400 mb-1.5">
                Username
              </label>
              <div className="flex items-center bg-slate-100 dark:bg-zinc-800 rounded-xl
                              px-3 focus-within:ring-2 focus-within:ring-emerald-500/50 transition-all">
                <span className="text-slate-400 dark:text-zinc-500 text-sm">@</span>
                <input
                  value={username}
                  onChange={e => setUsername(e.target.value.toLowerCase())}
                  placeholder="your_handle"
                  maxLength={20}
                  className="flex-1 bg-transparent py-2.5 px-2 text-sm
                             text-slate-900 dark:text-white placeholder:text-slate-400
                             dark:placeholder:text-zinc-600 focus:outline-none"
                />
              </div>
              <p className="text-[11px] text-slate-400 dark:text-zinc-600 mt-1 ml-1">
                3–20 chars · letters, numbers, underscore
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-zinc-400 mb-1.5">
                Bio
              </label>
              <textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                placeholder="Tell people a little about yourself…"
                maxLength={120}
                rows={2}
                className="w-full bg-slate-100 dark:bg-zinc-800 rounded-xl px-3 py-2.5
                           text-sm text-slate-900 dark:text-white resize-none
                           placeholder:text-slate-400 dark:placeholder:text-zinc-600
                           focus:outline-none focus:ring-2 focus:ring-emerald-500/50
                           transition-all duration-200"
              />
              <p className="text-[11px] text-slate-400 dark:text-zinc-600 mt-0.5 ml-1 text-right">
                {bio.length}/120
              </p>
            </div>
          </div>

          {/* Feedback */}
          {error && (
            <p className="text-xs text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-500/10
                          border border-red-200 dark:border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
          {success && (
            <p className="text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50
                          dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20
                          rounded-lg px-3 py-2">
              Profile saved ✓
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700
                       text-sm font-medium text-slate-600 dark:text-zinc-400
                       hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600
                       disabled:opacity-50 text-white text-sm font-medium
                       transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500">
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, value, locked }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-500 dark:text-zinc-400 mb-1.5">
        {label}
      </label>
      <div className="flex items-center gap-2 bg-slate-100 dark:bg-zinc-800
                      rounded-xl px-3 py-2.5 opacity-60">
        <span className="flex-1 text-sm text-slate-700 dark:text-zinc-300 truncate">{value}</span>
        {locked && (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round"
            className="text-slate-400 dark:text-zinc-500 flex-shrink-0">
            <rect x="3" y="11" width="18" height="11" rx="2"/>
            <path d="M7 11V7a5 5 0 0110 0v4"/>
          </svg>
        )}
      </div>
    </div>
  )
}

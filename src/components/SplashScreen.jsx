import { useState, useEffect } from 'react'

export function SplashScreen({ onDone }) {
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 800)
    const doneTimer = setTimeout(onDone, 1200)
    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(doneTimer)
    }
  }, [onDone])

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-zinc-950 flex items-center justify-center ${fading ? 'opacity-0' : 'opacity-100'}`}
      style={{ transition: 'opacity 0.4s ease-out' }}
      aria-hidden="true"
    >
      <div className="font-mono text-4xl font-bold tracking-tight">
        <span className="text-white">AJ</span>
        <span className="text-emerald-500">.</span>
      </div>
    </div>
  )
}

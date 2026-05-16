import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const BRUSH_R      = 80     // smudge brush radius (px)
const SMEAR        = 0.40   // pixel drag fraction
const IDLE_DELAY   = 2000   // ms of no movement before restoration begins
const RESTORE_RATE = 0.032  // per-frame blend toward original once idle
                            // 0.032 → ~98% healed after ~120 frames (2 s at 60 fps)

export function AshwinJagarwal() {
  const navigate  = useNavigate()
  const canvasRef = useRef(null)

  // Lock scroll + restore system cursor
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.body.classList.add('cursor-default')
    return () => {
      document.body.style.overflow = prev
      document.body.classList.remove('cursor-default')
    }
  }, [])

  useEffect(() => {
    const display = canvasRef.current
    if (!display) return
    const dCtx = display.getContext('2d')

    const mkC = () => document.createElement('canvas')
    const orig = mkC()
    const work = mkC()
    const scr  = mkC()
    const msk  = mkC()
    const tmp  = mkC()

    const oCtx = orig.getContext('2d')
    const wCtx = work.getContext('2d')
    const sCtx = scr .getContext('2d')
    const mCtx = msk .getContext('2d')
    const tCtx = tmp .getContext('2d')

    let animId
    let mx = 0, my = 0, px = 0, py = 0
    let hasMouse    = false
    let lastMoveAt  = 0       // timestamp of last mousemove
    let isSmudged   = false   // true once the user has smudged anything

    const img = new Image()

    const bake = () => {
      const W = window.innerWidth
      const H = window.innerHeight
      ;[display, orig, work, scr, msk, tmp].forEach(c => {
        c.width = W; c.height = H
      })
      if (!img.complete || !img.naturalWidth) return

      const scale = Math.max(W / img.naturalWidth, H / img.naturalHeight)
      const sw = img.naturalWidth  * scale
      const sh = img.naturalHeight * scale
      const ox = (W - sw) / 2
      const oy = 0

      oCtx.drawImage(img, ox, oy, sw, sh)
      wCtx.clearRect(0, 0, W, H)
      wCtx.drawImage(img, ox, oy, sw, sh)
    }

    img.onload = bake
    img.src = '/ashwin.jpg'
    window.addEventListener('resize', bake, { passive: true })

    const onMouseMove = e => {
      mx = e.clientX
      my = e.clientY
      hasMouse   = true
      lastMoveAt = performance.now()
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true })

    // ── Directional smudge ────────────────────────────────────────────────────
    const applySmudge = (cx, cy, dx, dy) => {
      const speed = Math.sqrt(dx * dx + dy * dy)
      if (speed < 0.8) return
      isSmudged = true

      const W = work.width
      const H = work.height
      const strength = Math.min(0.42 + speed * 0.014, 0.78)

      sCtx.clearRect(0, 0, W, H)
      sCtx.drawImage(work, dx * SMEAR, dy * SMEAR)

      mCtx.clearRect(0, 0, W, H)
      const g = mCtx.createRadialGradient(cx, cy, 0, cx, cy, BRUSH_R)
      g.addColorStop(0,    `rgba(0,0,0,${strength.toFixed(3)})`)
      g.addColorStop(0.55, `rgba(0,0,0,${(strength * 0.42).toFixed(3)})`)
      g.addColorStop(1,    'rgba(0,0,0,0)')
      mCtx.fillStyle = g
      mCtx.fillRect(0, 0, W, H)

      tCtx.clearRect(0, 0, W, H)
      tCtx.drawImage(scr, 0, 0)
      tCtx.globalCompositeOperation = 'destination-in'
      tCtx.drawImage(msk, 0, 0)
      tCtx.globalCompositeOperation = 'source-over'

      wCtx.drawImage(tmp, 0, 0)
    }

    // ── Render loop ───────────────────────────────────────────────────────────
    const tick = () => {
      const now  = performance.now()
      const idle = now - lastMoveAt   // ms since last mouse movement

      // Restore toward original only after IDLE_DELAY ms of no movement
      if (isSmudged && idle > IDLE_DELAY) {
        wCtx.globalAlpha = RESTORE_RATE
        wCtx.drawImage(orig, 0, 0)
        wCtx.globalAlpha = 1
      }

      // Smudge while cursor is moving
      if (hasMouse && idle < 100) {
        applySmudge(mx, my, mx - px, my - py)
      }
      px = mx; py = my

      dCtx.drawImage(work, 0, 0)
      animId = requestAnimationFrame(tick)
    }
    animId = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('resize', bake)
      window.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <div
      onClick={() => navigate('/')}
      style={{ position: 'fixed', inset: 0, overflow: 'hidden' }}
    >
      <canvas ref={canvasRef} style={{ display: 'block' }} />
    </div>
  )
}

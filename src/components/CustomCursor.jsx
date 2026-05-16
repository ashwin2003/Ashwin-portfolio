import { useEffect, useRef } from 'react'

export function CustomCursor() {
  const dotRef  = useRef(null)
  const ringRef = useRef(null)
  const glowRef = useRef(null)

  useEffect(() => {
    // Only run on devices with a real mouse
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let animId
    let tx = -200, ty = -200          // target (precise)
    let rx = -200, ry = -200          // ring   (lerped, medium)
    let gx = -200, gy = -200          // glow   (lerped, slow)

    const onMove = e => { tx = e.clientX; ty = e.clientY }

    const setRingExpanded = expanded => {
      if (!ringRef.current) return
      const r = ringRef.current
      if (expanded) {
        r.style.width        = '54px'
        r.style.height       = '54px'
        r.style.marginLeft   = '-27px'
        r.style.marginTop    = '-27px'
        r.style.borderColor  = 'rgba(52,211,153,0.85)'
        r.style.boxShadow    = '0 0 22px rgba(16,185,129,0.55), inset 0 0 14px rgba(16,185,129,0.18)'
      } else {
        r.style.width        = '36px'
        r.style.height       = '36px'
        r.style.marginLeft   = '-18px'
        r.style.marginTop    = '-18px'
        r.style.borderColor  = 'rgba(16,185,129,0.60)'
        r.style.boxShadow    = '0 0 12px rgba(16,185,129,0.30), inset 0 0 6px rgba(16,185,129,0.10)'
      }
    }

    const onOver = e => {
      if (e.target.closest('a, button, input, textarea, select, [role="button"]')) {
        setRingExpanded(true)
      }
    }
    const onOut = e => {
      if (e.target.closest('a, button, input, textarea, select, [role="button"]')) {
        setRingExpanded(false)
      }
    }

    const tick = () => {
      rx += (tx - rx) * 0.14
      ry += (ty - ry) * 0.14
      gx += (tx - gx) * 0.07
      gy += (ty - gy) * 0.07

      if (dotRef.current)
        dotRef.current.style.transform  = `translate3d(${tx}px,${ty}px,0)`
      if (ringRef.current)
        ringRef.current.style.transform = `translate3d(${rx}px,${ry}px,0)`
      if (glowRef.current)
        glowRef.current.style.transform = `translate3d(${gx}px,${gy}px,0)`

      animId = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseover',  onOver, { passive: true })
    document.addEventListener('mouseout',   onOut,  { passive: true })
    animId = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover',  onOver)
      document.removeEventListener('mouseout',   onOut)
      cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <>
      {/* outer diffuse glow */}
      <div
        ref={glowRef}
        aria-hidden="true"
        style={{
          position: 'fixed', top: 0, left: 0,
          pointerEvents: 'none', zIndex: 9998,
          width: '110px', height: '110px',
          marginLeft: '-55px', marginTop: '-55px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16,185,129,0.18) 0%, transparent 70%)',
          willChange: 'transform',
        }}
      />
      {/* trailing ring */}
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: 'fixed', top: 0, left: 0,
          pointerEvents: 'none', zIndex: 9999,
          width: '36px', height: '36px',
          marginLeft: '-18px', marginTop: '-18px',
          borderRadius: '50%',
          border: '1.5px solid rgba(16,185,129,0.60)',
          boxShadow: '0 0 12px rgba(16,185,129,0.30), inset 0 0 6px rgba(16,185,129,0.10)',
          willChange: 'transform',
          transition: 'width .18s ease, height .18s ease, margin .18s ease, border-color .18s ease, box-shadow .18s ease',
        }}
      />
      {/* precise dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: 'fixed', top: 0, left: 0,
          pointerEvents: 'none', zIndex: 10000,
          width: '6px', height: '6px',
          marginLeft: '-3px', marginTop: '-3px',
          borderRadius: '50%',
          background: '#10b981',
          boxShadow: '0 0 10px rgba(16,185,129,0.95), 0 0 3px rgba(16,185,129,1)',
          willChange: 'transform',
        }}
      />
    </>
  )
}

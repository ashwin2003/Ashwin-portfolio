import { useCallback, useEffect, useRef } from 'react'
import { useTypewriter } from '../hooks/useTypewriter'
import { Button } from '../components/Button'
import { personal } from '../data/personal'

const IS_DESKTOP =
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: hover) and (pointer: fine)').matches

// ── Sparkle colours ───────────────────────────────────────────────────────────
const SPARKLE_COLORS = [
  '#10b981','#34d399','#6ee7b7',   // emerald
  '#06b6d4','#22d3ee','#67e8f9',   // cyan
  '#fbbf24','#fcd34d','#fde68a',   // gold
  '#f9fafb','#ffffff',             // white
]

// 4-point star drawn on canvas
function drawStar(ctx, cx, cy, outer, inner) {
  const spikes = 4
  let rot = -Math.PI / 2
  const step = Math.PI / spikes
  ctx.beginPath()
  ctx.moveTo(cx + Math.cos(rot) * outer, cy + Math.sin(rot) * outer)
  for (let i = 0; i < spikes; i++) {
    rot += step
    ctx.lineTo(cx + Math.cos(rot) * inner, cy + Math.sin(rot) * inner)
    rot += step
    ctx.lineTo(cx + Math.cos(rot) * outer, cy + Math.sin(rot) * outer)
  }
  ctx.closePath()
  ctx.fill()
}

// ── Deterministic particles ───────────────────────────────────────────────────
function mkP(n, seed) {
  return Array.from({ length: n }, (_, i) => ({
    id:  i,
    x:   ((i * 1049 + seed * 37) % 97) + 1,
    y:   ((i * 719  + seed * 53) % 91) + 4,
    r:   (((i * 311) % 22) + 8)  / 10,
    op:  (((i * 173) % 28) + 12) / 100,
    dur: (((i * 257) % 40) + 35) / 10,
    del: ((i * 431)  % 48)       / 10,
  }))
}
const P0 = mkP(IS_DESKTOP ? 8  : 3, 3)
const P1 = mkP(IS_DESKTOP ? 18 : 6, 7)
const P2 = mkP(IS_DESKTOP ? 24 : 8, 13)
const P3 = mkP(IS_DESKTOP ? 18 : 6, 19)
const P4 = mkP(IS_DESKTOP ? 10 : 0, 29)

function Dots({ list }) {
  return list.map(p => (
    <div key={p.id} className="absolute rounded-full bg-emerald-400 pointer-events-none"
      style={{
        left:`${p.x}%`, top:`${p.y}%`,
        width:`${p.r}px`, height:`${p.r}px`,
        opacity: p.op,
        animation:`float ${p.dur}s ease-in-out ${p.del}s infinite`,
      }}
    />
  ))
}

// ── Crystal ───────────────────────────────────────────────────────────────────
function Crystal({ size = 60, strokeOpacity = 0.12 }) {
  const h  = size / 2
  const px = Math.max(10, Math.floor(size * 0.12))
  const gl = Math.min(0.95, strokeOpacity * 1.8)
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <polygon
        points={`${h},3 ${size-3},${h} ${h},${size-3} 3,${h}`}
        fill={`rgba(16,185,129,${strokeOpacity*.22})`}
        stroke={`rgba(16,185,129,${strokeOpacity})`}
        strokeWidth="1.5"
        style={{ filter:`drop-shadow(0 0 ${px}px rgba(16,185,129,${gl}))` }}
      />
      <polygon
        points={`${h},${size*.18} ${size*.82},${h} ${h},${size*.82} ${size*.18},${h}`}
        fill="none" stroke={`rgba(16,185,129,${strokeOpacity*.55})`} strokeWidth="0.9"
      />
      <polygon
        points={`${h},${size*.34} ${size*.66},${h} ${h},${size*.66} ${size*.34},${h}`}
        fill="none" stroke={`rgba(16,185,129,${strokeOpacity*.38})`} strokeWidth="0.5"
      />
      <circle cx={h} cy={h} r={Math.max(2, size*.024)}
        fill={`rgba(16,185,129,${strokeOpacity*.95})`} />
    </svg>
  )
}

function Spin({ dur = 80, rev = false, children }) {
  return (
    <div style={{ animation:`crystalSpin ${dur}s linear infinite ${rev?'reverse':''}` }}>
      {children}
    </div>
  )
}
function Float({ dur = 9, del = 0, children }) {
  return (
    <div className="animate-float"
      style={{ animationDuration:`${dur}s`, animationDelay:`${del}s` }}>
      {children}
    </div>
  )
}

// ── Hero ──────────────────────────────────────────────────────────────────────
export function Hero() {
  const typewriterText = useTypewriter(personal.roles)

  // Parallax layer refs
  const l0 = useRef(null)
  const l1 = useRef(null)
  const l2 = useRef(null)
  const l3 = useRef(null)
  const l4 = useRef(null)
  const lC = useRef(null)

  // Sparkle refs
  const canvasRef      = useRef(null)
  const h1Ref          = useRef(null)
  const sparkles       = useRef([])        // live particle array
  const isHovering     = useRef(false)
  const hoverFrames    = useRef(0)
  const namePos        = useRef({ x: 0, y: 0 })

  // ── Canvas resize ───────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !IS_DESKTOP) return
    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })
    return () => window.removeEventListener('resize', resize)
  }, [])

  // ── Main animation loop: parallax + sparkles ────────────────────────────────
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let animId
    let sy = 0, tx = 0, ty = 0, cx = 0, cy = 0
    const LERP = 0.055
    const mS   = IS_DESKTOP ? 1 : 0

    const onScroll = () => { sy = window.scrollY }
    const onMouse  = e  => {
      tx = (e.clientX / window.innerWidth  - 0.5) * 2
      ty = (e.clientY / window.innerHeight - 0.5) * 2
    }

    // spawn N sparkle particles around a viewport point
    const spawn = (x, y, count = 4) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = 0.5 + Math.random() * 1.4
        sparkles.current.push({
          x: x + (Math.random() - 0.5) * 40,
          y: y + (Math.random() - 0.5) * 20,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.0,   // gentle upward bias
          size: 2 + Math.random() * 3.5,
          color: SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)],
          life: 0,
          max:  80 + Math.floor(Math.random() * 60),
          star: Math.random() > 0.4,
          rot:  Math.random() * Math.PI * 2,
          rotV: (Math.random() - 0.5) * 0.07,
        })
      }
    }

    const drawSparkles = () => {
      const canvas = canvasRef.current
      if (!canvas || !IS_DESKTOP) return
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (isHovering.current) {
        hoverFrames.current++
        // burst on enter, then steady stream
        const count = hoverFrames.current < 18 ? 3 : 1
        spawn(namePos.current.x, namePos.current.y, count)
      }

      sparkles.current = sparkles.current.filter(p => p.life < p.max)
      for (const p of sparkles.current) {
        p.life++
        p.x   += p.vx
        p.y   += p.vy
        p.vy  += 0.025     // gravity
        p.vx  *= 0.982     // air drag
        p.size *= 0.993    // shrink
        p.rot  += p.rotV

        const alpha = Math.pow(1 - p.life / p.max, 0.55) * 0.92
        ctx.save()
        ctx.globalAlpha = alpha
        ctx.fillStyle   = p.color
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        if (p.star) {
          drawStar(ctx, 0, 0, p.size, p.size * 0.42)
        } else {
          ctx.beginPath()
          ctx.arc(0, 0, p.size * 0.5, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.restore()
      }
    }

    const tick = () => {
      cx += (tx - cx) * LERP
      cy += (ty - cy) * LERP
      const mx = cx, my = cy

      // ── Parallax transforms ── (much bigger factors + mouse offsets)
      if (l0.current)
        l0.current.style.transform = `translate3d(${mx*-20*mS}px,${sy*.05 +my*-10*mS}px,0)`
      if (l1.current)
        l1.current.style.transform = `translate3d(${mx*-72*mS}px,${sy*.20 +my*-40*mS}px,0)`
      if (l2.current)
        l2.current.style.transform = `translate3d(${mx*-138*mS}px,${sy*.40+my*-75*mS}px,0)`
      if (l3.current)
        l3.current.style.transform = `translate3d(${mx*-215*mS}px,${sy*.63+my*-118*mS}px,0)`
      if (l4.current)
        l4.current.style.transform = `translate3d(${mx*-305*mS}px,${sy*.86+my*-165*mS}px,0)`
      if (lC.current)
        lC.current.style.transform  = `translate3d(${mx*-10*mS}px,${sy*.07+my*-6*mS}px,0)`

      drawSparkles()
      animId = requestAnimationFrame(tick)
    }

    window.addEventListener('scroll',    onScroll, { passive: true })
    if (IS_DESKTOP) window.addEventListener('mousemove', onMouse, { passive: true })
    animId = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('scroll', onScroll)
      if (IS_DESKTOP) window.removeEventListener('mousemove', onMouse)
      cancelAnimationFrame(animId)
    }
  }, [])

  // ── Name hover handlers ─────────────────────────────────────────────────────
  const handleNameEnter = useCallback(e => {
    if (!IS_DESKTOP) return
    namePos.current    = { x: e.clientX, y: e.clientY }
    hoverFrames.current = 0
    isHovering.current  = true
    if (h1Ref.current) {
      h1Ref.current.style.filter    = 'drop-shadow(0 0 28px rgba(16,185,129,0.85)) drop-shadow(0 0 60px rgba(52,211,153,0.40))'
      h1Ref.current.style.transform = 'scale(1.025)'
    }
  }, [])

  const handleNameLeave = useCallback(() => {
    isHovering.current = false
    hoverFrames.current = 0
    if (h1Ref.current) {
      h1Ref.current.style.filter    = ''
      h1Ref.current.style.transform = ''
    }
  }, [])

  const handleNameMove = useCallback(e => {
    namePos.current = { x: e.clientX, y: e.clientY }
  }, [])

  const scrollToJourney = useCallback(() =>
    document.getElementById('journey')?.scrollIntoView({ behavior: 'smooth' }), [])
  const scrollToAbout   = useCallback(() =>
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }), [])

  const wc = IS_DESKTOP ? { willChange: 'transform' } : {}

  return (
    <section
      id="hero"
      className="relative flex items-center justify-center overflow-hidden
                 bg-slate-50 dark:bg-zinc-950"
      style={{ height:'100dvh', minHeight:'100svh' }}
      aria-label="Hero"
    >

      {/* ── Sparkle canvas (desktop only, z above content) ─────────────────── */}
      {IS_DESKTOP && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 25 }}
          aria-hidden="true"
        />
      )}

      {/* ══ L0: ambient glows — 0.05× ════════════════════════════════════════ */}
      <div ref={l0} className="absolute inset-0 pointer-events-none" style={wc} aria-hidden="true">
        <div className="absolute -top-40 -right-32 w-[950px] h-[850px] rounded-full
                        bg-emerald-500/[0.07] dark:bg-emerald-500/[0.14] blur-[160px]" />
        <div className="absolute -bottom-32 -left-32 w-[800px] h-[700px] rounded-full
                        bg-cyan-500/[0.05] dark:bg-cyan-500/[0.10] blur-[140px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                        w-[850px] h-[600px] rounded-full
                        bg-emerald-400/[0.04] dark:bg-emerald-400/[0.09] blur-[190px]" />
        <div className="absolute -top-10 left-[14%] w-[550px] h-[440px] rounded-full
                        bg-teal-400/[0.04] dark:bg-teal-400/[0.09] blur-[125px]" />
        <div className="absolute bottom-[4%] right-[11%] w-[420px] h-[360px] rounded-full
                        bg-emerald-600/[0.03] dark:bg-emerald-600/[0.08] blur-[115px]" />
        <Dots list={P0} />
      </div>

      {/* ══ L1: grid + 4-corner giant crystals — 0.20× ═══════════════════════ */}
      <div ref={l1} className="absolute inset-0 pointer-events-none" style={wc} aria-hidden="true">
        <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.08]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(16,185,129,1) 1px,transparent 1px),' +
              'linear-gradient(90deg,rgba(16,185,129,1) 1px,transparent 1px)',
            backgroundSize:'60px 60px',
          }}
        />
        <div style={IS_DESKTOP
          ? { position:'absolute',inset:0,filter:'blur(1px)',opacity:0.62 }
          : { position:'absolute',inset:0,opacity:0.50 }}>
          <div className="absolute -top-20 -right-20">
            <Spin dur={100}><Float dur={12}><Crystal size={IS_DESKTOP?510:280} strokeOpacity={0.075}/></Float></Spin>
          </div>
          <div className="absolute -bottom-28 -left-24">
            <Spin dur={130} rev><Float dur={15} del={3}><Crystal size={IS_DESKTOP?430:240} strokeOpacity={0.07}/></Float></Spin>
          </div>
          <div className="absolute -top-16 -left-28">
            <Spin dur={115}><Float dur={11} del={1.5}><Crystal size={IS_DESKTOP?370:200} strokeOpacity={0.065}/></Float></Spin>
          </div>
          <div className="absolute -bottom-16 -right-12">
            <Spin dur={95} rev><Float dur={13} del={5}><Crystal size={IS_DESKTOP?330:185} strokeOpacity={0.07}/></Float></Spin>
          </div>
        </div>
        <Dots list={P1} />
      </div>

      {/* ══ L2: chart area fill + mid crystals — 0.40× ═══════════════════════ */}
      <div ref={l2} className="absolute inset-0 pointer-events-none" style={wc} aria-hidden="true">
        <div className="absolute bottom-0" style={{ height:'78%', left:'-25%', right:'-25%' }}>
          <svg className="w-full h-full" viewBox="0 0 1200 500"
            preserveAspectRatio="none" fill="none" aria-hidden="true">
            <defs>
              <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#10b981" stopOpacity="0.18"/>
                <stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
              </linearGradient>
            </defs>
            <polygon
              points="0,500 0,420 120,390 200,370 280,395 360,340 440,300 520,280 600,305 680,255 760,220 840,240 920,185 1000,150 1100,110 1200,75 1200,500"
              fill="url(#chartFill)" className="opacity-70 dark:opacity-90"
            />
          </svg>
        </div>

        <div style={IS_DESKTOP
          ? { position:'absolute',inset:0,filter:'blur(0.4px)',opacity:0.82 }
          : { position:'absolute',inset:0,opacity:0.72 }}>
          <div className="absolute top-[24%] right-[15%]">
            <Spin dur={72}><Float dur={8.5} del={1}><Crystal size={200} strokeOpacity={0.13}/></Float></Spin>
          </div>
          <div className="absolute top-[56%] left-[8%]">
            <Spin dur={90} rev><Float dur={10} del={3}><Crystal size={168} strokeOpacity={0.11}/></Float></Spin>
          </div>
          <div className="absolute top-[7%] left-[38%]">
            <Spin dur={80}><Float dur={7.5} del={5.5}><Crystal size={132} strokeOpacity={0.10}/></Float></Spin>
          </div>
          <div className="absolute bottom-[8%] right-[33%]">
            <Spin dur={105} rev><Float dur={9} del={2}><Crystal size={148} strokeOpacity={0.10}/></Float></Spin>
          </div>
        </div>

        {/* dot trail */}
        <div className="absolute top-[25%] left-[27%] flex gap-3">
          {[0.9,0.72,0.56,0.40,0.26,0.15,0.08].map((op,i) => (
            <div key={i} className="rounded-full bg-emerald-400"
              style={{ width:`${4.5-i*.5}px`,height:`${4.5-i*.5}px`,opacity:op*.55 }}/>
          ))}
        </div>
        <Dots list={P2} />
      </div>

      {/* ══ L3: chart lines + near crystals — 0.63× ══════════════════════════ */}
      <div ref={l3} className="absolute inset-0 pointer-events-none" style={wc} aria-hidden="true">
        <div className="absolute bottom-0" style={{ height:'78%', left:'-25%', right:'-25%' }}>
          <svg className="w-full h-full" viewBox="0 0 1200 500"
            preserveAspectRatio="none" fill="none" aria-hidden="true">
            <defs>
              <filter id="lineGlow">
                <feGaussianBlur stdDeviation="3" result="cb"/>
                <feMerge><feMergeNode in="cb"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <filter id="lineGlow2">
                <feGaussianBlur stdDeviation="1.5" result="cb"/>
                <feMerge><feMergeNode in="cb"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>
            <polyline
              points="0,420 120,390 200,370 280,395 360,340 440,300 520,280 600,305 680,255 760,220 840,240 920,185 1000,150 1100,110 1200,75"
              stroke="#10b981" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray="4000" strokeDashoffset="4000"
              filter="url(#lineGlow)"
              className="opacity-75 dark:opacity-95"
              style={{ animation:'drawChartFull 3.5s ease-out 0.8s both' }}
            />
            <polyline
              points="0,460 100,440 200,450 320,420 440,400 560,380 680,360 800,335 920,295 1040,260 1200,230"
              stroke="#10b981" strokeWidth="1.2"
              strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray="4000" strokeDashoffset="4000"
              filter="url(#lineGlow2)"
              className="opacity-30 dark:opacity-42"
              style={{ animation:'drawChartFull 3.5s ease-out 1.4s both' }}
            />
            <circle cx="1200" cy="75" r="5" fill="#10b981"
              className="opacity-0 dark:opacity-80"
              style={{ animation:'fadeIn .3s ease-out 4.3s forwards' }}/>
            <circle cx="1200" cy="75" r="14" fill="#10b981"
              className="opacity-0 dark:opacity-20 animate-pulse-dot"
              style={{ animationDelay:'4.3s' }}/>
          </svg>
        </div>

        {/* tickers */}
        <div className="absolute top-[21%] right-[11%] font-mono text-xs
                        text-emerald-500/55 dark:text-emerald-400/50 select-none">+2.34% ▲</div>
        <div className="absolute top-[40%] left-[7%] font-mono text-xs
                        text-emerald-500/38 dark:text-emerald-400/32 select-none">NIFTY 23,450</div>
        <div className="absolute bottom-[30%] right-[26%] font-mono text-xs
                        text-emerald-500/32 dark:text-emerald-400/26 select-none">₹ 1,24,500</div>

        <div className="absolute top-[11%] right-[23%]">
          <Spin dur={50}><Float dur={6} del={0.5}><Crystal size={85} strokeOpacity={0.26}/></Float></Spin>
        </div>
        <div className="absolute top-[65%] right-[37%]">
          <Spin dur={62} rev><Float dur={7} del={2}><Crystal size={70} strokeOpacity={0.24}/></Float></Spin>
        </div>
        <div className="absolute top-[40%] left-[16%]">
          <Spin dur={58}><Float dur={8} del={3.5}><Crystal size={76} strokeOpacity={0.22}/></Float></Spin>
        </div>
        <div className="absolute top-[53%] left-[53%]">
          <Spin dur={66} rev><Float dur={6.5} del={1.5}><Crystal size={64} strokeOpacity={0.20}/></Float></Spin>
        </div>

        <div className="absolute top-[46%] right-[43%] w-2.5 h-2.5 rounded-full
                        bg-emerald-400/35 dark:bg-emerald-400/50"/>
        <div className="absolute top-[62%] left-[48%] w-2 h-2 rounded-full
                        bg-emerald-400/25 dark:bg-emerald-400/40"/>
        <div className="absolute top-[32%] left-[57%] w-3 h-3 rounded-full
                        bg-emerald-400/18 dark:bg-emerald-400/30"/>
        <Dots list={P3} />
      </div>

      {/* ══ L4: closest layer — desktop only, 0.86× ══════════════════════════ */}
      {IS_DESKTOP && (
        <div ref={l4} className="absolute inset-0 pointer-events-none" style={wc} aria-hidden="true">
          <div className="absolute top-[29%] right-[31%]">
            <Spin dur={38}><Float dur={5} del={0.2}><Crystal size={52} strokeOpacity={0.38}/></Float></Spin>
          </div>
          <div className="absolute top-[59%] left-[35%]">
            <Spin dur={46} rev><Float dur={5.5} del={1}><Crystal size={44} strokeOpacity={0.34}/></Float></Spin>
          </div>
          <div className="absolute top-[17%] left-[23%]">
            <Spin dur={42}><Float dur={4.5} del={2.5}><Crystal size={36} strokeOpacity={0.30}/></Float></Spin>
          </div>
          <div className="absolute top-[35%] right-[19%] w-2 h-2 rounded-full
                          bg-emerald-400/55 dark:bg-emerald-400/70 animate-pulse-dot"/>
          <div className="absolute top-[71%] left-[28%] w-1.5 h-1.5 rounded-full
                          bg-emerald-400/45 dark:bg-emerald-400/60"/>
          <div className="absolute top-[14%] right-[49%] w-2.5 h-2.5 rounded-full
                          bg-emerald-400/40 dark:bg-emerald-400/55"/>
          <Dots list={P4} />
        </div>
      )}

      {/* ══ Content ══════════════════════════════════════════════════════════ */}
      <div ref={lC} className="relative z-10 section-container text-center py-32" style={wc}>

        {/* status badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                          bg-emerald-50 dark:bg-emerald-500/10
                          border border-emerald-200 dark:border-emerald-500/20">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 animate-pulse-dot"/>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"/>
            </span>
            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400 font-mono">
              Open to opportunities
            </span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                          bg-zinc-100 dark:bg-zinc-800/60
                          border border-zinc-200 dark:border-zinc-700/50">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0"/>
            <span className="text-xs font-mono text-slate-600 dark:text-zinc-400">
              Currently ·{' '}
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">@ ZET</span>
            </span>
          </div>
        </div>

        {/*
          Sparkle + glow fires on the entire h1 (both first and last name).
          Glow via direct style mutation (no re-render), particles via canvas.
        */}
        <h1
          ref={h1Ref}
          className="text-5xl sm:text-7xl lg:text-8xl 2xl:text-9xl font-extrabold tracking-tight mb-6"
          style={{ transition:'filter .35s ease, transform .35s ease' }}
          onMouseEnter={IS_DESKTOP ? handleNameEnter : undefined}
          onMouseLeave={IS_DESKTOP ? handleNameLeave : undefined}
          onMouseMove={IS_DESKTOP  ? handleNameMove  : undefined}
        >
          <span className="text-slate-900 dark:text-white">{personal.firstName} </span>
          <span className="text-gradient">{personal.lastName}</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-500 dark:text-zinc-500 font-mono uppercase tracking-widest mb-6">
          {personal.title}
        </p>

        <div className="h-10 flex items-center justify-center mb-6">
          <p className="text-xl sm:text-2xl text-slate-600 dark:text-zinc-300 font-mono">
            <span className="text-emerald-500 dark:text-emerald-400 mr-2">▸</span>
            {typewriterText}
            <span className="animate-blink text-emerald-500 dark:text-emerald-400 ml-0.5">|</span>
          </p>
        </div>

        <p className="max-w-2xl mx-auto text-lg text-slate-500 dark:text-zinc-400 leading-relaxed mb-10">
          {personal.tagline}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button onClick={scrollToJourney} size="lg">See My Journey ↓</Button>
          <Button as="a" href={personal.resumeUrl} download variant="outline" size="lg">
            Download Resume
          </Button>
        </div>

        <div className="mt-10 flex justify-center items-center gap-6">
          {Object.entries(personal.social).map(([key, url]) => (
            <a key={key} href={url}
              target={key !== 'email' ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="font-mono text-xs uppercase tracking-wider
                         text-slate-400 dark:text-zinc-600
                         hover:text-emerald-600 dark:hover:text-emerald-400
                         transition-colors duration-200
                         focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded"
              aria-label={key}>
              {key}
            </a>
          ))}
        </div>
      </div>

      {/* scroll cue */}
      <button onClick={scrollToAbout}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20
                   flex flex-col items-center gap-1
                   text-slate-400 dark:text-zinc-500
                   hover:text-emerald-500 dark:hover:text-emerald-400
                   transition-colors duration-200 focus:outline-none"
        aria-label="Scroll down">
        <span className="font-mono text-xs">scroll</span>
        <svg className="animate-bounce" width="18" height="18" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 5v14M5 12l7 7 7-7"/>
        </svg>
      </button>
    </section>
  )
}

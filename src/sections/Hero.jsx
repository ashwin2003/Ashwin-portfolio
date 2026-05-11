import { useCallback } from 'react'
import { useTypewriter } from '../hooks/useTypewriter'
import { Button } from '../components/Button'
import { personal } from '../data/personal'

function TradingChartBg() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Trading grid */}
      <div
        className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(16,185,129,1) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-emerald-500/5 dark:bg-emerald-500/8 rounded-full blur-3xl" />

      {/* Chart SVG */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1200 500"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <defs>
          <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Area fill */}
        <polygon
          points="0,500 0,420 120,390 200,370 280,395 360,340 440,300 520,280 600,305 680,255 760,220 840,240 920,185 1000,150 1100,110 1200,75 1200,500"
          fill="url(#chartFill)"
          className="opacity-60 dark:opacity-80"
        />

        {/* Main chart line */}
        <polyline
          points="0,420 120,390 200,370 280,395 360,340 440,300 520,280 600,305 680,255 760,220 840,240 920,185 1000,150 1100,110 1200,75"
          stroke="#10b981"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="2000"
          strokeDashoffset="2000"
          filter="url(#glow)"
          className="animate-draw-chart opacity-60 dark:opacity-80"
        />

        {/* Secondary dimmer line for depth */}
        <polyline
          points="0,460 100,440 200,450 320,420 440,400 560,380 680,360 800,335 920,295 1040,260 1200,230"
          stroke="#10b981"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="2000"
          strokeDashoffset="2000"
          className="animate-draw-chart-2 opacity-20 dark:opacity-30"
        />

        {/* Data point dot at end of main line */}
        <circle cx="1200" cy="75" r="4" fill="#10b981" className="opacity-0 dark:opacity-70" style={{ animation: 'fadeIn 0.3s ease-out 4s forwards' }} />
        <circle cx="1200" cy="75" r="8" fill="#10b981" className="opacity-0 dark:opacity-30 animate-pulse-dot" style={{ animationDelay: '4s' }} />
      </svg>

      {/* Floating ticker labels */}
      <div className="absolute top-[22%] right-[12%] font-mono text-xs text-emerald-500/40 dark:text-emerald-400/30 select-none">
        +2.34% ▲
      </div>
      <div className="absolute top-[40%] left-[8%] font-mono text-xs text-emerald-500/30 dark:text-emerald-400/20 select-none">
        NIFTY 23,450
      </div>
      <div className="absolute bottom-[30%] right-[28%] font-mono text-xs text-emerald-500/25 dark:text-emerald-400/15 select-none">
        ₹ 1,24,500
      </div>
    </div>
  )
}

export function Hero() {
  const typewriterText = useTypewriter(personal.roles)

  const scrollToJourney = useCallback(() => {
    document.getElementById('journey')?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const scrollToAbout = useCallback(() => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-zinc-950"
      aria-label="Hero"
    >
      <TradingChartBg />

      <div className="relative z-10 section-container text-center py-32">
        {/* Badges row */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 animate-pulse-dot" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400 font-mono">
              Open to opportunities
            </span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/50">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
            <span className="text-xs font-mono text-slate-600 dark:text-zinc-400">
              Currently ·{' '}
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">@ ZET</span>
            </span>
          </div>
        </div>

        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight mb-6">
          <span className="text-slate-900 dark:text-white">{personal.firstName} </span>
          <span className="text-gradient">{personal.lastName}</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-500 dark:text-zinc-500 font-mono uppercase tracking-widest mb-6">
          {personal.title}
        </p>

        {/* Typewriter */}
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
          <Button onClick={scrollToJourney} size="lg">
            See My Journey ↓
          </Button>
          <Button as="a" href={personal.resumeUrl} download variant="outline" size="lg">
            Download Resume
          </Button>
        </div>

        {/* Social links */}
        <div className="mt-10 flex justify-center items-center gap-6">
          {Object.entries(personal.social).map(([key, url]) => (
            <a
              key={key}
              href={url}
              target={key !== 'email' ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="font-mono text-xs uppercase tracking-wider text-slate-400 dark:text-zinc-600 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded"
              aria-label={key}
            >
              {key}
            </a>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <button
        onClick={scrollToAbout}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-slate-400 dark:text-zinc-600 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors duration-200 focus:outline-none"
        aria-label="Scroll down"
      >
        <span className="font-mono text-xs">scroll</span>
        <svg className="animate-bounce" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </button>
    </section>
  )
}

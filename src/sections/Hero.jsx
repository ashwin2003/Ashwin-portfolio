import { useCallback } from 'react'
import { useTypewriter } from '../hooks/useTypewriter'
import { Button } from '../components/Button'
import { personal } from '../data/personal'

function GeometricBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Radial gradient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/10 dark:bg-violet-600/15 rounded-full blur-3xl" />
      <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-purple-600/8 dark:bg-purple-600/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-violet-800/8 dark:bg-violet-800/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1.5s' }} />

      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
        style={{
          backgroundImage: 'radial-gradient(circle, #7c3aed 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Floating geometric shapes */}
      <svg className="absolute top-20 right-16 opacity-10 dark:opacity-15 animate-pulse" width="120" height="120" viewBox="0 0 120 120" fill="none">
        <polygon points="60,10 110,90 10,90" stroke="#8b5cf6" strokeWidth="1.5" fill="none" />
      </svg>
      <svg className="absolute bottom-24 left-16 opacity-10 dark:opacity-15 animate-pulse" style={{ animationDelay: '2s' }} width="80" height="80" viewBox="0 0 80 80" fill="none">
        <rect x="10" y="10" width="60" height="60" stroke="#a78bfa" strokeWidth="1.5" fill="none" rx="4" transform="rotate(15 40 40)" />
      </svg>
      <svg className="absolute top-1/2 left-12 opacity-10 dark:opacity-15" width="60" height="60" viewBox="0 0 60 60" fill="none">
        <circle cx="30" cy="30" r="25" stroke="#7c3aed" strokeWidth="1.5" fill="none" />
      </svg>
    </div>
  )
}

export function Hero() {
  const typewriterText = useTypewriter(personal.roles)

  const scrollToProjects = useCallback(() => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
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
      <GeometricBackground />

      <div className="relative z-10 section-container text-center py-32">
        <p className="section-label animate-fade-in">
          &lt; Hello, World! /&gt;
        </p>

        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight mb-6 animate-slide-up">
          <span className="text-slate-900 dark:text-white">{personal.firstName} </span>
          <span className="text-gradient">{personal.lastName}</span>
        </h1>

        {/* Typewriter line */}
        <div className="h-10 flex items-center justify-center mb-6">
          <p className="text-xl sm:text-2xl text-slate-500 dark:text-zinc-400 font-mono">
            <span className="text-violet-500 dark:text-violet-400 mr-2">▸</span>
            {typewriterText}
            <span className="animate-blink text-violet-500 dark:text-violet-400 ml-0.5">|</span>
          </p>
        </div>

        <p className="max-w-2xl mx-auto text-lg text-slate-600 dark:text-zinc-400 leading-relaxed mb-10">
          {personal.tagline}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button onClick={scrollToProjects} size="lg">
            View My Work →
          </Button>
          <Button
            as="a"
            href={personal.resumeUrl}
            download
            variant="outline"
            size="lg"
          >
            Download Resume
          </Button>
        </div>

        {/* Social quick-links */}
        <div className="mt-12 flex justify-center gap-4">
          {Object.entries(personal.social).map(([key, url]) => (
            <a
              key={key}
              href={url}
              target={key !== 'email' ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="text-slate-400 dark:text-zinc-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors duration-200 font-mono text-xs uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-violet-500 rounded px-1"
              aria-label={key}
            >
              {key}
            </a>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scrollToAbout}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-slate-400 dark:text-zinc-600 hover:text-violet-500 dark:hover:text-violet-400 transition-colors duration-200 focus:outline-none"
        aria-label="Scroll to About"
      >
        <span className="text-xs font-mono">scroll</span>
        <svg className="animate-bounce" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </button>
    </section>
  )
}

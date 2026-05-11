import { useMemo } from 'react'
import { SectionWrapper } from '../components/SectionWrapper'
import { Button } from '../components/Button'
import { personal } from '../data/personal'

export function About() {
  const bioParagraphs = useMemo(() => personal.bio.split('\n\n').filter(Boolean), [])

  return (
    <SectionWrapper id="about">
      <div className="section-container">
        <span className="section-label">The person behind the code</span>
        <h2 className="section-heading">About Me</h2>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — Avatar + badges */}
          <div className="flex flex-col items-center gap-6 order-2 md:order-1">
            {/* Avatar */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full blur opacity-30 group-hover:opacity-60 transition-opacity duration-500" aria-hidden="true" />
              <div className="relative w-52 h-52 sm:w-64 sm:h-64 rounded-full bg-gradient-to-br from-emerald-900 to-zinc-800 dark:from-emerald-900 dark:to-zinc-900 flex items-center justify-center text-7xl ring-4 ring-emerald-500/20 group-hover:ring-emerald-500/40 transition-all duration-300 select-none">
                👨‍💻
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-col gap-2 w-full max-w-xs">
              <div className="flex items-center gap-2 px-4 py-2.5 card rounded-xl">
                <span className="text-base" aria-hidden="true">📍</span>
                <div>
                  <p className="text-xs text-slate-500 dark:text-zinc-500 font-medium">Location</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{personal.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 px-4 py-2.5 card rounded-xl">
                <span className="relative flex h-2.5 w-2.5 ml-0.5 mr-0.5" aria-hidden="true">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 animate-pulse-dot" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <div>
                  <p className="text-xs text-slate-500 dark:text-zinc-500 font-medium">Status</p>
                  <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{personal.availability}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 px-4 py-2.5 card rounded-xl">
                <span className="text-base" aria-hidden="true">🎓</span>
                <div>
                  <p className="text-xs text-slate-500 dark:text-zinc-500 font-medium">Education</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">NIT Kurukshetra · 8.8 CGPA</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Bio */}
          <div className="order-1 md:order-2 space-y-5">
            {bioParagraphs.map((para, i) => (
              <p key={i} className={`leading-relaxed ${i === 0 ? 'text-lg text-slate-700 dark:text-zinc-200' : 'text-slate-600 dark:text-zinc-400'}`}>
                {para}
              </p>
            ))}

            <div className="pt-4 flex flex-wrap gap-3">
              <Button as="a" href={personal.resumeUrl} download>
                Download Resume ↓
              </Button>
              <Button
                as="a"
                href={personal.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
              >
                LinkedIn →
              </Button>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}

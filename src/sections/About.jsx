import { useMemo } from 'react'
import { SectionWrapper } from '../components/SectionWrapper'
import { Button } from '../components/Button'
import { personal } from '../data/personal'

export function About() {
  const facts = useMemo(() => [
    { label: 'Location', value: personal.location, icon: '📍' },
    { label: 'Status', value: personal.availability, icon: '✅' },
    { label: 'Experience', value: `${personal.yearsOfExperience} years`, icon: '💼' },
    { label: 'Email', value: personal.email, icon: '✉️' },
  ], [])

  return (
    <SectionWrapper id="about">
      <div className="section-container">
        <span className="section-label">Get to know me</span>
        <h2 className="section-heading">About Me</h2>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Avatar */}
          <div className="flex justify-center order-2 md:order-1">
            <div className="relative group">
              {/* Outer glow ring */}
              <div className="absolute -inset-1 bg-gradient-to-br from-violet-600 to-purple-600 rounded-full blur opacity-40 group-hover:opacity-70 transition-opacity duration-500" aria-hidden="true" />
              {/* Avatar circle */}
              <div className="relative w-56 h-56 sm:w-72 sm:h-72 rounded-full bg-gradient-to-br from-violet-600 to-purple-800 flex items-center justify-center text-7xl sm:text-8xl select-none ring-4 ring-violet-500/30 group-hover:ring-violet-500/60 transition-all duration-300">
                👨‍💻
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="order-1 md:order-2">
            <p className="text-slate-600 dark:text-zinc-300 text-lg leading-relaxed mb-8">
              {personal.bio}
            </p>

            <dl className="grid grid-cols-2 gap-3 mb-8">
              {facts.map(({ label, value, icon }) => (
                <div key={label} className="card p-4 rounded-xl">
                  <dt className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-zinc-500 uppercase tracking-wide mb-1">
                    <span aria-hidden="true">{icon}</span>
                    {label}
                  </dt>
                  <dd className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>

            <Button as="a" href={personal.resumeUrl} download variant="outline">
              Download Resume ↓
            </Button>
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}

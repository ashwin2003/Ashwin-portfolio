import { useState, useCallback } from 'react'
import { SectionWrapper } from '../components/SectionWrapper'
import { testimonials } from '../data/testimonials'

export function Testimonials() {
  const [current, setCurrent] = useState(0)

  const prev = useCallback(() => setCurrent(i => (i - 1 + testimonials.length) % testimonials.length), [])
  const next = useCallback(() => setCurrent(i => (i + 1) % testimonials.length), [])

  const { name, role, initials, quote } = testimonials[current]

  return (
    <SectionWrapper id="testimonials">
      <div className="section-container">
        <span className="section-label">What people say</span>
        <h2 className="section-heading">Testimonials</h2>

        <div className="max-w-2xl mx-auto">
          <figure
            key={current}
            className="card p-8 sm:p-10 rounded-2xl text-center animate-fade-in"
            aria-live="polite"
            aria-atomic="true"
          >
            {/* Quote icon */}
            <span className="text-4xl text-violet-300 dark:text-violet-800 select-none" aria-hidden="true">"</span>

            <blockquote>
              <p className="text-slate-600 dark:text-zinc-300 text-lg leading-relaxed italic mb-8">
                {quote}
              </p>
            </blockquote>

            <figcaption className="flex items-center justify-center gap-3">
              <div
                className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                aria-hidden="true"
              >
                {initials}
              </div>
              <div className="text-left">
                <p className="font-semibold text-slate-900 dark:text-white text-sm">{name}</p>
                <p className="text-slate-500 dark:text-zinc-500 text-xs">{role}</p>
              </div>
            </figcaption>
          </figure>

          {/* Controls */}
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              onClick={prev}
              className="p-2 rounded-lg card hover:border-violet-400/50 dark:hover:border-violet-500/50 text-slate-500 dark:text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
              aria-label="Previous testimonial"
            >
              ←
            </button>

            <div className="flex gap-2" role="tablist" aria-label="Testimonial indicators">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  role="tab"
                  aria-selected={i === current}
                  aria-label={`Testimonial ${i + 1} of ${testimonials.length}`}
                  className={`h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-500
                    ${i === current
                      ? 'w-6 bg-violet-600 dark:bg-violet-500'
                      : 'w-2 bg-slate-300 dark:bg-zinc-700 hover:bg-violet-400 dark:hover:bg-zinc-500'
                    }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="p-2 rounded-lg card hover:border-violet-400/50 dark:hover:border-violet-500/50 text-slate-500 dark:text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
              aria-label="Next testimonial"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}

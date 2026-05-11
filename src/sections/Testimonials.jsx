import { SectionWrapper } from '../components/SectionWrapper'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { testimonials } from '../data/testimonials'

function TestimonialCard({ name, role, initials, color, quote, index }) {
  const { ref, isRevealed } = useScrollReveal()
  return (
    <figure
      ref={ref}
      className={`card card-hover p-6 sm:p-8 flex flex-col gap-5 transition-all duration-700 ${
        isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      <div
        className="text-5xl font-serif leading-none select-none text-emerald-500/25 dark:text-emerald-400/20"
        aria-hidden="true"
      >
        "
      </div>

      <blockquote className="text-slate-600 dark:text-zinc-400 leading-relaxed text-sm sm:text-base flex-1 -mt-2">
        {quote}
      </blockquote>

      <figcaption className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-zinc-800">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold font-mono flex-shrink-0"
          style={{ backgroundColor: color }}
          aria-hidden="true"
        >
          {initials}
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">{name}</p>
          <p className="text-xs text-slate-500 dark:text-zinc-500 mt-0.5">{role}</p>
        </div>
      </figcaption>
    </figure>
  )
}

export function Testimonials() {
  return (
    <SectionWrapper id="testimonials" className="bg-slate-100/40 dark:bg-zinc-900/20">
      <div className="section-container">
        <span className="section-label">What colleagues say</span>
        <h2 className="section-heading">Testimonials</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <TestimonialCard key={t.id} {...t} index={i} />
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}

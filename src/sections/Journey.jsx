import { useScrollReveal } from '../hooks/useScrollReveal'
import { Badge } from '../components/Badge'
import { journey } from '../data/journey'

function ChapterCard({ chapter, index }) {
  const isLeft = index % 2 === 0
  const { ref, isRevealed } = useScrollReveal(0.1)

  return (
    <div
      ref={ref}
      className={`relative pl-10 md:pl-0 transition-all duration-700
        ${isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
    >
      {/* Mobile timeline dot */}
      <div className="md:hidden absolute left-0 top-5 z-10 w-8 h-8 rounded-full bg-slate-50 dark:bg-zinc-950 border-2 border-emerald-500 flex items-center justify-center">
        <span className="font-mono text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
          {chapter.chapter}
        </span>
      </div>

      {/* Desktop: alternating grid — hidden on mobile */}
      <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr] items-center">
        <div className={`flex ${isLeft ? 'justify-end pr-8' : ''}`}>
          {isLeft && (
            <article className="card card-hover rounded-2xl p-6 max-w-lg w-full">
              <ChapterCardContent chapter={chapter} />
            </article>
          )}
        </div>

        <div className="flex flex-col items-center flex-shrink-0 z-10">
          <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-zinc-950 border-2 border-emerald-500 flex items-center justify-center glow-emerald">
            <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {chapter.chapter}
            </span>
          </div>
        </div>

        <div className={`flex ${!isLeft ? 'justify-start pl-8' : ''}`}>
          {!isLeft && (
            <article className="card card-hover rounded-2xl p-6 max-w-lg w-full">
              <ChapterCardContent chapter={chapter} />
            </article>
          )}
        </div>
      </div>

      {/* Mobile: single stacked card — hidden on desktop */}
      <article className="md:hidden card card-hover rounded-2xl p-5">
        <ChapterCardContent chapter={chapter} />
      </article>
    </div>
  )
}

function ChapterCardContent({ chapter }) {
  return (
    <>
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="chapter">{chapter.chapter}</Badge>
            <span className="text-xs text-slate-500 dark:text-zinc-500 font-mono uppercase tracking-wide">
              {chapter.tagline}
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span aria-hidden="true">{chapter.icon}</span>
            {chapter.company}
          </h3>
          <p className="text-emerald-600 dark:text-emerald-400 text-sm font-medium mt-0.5">
            {chapter.role}
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-xs font-medium text-slate-500 dark:text-zinc-500 font-mono">{chapter.period}</p>
          <p className="text-xs text-slate-400 dark:text-zinc-600 mt-0.5">{chapter.location}</p>
        </div>
      </div>

      {/* Narrative */}
      <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed mb-4">
        {chapter.narrative}
      </p>

      {/* Key wins */}
      <div className="flex flex-wrap gap-1.5">
        {chapter.highlights.map(win => (
          <Badge key={win} variant="default">{win}</Badge>
        ))}
      </div>
    </>
  )
}

export function Journey() {
  return (
    <section id="journey" className="py-20 bg-slate-100/40 dark:bg-zinc-900/20">
      <div className="section-container">
        <span className="section-label">From campus to production</span>
        <h2 className="section-heading">The Journey</h2>

        <div className="relative">
          {/* Vertical connecting line */}
          <div className="timeline-line" aria-hidden="true" />

          <div className="space-y-10 md:space-y-14">
            {journey.map((chapter, index) => (
              <ChapterCard key={chapter.id} chapter={chapter} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

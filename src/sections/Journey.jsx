import { useScrollReveal } from '../hooks/useScrollReveal'
import { Badge } from '../components/Badge'
import { journey } from '../data/journey'

function ChapterCard({ chapter, index }) {
  const isLeft = index % 2 === 0
  const { ref, isRevealed } = useScrollReveal(0.1)

  return (
    <div className="relative flex items-start md:items-center gap-0">
      {/* Mobile: dot on the left track */}
      <div className="md:hidden absolute left-0 top-6 flex flex-col items-center z-10">
        <div className="w-8 h-8 rounded-full bg-zinc-950 dark:bg-zinc-950 border-2 border-emerald-500 flex items-center justify-center flex-shrink-0">
          <span className="text-sm" aria-hidden="true">{chapter.icon}</span>
        </div>
      </div>

      {/* Desktop layout wrapper */}
      <div className="flex-1 md:grid md:grid-cols-[1fr_auto_1fr] items-center gap-0 w-full pl-12 md:pl-0">

        {/* Left slot */}
        <div className={`${isLeft ? 'md:flex md:justify-end md:pr-8' : 'hidden md:block'}`}>
          {isLeft && (
            <article
              ref={ref}
              className={`card card-hover rounded-2xl p-6 max-w-lg w-full transition-all duration-700
                ${isRevealed ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
            >
              <ChapterCardContent chapter={chapter} />
            </article>
          )}
        </div>

        {/* Center dot — desktop only */}
        <div className="hidden md:flex flex-col items-center flex-shrink-0 z-10">
          <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-zinc-950 border-2 border-emerald-500 flex items-center justify-center glow-emerald">
            <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {chapter.chapter}
            </span>
          </div>
        </div>

        {/* Right slot */}
        <div className={`${!isLeft ? 'md:flex md:justify-start md:pl-8' : 'hidden md:block'}`}>
          {!isLeft && (
            <article
              ref={ref}
              className={`card card-hover rounded-2xl p-6 max-w-lg w-full transition-all duration-700
                ${isRevealed ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
            >
              <ChapterCardContent chapter={chapter} />
            </article>
          )}
        </div>

        {/* Mobile card (always rendered in flow, no grid slot) */}
        <article
          ref={!isLeft ? undefined : ref}
          className={`md:hidden card card-hover rounded-2xl p-5 w-full transition-all duration-700
            ${isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          <ChapterCardContent chapter={chapter} />
        </article>
      </div>
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

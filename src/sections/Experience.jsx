import { SectionWrapper } from '../components/SectionWrapper'
import { experiences } from '../data/experience'

function TimelineEntry({ entry, isLeft }) {
  const isWork = entry.type === 'work'

  return (
    <div className={`relative flex items-start md:items-center gap-0 md:gap-8 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
      {/* Card — takes half width on desktop */}
      <article className="flex-1 card card-hover p-6 rounded-xl ml-8 md:ml-0">
        <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white leading-tight">
              {entry.role}
            </h3>
            <p className="text-violet-600 dark:text-violet-400 font-medium text-sm mt-0.5">{entry.company}</p>
          </div>
          <div className={`text-right ${isLeft ? '' : 'md:text-left'}`}>
            <span className="text-xs font-medium text-slate-500 dark:text-zinc-500 block">{entry.period}</span>
            <span className="text-xs text-slate-400 dark:text-zinc-600">{entry.location}</span>
          </div>
        </div>
        <ul className="space-y-1.5">
          {entry.points.map((point, i) => (
            <li key={i} className="flex gap-2 text-sm text-slate-600 dark:text-zinc-400">
              <span className="text-violet-500 mt-0.5 flex-shrink-0 text-xs">▸</span>
              {point}
            </li>
          ))}
        </ul>
      </article>

      {/* Center dot — desktop */}
      <div className="hidden md:flex flex-col items-center gap-0 flex-shrink-0">
        <div
          className={`w-4 h-4 rounded-full border-2 border-violet-500 z-10 transition-all duration-300 ${isWork ? 'bg-violet-600' : 'bg-white dark:bg-zinc-950'}`}
          aria-hidden="true"
        />
      </div>

      {/* Mobile dot */}
      <div
        className="absolute left-0 top-6 md:hidden w-3 h-3 rounded-full border-2 border-violet-500 bg-violet-600"
        aria-hidden="true"
      />

      {/* Spacer for alternating layout */}
      <div className="flex-1 hidden md:block" />
    </div>
  )
}

export function Experience() {
  return (
    <SectionWrapper id="experience" className="bg-slate-100/50 dark:bg-zinc-900/30">
      <div className="section-container">
        <span className="section-label">My journey</span>
        <h2 className="section-heading">Experience</h2>

        <div className="relative">
          {/* Vertical line — desktop */}
          <div
            className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-slate-200 dark:bg-zinc-800 -translate-x-1/2"
            aria-hidden="true"
          />
          {/* Vertical line — mobile */}
          <div
            className="md:hidden absolute left-1.5 top-0 bottom-0 w-px bg-slate-200 dark:bg-zinc-800"
            aria-hidden="true"
          />

          <div className="space-y-8">
            {experiences.map((entry, index) => (
              <TimelineEntry key={entry.id} entry={entry} isLeft={index % 2 === 0} />
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}

import { useScrollReveal } from '../hooks/useScrollReveal'
import { useCountUp } from '../hooks/useCountUp'
import { stats } from '../data/stats'

function StatItem({ stat, triggered }) {
  const count = useCountUp(stat.value, {
    duration: 1800,
    decimals: stat.decimals,
    triggered,
  })

  const display = stat.decimals > 0 ? count.toFixed(stat.decimals) : Math.floor(count)

  return (
    <div className="flex flex-col items-center text-center px-4 py-6">
      <div className="font-mono text-4xl sm:text-5xl font-extrabold text-emerald-500 dark:text-emerald-400 leading-none mb-2">
        {display}
        <span className="text-2xl sm:text-3xl">{stat.suffix}</span>
      </div>
      <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-500 leading-snug max-w-[140px]">
        {stat.label}
      </p>
    </div>
  )
}

export function Stats() {
  const { ref, isRevealed } = useScrollReveal(0.1)

  return (
    <section
      id="stats"
      ref={ref}
      className={`py-16 border-y border-emerald-500/10 dark:border-emerald-500/10
        bg-emerald-50/40 dark:bg-emerald-950/10
        transition-all duration-700
        ${isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      aria-label="Impact numbers"
    >
      <div className="section-container">
        <span className="section-label text-center block">Impact by the numbers</span>

        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y divide-emerald-500/10 dark:divide-emerald-500/10 border border-emerald-500/10 dark:border-emerald-500/10 rounded-2xl overflow-hidden bg-white/60 dark:bg-zinc-900/40">
          {stats.map(stat => (
            <StatItem key={stat.label} stat={stat} triggered={isRevealed} />
          ))}
        </div>
      </div>
    </section>
  )
}

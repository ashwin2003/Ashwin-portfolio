import { SectionWrapper } from '../components/SectionWrapper'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { skills } from '../data/skills'

function SkillBar({ name, level, delay }) {
  const { ref, isVisible } = useScrollAnimation(0.1)

  return (
    <div ref={ref} className="mb-4 last:mb-0">
      <div className="flex justify-between text-sm mb-1.5">
        <span className="text-slate-700 dark:text-zinc-300 font-medium">{name}</span>
        <span className="text-violet-600 dark:text-violet-400 font-mono text-xs">{level}%</span>
      </div>
      <div className="h-1.5 bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-violet-600 to-purple-400 rounded-full transition-all duration-1000 ease-out"
          style={{ width: isVisible ? `${level}%` : '0%', transitionDelay: `${delay}ms` }}
          role="progressbar"
          aria-valuenow={level}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${name}: ${level}%`}
        />
      </div>
    </div>
  )
}

function SkillCategory({ category, icon, items }) {
  return (
    <div className="card card-hover p-6 rounded-xl">
      <h3 className="flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-white mb-6">
        <span aria-hidden="true" className="text-xl">{icon}</span>
        {category}
      </h3>
      {items.map((skill, i) => (
        <SkillBar key={skill.name} name={skill.name} level={skill.level} delay={i * 80} />
      ))}
    </div>
  )
}

export function Skills() {
  return (
    <SectionWrapper id="skills" className="bg-slate-100/50 dark:bg-zinc-900/30">
      <div className="section-container">
        <span className="section-label">What I work with</span>
        <h2 className="section-heading">Skills</h2>

        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {skills.map(({ category, icon, items }) => (
            <SkillCategory key={category} category={category} icon={icon} items={items} />
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}

import { SectionWrapper } from '../components/SectionWrapper'
import { Badge } from '../components/Badge'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { skills } from '../data/skills'

function SkillGroup({ category, icon, items }) {
  const { ref, isRevealed } = useScrollReveal(0.1)

  return (
    <div
      ref={ref}
      className={`card card-hover rounded-xl p-6 transition-all duration-700
        ${isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
    >
      <h3 className="flex items-center gap-2.5 text-base font-semibold text-slate-900 dark:text-white mb-5">
        <span aria-hidden="true" className="text-xl">{icon}</span>
        {category}
      </h3>
      <div className="flex flex-wrap gap-2">
        {items.map(skill => (
          <Badge key={skill} variant="default">{skill}</Badge>
        ))}
      </div>
    </div>
  )
}

export function Skills() {
  return (
    <SectionWrapper id="skills" className="bg-slate-100/40 dark:bg-zinc-900/20">
      <div className="section-container">
        <span className="section-label">Tools of the trade</span>
        <h2 className="section-heading">Skills</h2>

        <div className="grid sm:grid-cols-2 gap-5">
          {skills.map(({ category, icon, items }) => (
            <SkillGroup key={category} category={category} icon={icon} items={items} />
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}

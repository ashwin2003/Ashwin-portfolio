import {
  SiJavascript, SiTypescript, SiReact, SiRedux, SiNodedotjs,
  SiHtml5, SiTailwindcss, SiStyledcomponents,
  SiApple, SiAndroid, SiGoogleplay, SiExpo,
  SiFirebase, SiGooglecloud, SiDocker, SiGit, SiGithub, SiGitlab, SiBitbucket,
  SiStripe, SiRazorpay, SiGraphql, SiSocketdotio, SiPostman,
} from 'react-icons/si'
import { SectionWrapper } from '../components/SectionWrapper'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { techStack } from '../data/techstack'

const ICON_MAP = {
  SiJavascript, SiTypescript, SiReact, SiRedux, SiNodedotjs,
  SiHtml5, SiTailwindcss, SiStyledcomponents,
  SiApple, SiAndroid, SiGoogleplay, SiExpo,
  SiFirebase, SiGooglecloud, SiDocker, SiGit, SiGithub, SiGitlab, SiBitbucket,
  SiStripe, SiRazorpay, SiGraphql, SiSocketdotio, SiPostman,
}

function TechBadge({ name, color, icon }) {
  const IconComponent = ICON_MAP[icon]
  return (
    <div
      className="group flex items-center gap-2.5 px-3.5 py-2 card card-hover rounded-xl transition-all duration-200 hover:scale-[1.04] cursor-default"
      title={name}
    >
      <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
        {IconComponent ? (
          <IconComponent size={18} style={{ color }} />
        ) : (
          <span
            className="text-[10px] font-bold font-mono leading-none"
            style={{ color }}
          >
            {name.slice(0, 3).toUpperCase()}
          </span>
        )}
      </span>
      <span className="text-sm text-slate-700 dark:text-zinc-300 whitespace-nowrap">
        {name}
      </span>
    </div>
  )
}

function TechCategory({ category, items, index }) {
  const { ref, isRevealed } = useScrollReveal()
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <h3 className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.18em] mb-4">
        {category}
      </h3>
      <div className="flex flex-wrap gap-2.5">
        {items.map(item => (
          <TechBadge key={item.name} {...item} />
        ))}
      </div>
    </div>
  )
}

export function TechStack() {
  return (
    <SectionWrapper id="techstack">
      <div className="section-container">
        <span className="section-label">Everything I build with</span>
        <h2 className="section-heading">Tech Stack</h2>
        <div className="space-y-10">
          {techStack.map(({ category, items }, i) => (
            <TechCategory key={category} category={category} items={items} index={i} />
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}

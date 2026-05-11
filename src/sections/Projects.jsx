import { useState, useMemo, useCallback } from 'react'
import { SectionWrapper } from '../components/SectionWrapper'
import { Badge } from '../components/Badge'
import { projects, projectCategories } from '../data/projects'

function ProjectCard({ project }) {
  return (
    <article className="card card-hover rounded-2xl overflow-hidden flex flex-col group hover:-translate-y-1 transition-all duration-300">
      {/* Card header band */}
      <div className="h-2 bg-gradient-to-r from-emerald-500 to-cyan-500" aria-hidden="true" />

      <div className="p-6 flex flex-col flex-1">
        {/* Category label */}
        <span className="section-label mb-2">{project.category}</span>

        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 leading-tight">
          {project.title}
        </h3>

        <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed mb-4 flex-1">
          {project.description}
        </p>

        {/* Key metric */}
        <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg border border-emerald-200 dark:border-emerald-500/20">
          <span className="text-emerald-500" aria-hidden="true">▲</span>
          <div>
            <p className="text-xs text-slate-500 dark:text-zinc-500 font-mono uppercase tracking-wide leading-none mb-0.5">
              {project.metricLabel}
            </p>
            <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
              {project.metric}
            </p>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.tags.map(tag => (
            <Badge key={tag} variant="muted">{tag}</Badge>
          ))}
        </div>

        {/* Links */}
        <div className="flex gap-4 pt-4 border-t border-slate-200 dark:border-zinc-800">
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-slate-500 dark:text-zinc-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5 focus:outline-none focus:underline"
            aria-label={`View ${project.title} on GitHub`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            GitHub
          </a>
          <a
            href={project.caseStudy}
            className="text-xs font-medium text-slate-500 dark:text-zinc-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5 focus:outline-none focus:underline"
            aria-label={`Case study for ${project.title}`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            Case Study
          </a>
        </div>
      </div>
    </article>
  )
}

export function Projects() {
  const [activeFilter, setActiveFilter] = useState('All')

  const filtered = useMemo(
    () => activeFilter === 'All' ? projects : projects.filter(p => p.category === activeFilter),
    [activeFilter]
  )

  const handleFilter = useCallback((cat) => setActiveFilter(cat), [])

  return (
    <SectionWrapper id="work">
      <div className="section-container">
        <span className="section-label">What I've shipped</span>
        <h2 className="section-heading">Featured Work</h2>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-8" role="tablist" aria-label="Filter projects by category">
          {projectCategories.map(cat => (
            <button
              key={cat}
              onClick={() => handleFilter(cat)}
              role="tab"
              aria-selected={activeFilter === cat}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-emerald-500
                ${activeFilter === cat
                  ? 'bg-emerald-500 text-white glow-emerald'
                  : 'bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-800 hover:border-emerald-500/40 hover:text-emerald-600 dark:hover:text-emerald-400'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}

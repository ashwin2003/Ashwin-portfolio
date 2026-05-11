import { useScrollReveal } from '../hooks/useScrollReveal'

export function SectionWrapper({ id, children, className = '' }) {
  const { ref, isRevealed } = useScrollReveal()

  return (
    <section
      id={id}
      ref={ref}
      className={`py-20 transition-all duration-700 ease-out
        ${isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        ${className}`}
    >
      {children}
    </section>
  )
}

import { useScrollAnimation } from '../hooks/useScrollAnimation'

export function SectionWrapper({ id, children, className = '' }) {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section
      id={id}
      ref={ref}
      className={`py-20 transition-all duration-700 ease-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        ${className}`}
    >
      {children}
    </section>
  )
}

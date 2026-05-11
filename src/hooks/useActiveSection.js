import { useEffect, useState } from 'react'

export function useActiveSection(sectionIds) {
  const [activeSection, setActiveSection] = useState(sectionIds[0])

  useEffect(() => {
    const observers = sectionIds.reduce((acc, id) => {
      const el = document.getElementById(id)
      if (!el) return acc

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id)
        },
        { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' }
      )

      observer.observe(el)
      acc.push(observer)
      return acc
    }, [])

    return () => observers.forEach(o => o.disconnect())
  }, [sectionIds])

  return activeSection
}

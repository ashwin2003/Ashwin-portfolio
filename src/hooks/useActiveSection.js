import { useEffect, useState, useCallback } from 'react'

export function useActiveSection(sectionIds) {
  const [activeSection, setActiveSection] = useState(sectionIds[0])

  const update = useCallback(() => {
    const offset = 120 // navbar height + buffer

    let current = sectionIds[0]
    for (const id of sectionIds) {
      const el = document.getElementById(id)
      if (!el) continue
      if (el.getBoundingClientRect().top - offset <= 0) {
        current = id
      }
    }
    setActiveSection(current)
  }, [sectionIds])

  useEffect(() => {
    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [update])

  return activeSection
}

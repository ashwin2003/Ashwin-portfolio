import { useState, useCallback, useMemo } from 'react'
import { useTheme } from '../hooks/useTheme'
import { useActiveSection } from '../hooks/useActiveSection'
import { personal } from '../data/personal'

const NAV_LINKS = [
  { label: 'About', href: 'about' },
  { label: 'Journey', href: 'journey' },
  { label: 'Skills', href: 'skills' },
  { label: 'Work', href: 'work' },
  { label: 'Contact', href: 'contact' },
]

const SECTION_IDS = NAV_LINKS.map(l => l.href)

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { isDark, toggleTheme } = useTheme()
  const activeSection = useActiveSection(SECTION_IDS)

  const toggleMenu = useCallback(() => setMenuOpen(o => !o), [])

  const scrollTo = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }, [])

  const scrollToTop = useCallback(() => window.scrollTo({ top: 0, behavior: 'smooth' }), [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800/60 transition-colors duration-300">
      <nav className="section-container h-16 flex items-center justify-between" aria-label="Main navigation">

        {/* Logo */}
        <button
          onClick={scrollToTop}
          className="font-mono text-base font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded"
          aria-label="Scroll to top"
        >
          <span className="text-slate-900 dark:text-white">AJ</span>
          <span className="text-emerald-500">.</span>
        </button>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-1" role="list">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={href}>
              <button
                onClick={() => scrollTo(href)}
                aria-current={activeSection === href ? 'page' : undefined}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-emerald-500
                  ${activeSection === href
                    ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800/60'
                  }`}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>

        {/* Right controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-base"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? '☀️' : '🌙'}
          </button>

          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <div className="w-5 flex flex-col gap-[5px]">
              <span className={`block h-0.5 bg-current rounded transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
              <span className={`block h-0.5 bg-current rounded transition-all duration-300 ${menuOpen ? 'opacity-0 scale-x-0' : ''}`} />
              <span className={`block h-0.5 bg-current rounded transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`md:hidden overflow-hidden transition-all duration-300 border-t border-slate-200 dark:border-zinc-800/60 ${menuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'}`}
        aria-hidden={!menuOpen}
      >
        <ul className="section-container py-3 flex flex-col gap-1" role="list">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={href}>
              <button
                onClick={() => scrollTo(href)}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                  ${activeSection === href
                    ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800'
                  }`}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </header>
  )
}

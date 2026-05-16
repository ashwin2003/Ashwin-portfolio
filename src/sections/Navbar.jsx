import { useState, useCallback, useMemo } from 'react'
import { useTheme } from '../hooks/useTheme'
import { useActiveSection } from '../hooks/useActiveSection'
import { useLivePrices } from '../hooks/useLivePrices'
import { personal } from '../data/personal'

// id matches the Binance symbol key for live-price merging; others stay static
const BASE_TICKERS = [
  { id: 'nifty',    sym: 'NIFTY 50',  price: '23,450',  chg: '+1.24%', up: true  },
  { id: 'sensex',   sym: 'SENSEX',    price: '77,205',  chg: '+0.89%', up: true  },
  { id: 'btcusdt',  sym: 'BTC/USD',   price: '$67,420', chg: '+2.84%', up: true  },
  { id: 'ethusdt',  sym: 'ETH/USD',   price: '$3,891',  chg: '+1.92%', up: true  },
  { id: 'solusdt',  sym: 'SOL/USD',   price: '$178',    chg: '+3.21%', up: true  },
  { id: 'bnbusdt',  sym: 'BNB/USD',   price: '$612',    chg: '+1.10%', up: true  },
  { id: 'xrpusdt',  sym: 'XRP/USD',   price: '$0.621',  chg: '+0.88%', up: true  },
  { id: 'usdinr',   sym: 'USD/INR',   price: '83.42',   chg: '-0.12%', up: false },
  { id: 'reliance', sym: 'RELIANCE',  price: '₹2,934',  chg: '+0.76%', up: true  },
  { id: 'tcs',      sym: 'TCS',       price: '₹3,812',  chg: '+1.45%', up: true  },
  { id: 'gold',     sym: 'GOLD',      price: '₹62,340', chg: '+0.43%', up: true  },
]

const NAV_LINKS = [
  { label: 'About', href: 'about' },
  { label: 'Journey', href: 'journey' },
  { label: 'Stack', href: 'techstack' },
  { label: 'Contact', href: 'contact' },
]

const SECTION_IDS = NAV_LINKS.map(l => l.href)

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { isDark, toggleTheme } = useTheme()
  const activeSection = useActiveSection(SECTION_IDS)
  const livePrices    = useLivePrices()

  // Merge live crypto prices into the base ticker list
  const tickers = useMemo(() =>
    BASE_TICKERS.map(t => livePrices[t.id] ? { ...t, ...livePrices[t.id] } : t),
    [livePrices]
  )

  const toggleMenu = useCallback(() => setMenuOpen(o => !o), [])

  const scrollTo = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }, [])

  const scrollToTop = useCallback(() => window.scrollTo({ top: 0, behavior: 'smooth' }), [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md transition-colors duration-300">

      {/* ── Ticker strip ─────────────────────────────────────────────────────── */}
      <div className="h-7 overflow-hidden bg-slate-100/70 dark:bg-zinc-900/90 border-b border-slate-200 dark:border-zinc-800/60 flex items-center"
           aria-label="Live market data" aria-hidden="true">

        {/* LIVE badge */}
        <div className="flex-shrink-0 px-3 h-full flex items-center gap-1.5
                        bg-slate-200/60 dark:bg-zinc-800/80
                        border-r border-slate-300 dark:border-zinc-700/60">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping"/>
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500"/>
          </span>
          <span className="text-[9px] font-mono font-bold uppercase tracking-widest
                           text-emerald-600 dark:text-emerald-400">Live</span>
        </div>

        {/* scrolling track — items duplicated for seamless loop */}
        <div className="overflow-hidden flex-1 min-w-0">
          <div className="ticker-track flex items-center min-w-max">
            {[...tickers, ...tickers].map((t, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 px-4 select-none">
                {/* orange pulse dot = live from exchange */}
                {t.live && (
                  <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75 animate-ping" style={{ animationDuration: '1.4s' }}/>
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-400"/>
                  </span>
                )}
                <span className="text-[10px] font-mono font-medium
                                 text-slate-500 dark:text-zinc-500 tracking-wide">
                  {t.sym}
                </span>
                <span className="text-[10px] font-mono
                                 text-slate-800 dark:text-zinc-200">
                  {t.price}
                </span>
                <span className={`text-[10px] font-mono font-semibold inline-flex items-center gap-0.5
                  ${t.up
                    ? 'text-emerald-500 dark:text-emerald-400'
                    : 'text-red-500 dark:text-red-400'
                  }`}>
                  {t.up ? '▲' : '▼'} {t.chg}
                </span>
                <span className="text-slate-300 dark:text-zinc-700 text-[10px]">|</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main nav ─────────────────────────────────────────────────────────── */}
      <div className="border-b border-slate-200 dark:border-zinc-800/60">
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
      </div>{/* end main nav wrapper */}
    </header>
  )
}

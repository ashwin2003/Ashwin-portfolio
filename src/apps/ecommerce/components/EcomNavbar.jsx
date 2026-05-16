import { Link, useLocation } from 'react-router-dom'

const LINKS = [
  { label: 'Home',     to: '/ecommerce' },
  { label: 'Products', to: '/ecommerce/products' },
  { label: 'Cart',     to: '/ecommerce/cart' },
]

export function EcomNavbar() {
  const { pathname } = useLocation()
  return (
    <header className="fixed top-0 inset-x-0 z-50 h-14 bg-white/80 dark:bg-zinc-950/80
                       backdrop-blur-md border-b border-slate-200 dark:border-zinc-800 flex items-center">
      <div className="section-container w-full flex items-center justify-between">
        <Link to="/ecommerce"
          className="font-mono font-bold text-slate-900 dark:text-white text-sm">
          SHOP<span className="text-emerald-500">.</span>
        </Link>
        <nav className="flex items-center gap-1">
          {LINKS.map(l => (
            <Link key={l.to} to={l.to}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200
                ${pathname === l.to
                  ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                }`}>
              {l.label}
            </Link>
          ))}
        </nav>
        <Link to="/"
          className="text-xs font-mono text-slate-400 dark:text-zinc-500
                     hover:text-emerald-500 transition-colors duration-200">
          ← portfolio
        </Link>
      </div>
    </header>
  )
}

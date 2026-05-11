import { lazy, Suspense } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import { Navbar } from './sections/Navbar'
import { Hero } from './sections/Hero'
import { Footer } from './sections/Footer'

// Lazy-load all below-fold sections for code splitting
const About       = lazy(() => import('./sections/About').then(m => ({ default: m.About })))
const Journey     = lazy(() => import('./sections/Journey').then(m => ({ default: m.Journey })))
const Stats       = lazy(() => import('./sections/Stats').then(m => ({ default: m.Stats })))
const Skills      = lazy(() => import('./sections/Skills').then(m => ({ default: m.Skills })))
const Projects    = lazy(() => import('./sections/Projects').then(m => ({ default: m.Projects })))
const Contact     = lazy(() => import('./sections/Contact').then(m => ({ default: m.Contact })))

function SectionLoader() {
  return (
    <div className="flex justify-center py-24" aria-hidden="true">
      <div className="w-5 h-5 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 transition-colors duration-300">
        <Navbar />
        <main id="main-content">
          <Hero />
          <Suspense fallback={<SectionLoader />}>
            <About />
            <Journey />
            <Stats />
            <Skills />
            <Projects />
            <Contact />
          </Suspense>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  )
}

import { lazy, Suspense } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import { Navbar } from './sections/Navbar'
import { Hero } from './sections/Hero'
import { Footer } from './sections/Footer'

// Lazy-load below-fold sections for code splitting
const About = lazy(() => import('./sections/About').then(m => ({ default: m.About })))
const Skills = lazy(() => import('./sections/Skills').then(m => ({ default: m.Skills })))
const Projects = lazy(() => import('./sections/Projects').then(m => ({ default: m.Projects })))
const Experience = lazy(() => import('./sections/Experience').then(m => ({ default: m.Experience })))
const Testimonials = lazy(() => import('./sections/Testimonials').then(m => ({ default: m.Testimonials })))
const Contact = lazy(() => import('./sections/Contact').then(m => ({ default: m.Contact })))

function SectionLoader() {
  return (
    <div className="flex justify-center py-20" aria-hidden="true">
      <div className="w-6 h-6 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
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
            <Skills />
            <Projects />
            <Experience />
            <Testimonials />
            <Contact />
          </Suspense>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  )
}

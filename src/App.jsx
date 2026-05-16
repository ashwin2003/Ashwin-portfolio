import { lazy, Suspense, useState, useCallback } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { Navbar } from './sections/Navbar'
import { Hero } from './sections/Hero'
import { Footer } from './sections/Footer'
import { ScrollToTop } from './components/ScrollToTop'
import { SplashScreen } from './components/SplashScreen'
import { CustomCursor } from './components/CustomCursor'
import { NotFound } from './pages/NotFound'
import { AshwinJagarwal } from './pages/AshwinJagarwal'

const About        = lazy(() => import('./sections/About').then(m => ({ default: m.About })))
const Journey      = lazy(() => import('./sections/Journey').then(m => ({ default: m.Journey })))
const Stats        = lazy(() => import('./sections/Stats').then(m => ({ default: m.Stats })))
const TechStack    = lazy(() => import('./sections/TechStack').then(m => ({ default: m.TechStack })))
const Testimonials = lazy(() => import('./sections/Testimonials').then(m => ({ default: m.Testimonials })))
const Contact      = lazy(() => import('./sections/Contact').then(m => ({ default: m.Contact })))

function SectionLoader() {
  return (
    <div className="flex justify-center py-24" aria-hidden="true">
      <div className="w-5 h-5 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
    </div>
  )
}

function MainContent() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <Hero />
        <Suspense fallback={<SectionLoader />}>
          <About />
          <Journey />
          <Stats />
          <TechStack />
          <Testimonials />
          <Contact />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  const [splashDone, setSplashDone] = useState(false)
  const handleSplashDone = useCallback(() => setSplashDone(true), [])
  const { pathname } = useLocation()
  const showCustomCursor = pathname !== '/ashwinJagarwal'

  return (
    <ThemeProvider>
      {showCustomCursor && <CustomCursor />}
      <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 transition-colors duration-300">
        {!splashDone && <SplashScreen onDone={handleSplashDone} />}
        <Routes>
          <Route path="/" element={<MainContent />} />
          <Route path="/ashwinJagarwal" element={<AshwinJagarwal />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ScrollToTop />
      </div>
    </ThemeProvider>
  )
}

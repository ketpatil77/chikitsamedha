import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import StickyBar from './components/StickyBar'
import ToastStack from './components/ToastStack'
import { ThemeProvider } from './context/ThemeContext'
import { LangProvider } from './context/LangContext'
import { ToastProvider } from './context/ToastContext'
import { MotionProvider } from './context/MotionContext'
import { ClinicalProvider } from './context/ClinicalContext'
import Home from './pages/Home'
import Check from './pages/Check'
import Scan from './pages/Scan'
import Report from './pages/Report'
import About from './pages/About'
import { useEffect } from 'react'

function AppShell() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg-app)] text-[var(--text-main)] font-sans">
      <Navbar />

      {/* ── Main Content Area ── */}
      <main className="flex-1 relative z-0">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/check" element={<Check />} />
            <Route path="/scan" element={<Scan />} />
            <Route path="/report" element={<Report />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </main>

      <ToastStack />
    </div>
  )
}

export default function App() {
  return (
    <MotionProvider>
      <ThemeProvider>
        <ClinicalProvider>
          <LangProvider>
            <ToastProvider>
              <AppShell />
            </ToastProvider>
          </LangProvider>
        </ClinicalProvider>
      </ThemeProvider>
    </MotionProvider>
  )
}

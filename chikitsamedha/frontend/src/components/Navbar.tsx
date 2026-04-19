import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import { useLang } from '../context/LangContext'
import { t } from '../i18n'
import {
  Sun, Moon, Menu, X, Home, Activity, ShieldCheck, FileText, Info, Globe
} from 'lucide-react'

const navLinks = [
  { to: '/', key: 'home', icon: Home },
  { to: '/check', key: 'check', icon: Activity },
  { to: '/scan', key: 'scan', icon: ShieldCheck },
  { to: '/report', key: 'report', icon: FileText },
  { to: '/about', key: 'about', icon: Info },
]

export default function Navbar() {
  const { theme, toggle: toggleTheme } = useTheme()
  const { lang, setLang } = useLang()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--border-subtle)] bg-[var(--bg-app)]/80 backdrop-blur-md">
      <div className="layout-container h-16 flex items-center justify-between">
        {/* ── Logo ── */}
        <Link to="/" className="flex items-center gap-2 font-bold text-lg tracking-tight text-white hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-[var(--accent-primary)] flex items-center justify-center text-black">
            <Activity size={18} strokeWidth={3} />
          </div>
          Chikitsāmedhā
        </Link>

        {/* ── Desktop Links ── */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const active = location.pathname === link.to
            return (
              <Link
                key={link.key}
                to={link.to}
                className={`text-sm font-medium transition-colors ${active ? 'text-white' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
              >
                {t(link.key as any, lang)}
              </Link>
            )
          })}
        </div>

        {/* ── Actions ── */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLang(lang === 'en' ? 'mr' : 'en')}
            className="btn btn-ghost h-9 px-2 text-xs uppercase"
          >
            <Globe size={14} className="mr-1.5" />
            {lang}
          </button>

          <button
            onClick={toggleTheme}
            className="btn btn-ghost h-9 w-9 px-0"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <button
            className="md:hidden btn btn-ghost h-9 w-9 px-0"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-[var(--border-subtle)] bg-[var(--bg-panel)] overflow-hidden"
          >
            <div className="flex flex-col p-4 gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.key}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--bg-app)] text-[var(--text-main)] transition-colors"
                >
                  <link.icon size={18} className="text-[var(--text-muted)]" />
                  {t(link.key as any, lang)}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

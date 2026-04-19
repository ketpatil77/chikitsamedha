import { useRef, useState, useEffect } from 'react'
import { API_BASE } from '../lib/theme'
import { Search, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMotion } from '../context/MotionContext'

interface Suggestion { label: string; value: string; score?: number }
interface Props {
  placeholder: string
  onSelect: (value: string) => void
}

export default function SearchBar({ placeholder, onSelect }: Props) {
  const [query, setQuery] = useState('')
  const [items, setItems] = useState<Suggestion[]>([])
  const [focused, setFocused] = useState(false)
  const [loading, setLoading] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { reduced } = useMotion()

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    setQuery(v)
    if (timer.current) clearTimeout(timer.current)

    if (v.length < 2) {
      setItems([])
      setLoading(false)
      return
    }

    setLoading(true)
    timer.current = setTimeout(() => {
      fetch(`${API_BASE}/api/suggest?type=medicine&q=${encodeURIComponent(v)}`)
        .then(r => r.json())
        .then(j => {
          setItems(j.suggestions || [])
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }, 300)
  }

  const highlight = (label: string) => {
    if (!query) return label
    const idx = label.toLowerCase().indexOf(query.toLowerCase())
    if (idx === -1) return label
    return (
      <>
        {label.slice(0, idx)}
        <span className="font-semibold text-[var(--accent)]">{label.slice(idx, idx + query.length)}</span>
        {label.slice(idx + query.length)}
      </>
    )
  }

  return (
    <div className="relative w-full max-w-[280px] hidden sm:block group">
      <div
        className={`
          flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[var(--border-primary)]
          bg-[var(--bg-elevated)] transition-all duration-200
          ${focused ? 'border-[var(--accent)] shadow-[0_0_0_2px_var(--accent-glow)]' : 'hover:border-[var(--border-hover)]'}
        `}
      >
        <Search size={14} className={`opacity-40 transition-colors ${focused ? 'text-[var(--accent)] opacity-100' : ''}`} />
        <input
          className="bg-transparent text-sm w-full outline-none placeholder:text-[var(--text-tertiary)]"
          placeholder={placeholder}
          value={query}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
        />
        {loading && <Loader2 size={13} className="animate-spin opacity-40" />}
      </div>

      <AnimatePresence>
        {items.length > 0 && focused && (
          <motion.div
            initial={reduced ? {} : { opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-[var(--bg-elevated)] border border-[var(--border-primary)] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] z-50 overflow-hidden backdrop-blur-xl"
          >
            {items.map((it, i) => (
              <button
                key={i}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-[var(--bg-surface-raised)] transition-colors border-b border-[var(--border-primary)] last:border-0"
                onMouseDown={() => {
                  onSelect(it.value)
                  setQuery('')
                  setItems([])
                }}
              >
                {highlight(it.label)}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

import { motion } from 'framer-motion'

type Chip = { key: string; label: string; emoji: string }
const CHIPS: Chip[] = [
  { key: 'Alcohol', label: 'Alcohol', emoji: '🍷' },
  { key: 'Grapefruit', label: 'Grapefruit', emoji: '🍊' },
  { key: 'Food', label: 'With Food', emoji: '🍽️' },
]

export default function ContextChips({ value, onChange }: { value: string[]; onChange: (next: string[]) => void }) {
  const setToggle = (k: string) => {
    const has = value.includes(k)
    const next = has ? value.filter(x => x !== k) : [...value, k]
    onChange(next)
  }
  return (
    <div className="flex flex-wrap gap-2">
      {CHIPS.map(ch => {
        const active = value.includes(ch.key)
        return (
          <motion.button
            key={ch.key}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.03 }}
            onClick={() => setToggle(ch.key)}
            className={`
              inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium
              border transition-all duration-200 cursor-pointer
              ${active
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 shadow-[0_0_12px_rgba(14,164,122,.1)]'
                : 'bg-transparent border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-hover)] hover:bg-emerald-500/5'
              }
            `}
            aria-pressed={active}
          >
            <span aria-hidden className="text-base">{ch.emoji}</span>
            {ch.label}
            {active && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-1.5 h-1.5 rounded-full bg-emerald-500 ml-0.5"
              />
            )}
          </motion.button>
        )
      })}
    </div>
  )
}

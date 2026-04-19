import { t } from '../i18n'
import { useLang } from '../context/LangContext'
import { FlaskConical, FileDown, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMotion } from '../context/MotionContext'

interface Props {
  onAnalyze: () => void
  onExport: () => void
  disabled?: boolean
  showExport?: boolean
}

export default function StickyBar({ onAnalyze, onExport, disabled, showExport }: Props) {
  const { lang } = useLang()
  const { reduced } = useMotion()

  return (
    <motion.div
      initial={reduced ? {} : { y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      className="fixed bottom-0 inset-x-0 z-40 bg-[var(--bg-elevated)] border-t border-[var(--border-primary)] shadow-[0_-8px_32px_rgba(0,0,0,0.1)] backdrop-blur-xl md:hidden pb-[env(safe-area-inset-bottom)]"
    >
      <div className="p-4 flex gap-3">
        {showExport ? (
          <motion.button
            whileTap={reduced ? {} : { scale: 0.96 }}
            className="btn flex-1 py-3 text-sm font-semibold border-[var(--border-primary)] active:bg-[var(--bg-surface-raised)]"
            onClick={onExport}
          >
            <FileDown size={18} />
            {t('exportPdf', lang)}
          </motion.button>
        ) : (
          <motion.button
            whileTap={reduced ? {} : { scale: 0.96 }}
            className="btn btn-primary flex-1 py-3 text-sm font-semibold shadow-accent-strong"
            onClick={onAnalyze}
            disabled={disabled}
          >
            {disabled ? (
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                <Sparkles size={18} />
              </motion.div>
            ) : (
              <FlaskConical size={18} />
            )}
            {disabled ? t('working', lang) : t('analyzeSafety', lang)}
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}

import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from '../context/ToastContext'
import { CheckCircle, AlertTriangle, AlertCircle, Info, X } from 'lucide-react'
import { useMotion } from '../context/MotionContext'

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

const colors = {
  success: {
    bg: 'var(--safe-bg)',
    border: 'var(--safe-border)',
    text: 'var(--safe)',
    iconBg: '#10B981',
  },
  error: {
    bg: 'var(--danger-bg)',
    border: 'var(--danger-border)',
    text: 'var(--danger)',
    iconBg: '#EF4444',
  },
  warning: {
    bg: 'var(--caution-bg)',
    border: 'var(--caution-border)',
    text: 'var(--caution)',
    iconBg: '#F59E0B',
  },
  info: {
    bg: 'var(--info-bg)',
    border: 'var(--info-border)',
    text: '#3B82F6',
    iconBg: '#3B82F6',
  },
}

export default function ToastStack() {
  const { toasts, remove } = useToast()
  const { reduced } = useMotion()

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none"
      style={{ maxWidth: 360, width: 'calc(100% - 32px)' }}
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const Icon = icons[toast.kind]
          const c = colors[toast.kind]

          return (
            <motion.div
              layout={!reduced}
              key={toast.id}
              initial={reduced ? { opacity: 0 } : { opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="pointer-events-auto p-4 rounded-xl shadow-floating flex items-start gap-3 relative overflow-hidden group backdrop-blur-md"
              style={{
                background: 'var(--bg-elevated)',
                border: `1px solid ${c.border}`,
                boxShadow: `0 8px 32px -4px rgba(0,0,0,0.1), 0 0 0 1px ${c.border} inset`,
              }}
            >
              {/* Colored status bar */}
              <div
                className="absolute left-0 top-0 bottom-0 w-1"
                style={{ background: c.text }}
              />

              <div
                className="mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                style={{ background: `${c.text}20` }}
              >
                <Icon size={14} style={{ color: c.text }} />
              </div>

              <div className="flex-1 pr-6">
                <p className="text-sm font-medium leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                  {toast.text}
                </p>
              </div>

              <button
                onClick={() => remove(toast.id)}
                className="absolute top-2 right-2 p-1.5 rounded-lg opacity-40 hover:opacity-100 hover:bg-[var(--bg-surface-raised)] transition-all"
                aria-label="Close"
              >
                <X size={14} />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

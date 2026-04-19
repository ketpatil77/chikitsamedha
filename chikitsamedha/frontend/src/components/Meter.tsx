import { motion, animate, useMotionValue, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useMotion } from '../context/MotionContext'

interface MeterProps {
  value: number
  label: string
  accent?: string
  size?: 'sm' | 'md' | 'lg'
  showRing?: boolean
  icon?: React.ReactNode
  suffix?: string
}

/**
 * Premium Meter Component v4
 *
 * Features:
 * - Animated number counter (tabular-nums)
 * - Gradient progress bar with shimmer overlay
 * - Optional circular ring variant
 * - Size variants
 * - Accessible ARIA attributes
 * - Reduced motion support
 */
const Counter = ({ value }: { value: number }) => {
  const nodeRef = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const node = nodeRef.current
    if (!node) return
    const controls = animate(0, value, {
      duration: 1.2,
      onUpdate: (v) => { node.textContent = Math.round(v).toString() }
    })
    return () => controls.stop()
  }, [value])
  return <span ref={nodeRef} />
}

export default function Meter({
  value,
  label,
  accent = '#0EA47A',
  size = 'md',
  showRing = false,
  icon,
  suffix = '%',
}: MeterProps) {
  const { reduced } = useMotion()
  const displayRef = useRef<HTMLSpanElement>(null)
  const [hasAnimated, setHasAnimated] = useState(false)

  const heights = { sm: 6, md: 8, lg: 10 }
  const textSizes = { sm: 'text-lg', md: 'text-2xl', lg: 'text-3xl' }
  const barHeight = heights[size]

  useEffect(() => {
    if (hasAnimated) return
    setHasAnimated(true)

    if (reduced) {
      if (displayRef.current) displayRef.current.textContent = `${Math.round(value)}`
      return
    }

    const controls = animate(0, value, {
      duration: 1.2,
      ease: [0.4, 0, 0.2, 1],
      onUpdate: (v) => {
        if (displayRef.current) displayRef.current.textContent = `${Math.round(v)}`
      },
    })
    return controls.stop
  }, [value, reduced, hasAnimated])

  if (showRing) {
    return <RingMeter value={value} label={label} accent={accent} size={size} />
  }

  return (
    <div
      className="meter"
      role="meter"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div className="flex justify-between mb-2">
        <span className="text-xs font-display font-medium uppercase tracking-wider opacity-70">{label}</span>
        <span className="font-mono font-bold text-sm tabular-nums">
          <Counter value={value} />
          {suffix}
        </span>
      </div>

      <div className="meter-bar" style={{ height: barHeight }}>
        <motion.div
          className="meter-fill"
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={reduced ? { duration: 0 } : { duration: 1, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
          style={{ background: `linear-gradient(90deg, ${accent}CC, ${accent})` }}
        />
      </div>
    </div>
  )
}

/* ── Circular Ring Variant ────────────────────── */
function RingMeter({
  value,
  label,
  accent = '#0EA47A',
  size = 'md',
}: { value: number; label: string; accent?: string; size?: string }) {
  const { reduced } = useMotion()
  const ref = useRef<HTMLSpanElement>(null)

  const dimensions = { sm: 80, md: 100, lg: 120 }
  const strokeWidths = { sm: 6, md: 7, lg: 8 }
  const dim = dimensions[size as keyof typeof dimensions] || 100
  const sw = strokeWidths[size as keyof typeof strokeWidths] || 7
  const radius = (dim - sw) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference

  useEffect(() => {
    if (reduced) {
      if (ref.current) ref.current.textContent = `${Math.round(value)}`
      return
    }

    const controls = animate(0, value, {
      duration: 1.2,
      ease: [0.4, 0, 0.2, 1],
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = `${Math.round(v)}`
      },
    })
    return controls.stop
  }, [value, reduced])

  return (
    <div className="flex flex-col items-center gap-2" role="meter" aria-valuenow={value} aria-label={label}>
      <div className="relative" style={{ width: dim, height: dim }}>
        <svg width={dim} height={dim} className="rotate-[-90deg]">
          {/* Background circle */}
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={radius}
            fill="none"
            stroke="var(--skeleton-base)"
            strokeWidth={sw}
          />
          {/* Value arc */}
          <motion.circle
            cx={dim / 2}
            cy={dim / 2}
            r={radius}
            fill="none"
            stroke={accent}
            strokeWidth={sw}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={reduced ? { duration: 0 } : { duration: 1.2, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 6px ${accent}40)`,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="text-xl font-bold tabular-nums"
            style={{ fontFamily: 'var(--font-display)', color: accent }}
          >
            <span ref={ref}>0</span>
            <span className="text-xs opacity-50">%</span>
          </span>
        </div>
      </div>
      <span className="text-xs font-medium opacity-60 text-center">{label}</span>
    </div>
  )
}

export { RingMeter }

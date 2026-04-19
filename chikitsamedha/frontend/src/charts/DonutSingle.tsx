import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { motion, animate } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { useMotion } from '../context/MotionContext'

interface Props {
  label: string
  value: number
  color?: string
}

/**
 * Premium DonutSingle v4 — Recharts PieChart
 * 
 * Features:
 * - Recharts donut with animated reveal
 * - Centered animated counter
 * - Subtle glow effect
 * - Gradient fill
 */
export default function DonutSingle({ label, value, color = '#0EA47A' }: Props) {
  const { reduced } = useMotion()
  const ref = useRef<HTMLSpanElement>(null)

  const data = [
    { name: 'value', value },
    { name: 'remainder', value: 100 - value },
  ]

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
      }
    })
    return controls.stop
  }, [value, reduced])

  return (
    <motion.div
      initial={reduced ? {} : { opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center gap-2"
    >
      <div className="relative" style={{ width: 100, height: 100 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={32}
              outerRadius={42}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              animationDuration={reduced ? 0 : 1000}
              animationEasing="ease-out"
              stroke="none"
            >
              <Cell fill={color} style={{ filter: `drop-shadow(0 0 4px ${color}40)` }} />
              <Cell fill="var(--skeleton-base)" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center number */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="text-lg font-bold tabular-nums"
            style={{ fontFamily: 'var(--font-display)', color }}
          >
            <span ref={ref}>0</span>
            <span className="text-[10px] opacity-50">%</span>
          </span>
        </div>
      </div>
      <span className="text-xs font-medium opacity-60 text-center">{label}</span>
    </motion.div>
  )
}

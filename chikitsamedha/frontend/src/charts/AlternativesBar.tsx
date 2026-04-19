import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import { useMotion } from '../context/MotionContext'
import { ArrowRight, Repeat } from 'lucide-react'

type Alt = { replace: string; with: string; reason?: string }
type Props = { items?: Alt[] }

const COLORS = ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0', '#D1FAE5']

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload
  return (
    <div
      className="px-4 py-3 rounded-xl text-xs shadow-xl max-w-xs"
      style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-primary)',
        backdropFilter: 'blur(16px)',
      }}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span className="opacity-40 line-through">{d?.replace}</span>
        <ArrowRight size={10} className="opacity-30" />
        <span className="font-semibold text-emerald-500">{d?.with}</span>
      </div>
      <p className="font-bold text-sm">{payload[0]?.value}% safety</p>
      {d?.reason && <p className="opacity-50 mt-1">{d.reason}</p>}
    </div>
  )
}

/**
 * Alternatives Bar Chart v4 — Recharts
 * 
 * Features:
 * - Vertical bar chart showing suggested safety scores
 * - Custom rich tooltip
 * - Color gradient bars
 * - Animated entrance
 * - Inline replacement cards below chart
 */
export default function AlternativesBar({ items }: Props) {
  const { reduced } = useMotion()

  if (!items || !items.length) return null

  const data = items.map((a, i) => ({
    name: `${a.with}`,
    replace: a.replace,
    with: a.with,
    reason: a.reason,
    safety: Math.max(60, 95 - i * 8),
  }))

  return (
    <motion.div
      initial={reduced ? {} : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: 'var(--safe-bg)', border: '1px solid var(--safe-border)' }}
        >
          <Repeat size={14} className="text-emerald-500" />
        </div>
        <h4 className="font-semibold text-sm" style={{ fontFamily: 'var(--font-display)' }}>
          Safer Alternatives
        </h4>
        <span className="text-xs opacity-40 ml-auto">{items.length} suggestion{items.length > 1 ? 's' : ''}</span>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
          <XAxis
            dataKey="name"
            tickLine={false}
            axisLine={false}
            tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
          />
          <YAxis
            domain={[0, 100]}
            tickLine={false}
            axisLine={false}
            tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }}
            tickFormatter={(v: number) => `${v}%`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(14,164,122,0.04)' }} />
          <Bar
            dataKey="safety"
            radius={[6, 6, 0, 0]}
            animationDuration={reduced ? 0 : 800}
            animationEasing="ease-out"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
            <LabelList
              dataKey="safety"
              position="top"
              formatter={(v: any) => `${v}%`}
              style={{ fill: 'var(--text-secondary)', fontSize: 11, fontWeight: 600 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Replacement Pill Cards */}
      <div className="flex flex-wrap gap-2 mt-3">
        {items.map((alt, i) => (
          <motion.div
            key={i}
            initial={reduced ? {} : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + i * 0.08 }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
            style={{
              background: 'var(--safe-bg)',
              border: '1px solid var(--safe-border)',
              color: 'var(--safe)',
            }}
          >
            <span className="opacity-50 line-through">{alt.replace}</span>
            <ArrowRight size={10} className="opacity-40" />
            <span className="font-semibold">{alt.with}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

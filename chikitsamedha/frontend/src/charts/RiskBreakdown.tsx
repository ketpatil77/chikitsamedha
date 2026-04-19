import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { motion } from 'framer-motion'
import { useMotion } from '../context/MotionContext'
import { BarChart3 } from 'lucide-react'

type Props = {
  breakdown: Record<string, number>
}

const LABELS: Record<string, string> = {
  pair_rules: 'Drug Pair Rules',
  disease: 'Disease Context',
  age_bmi: 'Age / BMI',
  contra: 'Contraindication',
  food: 'Food Interaction',
  alcohol: 'Alcohol',
  grapefruit: 'Grapefruit',
}

const COLORS = ['#0EA47A', '#06B6D4', '#3B82F6', '#A855F7', '#F59E0B', '#EF4444', '#EC4899']

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div
      className="px-3 py-2 rounded-lg text-xs font-medium shadow-xl"
      style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-primary)',
        backdropFilter: 'blur(16px)',
      }}
    >
      <p className="opacity-60 mb-0.5">{label}</p>
      <p className="text-sm font-bold" style={{ color: payload[0]?.fill }}>{payload[0]?.value}%</p>
    </div>
  )
}

/**
 * Risk Breakdown v4 — Recharts horizontal bar chart
 * 
 * Features:
 * - Premium Recharts horizontal bar chart
 * - Custom tooltip with glass style
 * - Individual bar colors
 * - Animated entrance
 * - Responsive
 */
export default function RiskBreakdown({ breakdown }: Props) {
  const { reduced } = useMotion()

  if (!breakdown || !Object.keys(breakdown).length) return null

  const data = Object.entries(breakdown)
    .filter(([, v]) => v > 0)
    .map(([key, value], i) => ({
      name: LABELS[key] || key.replace(/_/g, ' '),
      value,
      fill: COLORS[i % COLORS.length],
    }))
    .sort((a, b) => b.value - a.value)

  return (
    <motion.div
      initial={reduced ? {} : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: 'var(--info-bg)', border: '1px solid var(--info-border)' }}
        >
          <BarChart3 size={14} className="text-blue-500" />
        </div>
        <h4 className="font-semibold text-sm" style={{ fontFamily: 'var(--font-display)' }}>
          Risk Contribution
        </h4>
      </div>

      <ResponsiveContainer width="100%" height={data.length * 44 + 20}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 16, bottom: 0, left: 0 }}
          barCategoryGap="20%"
        >
          <XAxis
            type="number"
            domain={[0, 100]}
            tickLine={false}
            axisLine={false}
            tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }}
            tickFormatter={(v: number) => `${v}%`}
          />
          <YAxis
            dataKey="name"
            type="category"
            width={110}
            tickLine={false}
            axisLine={false}
            tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(14,164,122,0.04)' }} />
          <Bar
            dataKey="value"
            radius={[0, 6, 6, 0]}
            animationDuration={reduced ? 0 : 800}
            animationEasing="ease-out"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  )
}

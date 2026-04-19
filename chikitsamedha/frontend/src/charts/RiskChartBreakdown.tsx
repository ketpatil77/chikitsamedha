import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid
} from 'recharts'

const LABELS: Record<string, string> = {
    pair_rules: 'Interaction',
    disease: 'Comorbidity',
    age_bmi: 'Demographics',
    contra: 'Contraindication',
    food: 'Diet',
    alcohol: 'Alcohol',
}

const COLORS = (score: number) => {
    if (score < 30) return 'var(--safe)'
    if (score < 60) return 'var(--warning)'
    return 'var(--danger)'
}

function CustomTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null
    return (
        <div className="bg-[var(--bg-panel)] border border-[var(--border-subtle)] p-3 rounded-lg shadow-xl">
            <div className="text-xs text-[var(--text-muted)] mb-1 uppercase tracking-wider">{label}</div>
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ background: payload[0].fill }} />
                <span className="font-mono font-bold text-white text-lg">{payload[0].value}%</span>
            </div>
        </div>
    )
}

export default function RiskChartBreakdown({ breakdown }: { breakdown: Record<string, number> }) {
    if (!breakdown) return null

    const data = Object.entries(breakdown)
        .filter(([, v]) => v > 0)
        .map(([key, value]) => ({
            name: LABELS[key] || key,
            value: value,
            fill: COLORS(value)
        }))
        .sort((a, b) => b.value - a.value)

    if (!data.length) return null

    return (
        <div className="w-full h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{ top: 0, right: 30, left: 0, bottom: 0 }}
                    barCategoryGap={6}
                >
                    <CartesianGrid horizontal={false} stroke="var(--border-subtle)" strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} hide />
                    <YAxis
                        dataKey="name"
                        type="category"
                        width={100}
                        tick={{ fill: 'var(--text-muted)', fontSize: 11, fontFamily: 'var(--font-sans)' }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip cursor={{ fill: 'var(--bg-panel-hover)' }} content={<CustomTooltip />} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} animationDuration={800}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

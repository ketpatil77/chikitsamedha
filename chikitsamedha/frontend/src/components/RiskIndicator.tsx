import { motion } from 'framer-motion'
import { AlertTriangle, CheckCircle, ShieldAlert, XCircle } from 'lucide-react'

const CONFIG = {
    low: { color: 'var(--safe)', bg: 'var(--safe-bg)', icon: CheckCircle, label: 'Safe' },
    moderate: { color: 'var(--warning)', bg: 'var(--warning-bg)', icon: AlertTriangle, label: 'Moderate' },
    high: { color: 'var(--danger)', bg: 'var(--danger-bg)', icon: ShieldAlert, label: 'High Risk' },
    contraindicated: { color: 'var(--text-main)', bg: 'var(--danger)', icon: XCircle, label: 'Contraindicated' }
}

export default function RiskIndicator({ level, score, title, description, breakdown }: any) {
    const c = CONFIG[level as keyof typeof CONFIG] || CONFIG.low
    const Icon = c.icon

    return (
        <div className="card-panel border-l-4" style={{ borderLeftColor: c.color }}>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-[var(--border-subtle)] mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: c.bg, color: c.color }}>
                        <Icon size={24} />
                    </div>
                    <div>
                        <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: c.color }}>
                            {c.label}
                        </div>
                        <h2 className="text-xl font-bold text-white leading-tight">{title}</h2>
                    </div>
                </div>

                <div className="text-right">
                    <div className="text-4xl font-bold font-mono tracking-tight text-white">
                        {score}%
                    </div>
                    <div className="text-xs text-[var(--text-muted)] mt-1">Risk Score</div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <h4 className="text-sm font-semibold text-[var(--text-muted)] mb-2 uppercase tracking-wide">Explanation</h4>
                    <p className="text-sm leading-relaxed text-[var(--text-main)]">
                        {description}
                    </p>
                </div>

                {breakdown && (
                    <div>
                        <h4 className="text-sm font-semibold text-[var(--text-muted)] mb-2 uppercase tracking-wide">Factors</h4>
                        <div className="space-y-3">
                            {Object.entries(breakdown).map(([k, v]: [string, any]) => (
                                <div key={k} className="flex items-center gap-3 text-xs">
                                    <span className="w-24 text-[var(--text-dim)] capitalize truncate">{k.replace(/_/g, ' ')}</span>
                                    <div className="flex-1 h-2 bg-[var(--border-subtle)] rounded-full overflow-hidden">
                                        <div className="h-full bg-[var(--accent-primary)]" style={{ width: `${v}%`, opacity: 0.8 }} />
                                    </div>
                                    <span className="w-8 text-right font-mono text-[var(--text-main)]">{v}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

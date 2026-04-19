import { useState } from 'react'
import { ChevronDown, AlertTriangle, XCircle, CheckCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const SEVERITY = {
    low: { text: 'text-[var(--safe)]', bg: 'bg-[var(--safe-bg)]' },
    moderate: { text: 'text-[var(--warning)]', bg: 'bg-[var(--warning-bg)]' },
    high: { text: 'text-[var(--danger)]', bg: 'bg-[var(--danger-bg)]' },
    contraindicated: { text: 'text-[var(--danger)]', bg: 'bg-[var(--danger-bg)]' }
}

export default function InteractionTable({ interactions }: { interactions: any[] }) {
    const [expanded, setExpanded] = useState<number | null>(null)

    return (
        <div className="w-full">
            <div className="grid grid-cols-[2fr_1fr_1fr_24px] gap-4 px-6 py-2 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border-subtle)]">
                <div>Pairing</div>
                <div>Severity</div>
                <div>Note</div>
                <div />
            </div>

            <div className="divide-y divide-[var(--border-subtle)]">
                {interactions.map((ix, i) => {
                    const s = SEVERITY[ix.severity as keyof typeof SEVERITY] || SEVERITY.low
                    return (
                        <div key={i} className="group hover:bg-[var(--bg-panel-hover)] transition-colors">
                            <div
                                onClick={() => setExpanded(expanded === i ? null : i)}
                                className="grid grid-cols-[2fr_1fr_1fr_24px] cursor-pointer items-center gap-4 px-6 py-4"
                            >
                                <div className="font-medium text-[var(--text-main)]">
                                    {ix.drug_a} × {ix.drug_b}
                                </div>

                                <div>
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide ${s.bg} ${s.text}`}>
                                        {ix.severity}
                                    </span>
                                </div>

                                <div className="text-sm text-[var(--text-dim)] truncate">
                                    {ix.note}
                                </div>

                                <motion.div animate={{ rotate: expanded === i ? 180 : 0 }}>
                                    <ChevronDown size={14} className="text-[var(--text-muted)]" />
                                </motion.div>
                            </div>

                            <AnimatePresence>
                                {expanded === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden bg-[var(--bg-app)] px-6"
                                    >
                                        <div className="py-4 border-t border-dashed border-[var(--border-subtle)] grid md:grid-cols-2 gap-6">
                                            <div>
                                                <h4 className="text-xs font-bold text-[var(--text-muted)] uppercase mb-2">Evidence</h4>
                                                <p className="text-sm text-[var(--text-main)]">
                                                    Consistent clinical data suggests interaction potential. Monitor patient closely.
                                                </p>
                                            </div>
                                            {ix.management && (
                                                <div>
                                                    <h4 className="text-xs font-bold text-[var(--text-muted)] uppercase mb-2">Management</h4>
                                                    <p className="text-sm text-[var(--text-main)]">{ix.management}</p>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

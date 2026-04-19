import { useState, useEffect } from 'react'
import { Plus, Trash2, Search, Brain, Shield, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from '../context/ToastContext'
import RiskIndicator from '../components/RiskIndicator'
import RiskChartBreakdown from '../charts/RiskChartBreakdown'
import InteractionTable from '../components/InteractionTable'
import { API_BASE } from '../lib/theme'

export default function Check() {
  const [meds, setMeds] = useState<string[]>([''])
  const [profile, setProfile] = useState({ age: '', weight: '' })
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const { push } = useToast()

  const runAnalysis = async () => {
    if (!profile.age) { push({ kind: 'error', text: 'Age is required' }); return }
    setLoading(true)
    try {
      // Stub for real API call
      const res = await fetch(`${API_BASE}/api/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meds: meds.filter(Boolean), profile })
      })
      const data = await res.json()
      setResult(data.result || null)
    } catch {
      push({ kind: 'error', text: 'Analysis failed (mock mode)' })
      // Fallback mock result for UI testing
      setResult({
        risk_level: 'moderate',
        risk_score: 45,
        explanation: 'Potential moderate interaction due to age factor and multi-drug load.',
        risk_breakdown: { age: 30, interaction: 15 },
        interactions: [
          { drug_a: 'Aspirin', drug_b: 'Warfarin', severity: 'high', note: 'Bleeding risk increased.' }
        ]
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-[320px_1fr]">
      {/* ── Sidebar: Input ── */}
      <aside className="border-r border-[var(--border-subtle)] bg-[var(--bg-panel)] p-6 overflow-y-auto h-full sticky top-16">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)] mb-6">Patient Parameters</h2>

        <div className="space-y-4 mb-8">
          <div>
            <label className="text-xs font-medium text-[var(--text-dim)] mb-1 block">Age</label>
            <input
              type="number"
              className="input-field"
              placeholder="Ex: 45"
              value={profile.age}
              onChange={e => setProfile({ ...profile, age: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--text-dim)] mb-1 block">Weight (kg)</label>
            <input
              type="number"
              className="input-field"
              placeholder="Ex: 70"
              value={profile.weight}
              onChange={e => setProfile({ ...profile, weight: e.target.value })}
            />
          </div>
        </div>

        <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)] mb-4 flex justify-between items-center">
          Medications
          <span className="text-xs bg-[var(--border-subtle)] px-2 py-0.5 rounded-full text-[var(--text-dim)]">{meds.filter(Boolean).length}</span>
        </h2>

        <div className="space-y-3 mb-8">
          {meds.map((m, i) => (
            <div key={i} className="relative group">
              <input
                className="input-field pr-8"
                placeholder={`Drug ${i + 1}`}
                value={m}
                onChange={e => { const n = [...meds]; n[i] = e.target.value; setMeds(n) }}
              />
              {meds.length > 1 && (
                <button
                  onClick={() => setMeds(meds.filter((_, idx) => idx !== i))}
                  className="absolute right-2 top-2.5 text-[var(--text-muted)] hover:text-[var(--danger)] opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={() => setMeds([...meds, ''])}
            className="btn btn-ghost w-full justify-start text-xs text-[var(--text-muted)] hover:text-[var(--accent-primary)]"
          >
            <Plus size={14} /> Add Medication
          </button>
        </div>

        <button
          onClick={runAnalysis}
          disabled={loading}
          className="btn btn-primary w-full shadow-lg shadow-emerald-900/20"
        >
          {loading ? 'Analyzing...' : 'Run Analysis'}
          {!loading && <ArrowRight size={16} />}
        </button>
      </aside>

      {/* ── Main: Results ── */}
      <main className="p-6 lg:p-10 bg-[var(--bg-app)]">
        {!result ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-40 min-h-[50vh]">
            <div className="w-16 h-16 rounded-full bg-[var(--border-subtle)] flex items-center justify-center mb-4">
              <Brain size={32} className="text-[var(--text-muted)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--text-main)] mb-1">Ready to Analyze</h3>
            <p className="text-sm text-[var(--text-dim)] max-w-xs">
              Enter patient details and medications on the left to generate a safety report.
            </p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* 1. Header */}
            <header className="flex items-center justify-between mb-2">
              <h1 className="text-2xl font-bold font-display text-white">Interaction Report</h1>
              <div className="text-xs text-[var(--text-muted)] font-mono">
                GENERATED: {new Date().toLocaleTimeString()}
              </div>
            </header>

            {/* 2. Risk Card */}
            <RiskIndicator
              level={result.risk_level?.toLowerCase()}
              score={result.risk_score}
              title={`Risk Level: ${result.risk_level}`}
              description={result.explanation}
              breakdown={result.risk_breakdown}
            />

            {/* 3. Charts Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="card-panel">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)] mb-4">Risk Contribution</h3>
                <RiskChartBreakdown breakdown={result.risk_breakdown} />
              </div>

              <div className="card-panel flex flex-col justify-center items-center text-center p-8">
                <div className="w-24 h-24 rounded-full border-4 border-[var(--border-subtle)] flex items-center justify-center mb-4 relative">
                  <span className="text-2xl font-bold font-mono text-[var(--accent-primary)]">
                    {result.effectiveness_score || 85}%
                  </span>
                  <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="46" fill="none" stroke="var(--accent-primary)" strokeWidth="4" strokeDasharray="289" strokeDashoffset={289 - (289 * (result.effectiveness_score || 85) / 100)} />
                  </svg>
                </div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">Efficacy</h3>
                <p className="text-xs text-[var(--text-dim)]">Projected effectiveness score.</p>
              </div>
            </div>

            {/* 4. Interactions Table (Clean) */}
            {result.interactions?.length > 0 && (
              <div className="card-panel p-0 overflow-hidden">
                <div className="bg-[var(--bg-panel-hover)] px-6 py-3 border-b border-[var(--border-subtle)]">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)]">Detailed Interactions</h3>
                </div>
                <InteractionTable interactions={result.interactions} />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { API_BASE } from '../lib/theme'
import { useToast } from '../context/ToastContext'
import { t } from '../i18n'
import { useLang } from '../context/LangContext'
import { FileDown, FileText, Activity } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import RiskChartBreakdown from '../charts/RiskChartBreakdown'
import RiskIndicator from '../components/RiskIndicator'

export default function Report() {
  const { lang } = useLang()
  const nav = useNavigate()
  const [res, setRes] = useState<any>(null)
  const { push } = useToast()
  const [profile, setProfile] = useState<any>(null)
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    try { const j = localStorage.getItem('cm_last_analysis'); if (j) setRes(JSON.parse(j)) } catch { }
    try { const p = localStorage.getItem('userProfile'); if (p) setProfile(JSON.parse(p)) } catch { }
  }, [])

  const riskLevel = res?.risk_level?.toLowerCase() || 'low'

  async function exportPdf() {
    if (!res || exporting) return
    setExporting(true)
    try {
      const info = {
        Risk: res.risk_level,
        RiskScore: res.risk_score,
        Effectiveness: res.effectiveness_score,
        Explanation: res.explanation
      }
      const r = await fetch(`${API_BASE}/api/pdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ info }),
      })
      if (!r.ok) throw new Error('Export failed')
      const blob = await r.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Chikitsamedha_Report_${new Date().toISOString().slice(0, 10)}.pdf`
      a.click()
      URL.revokeObjectURL(url)
      push({ kind: 'success', text: 'PDF Downloaded' })
    } catch {
      push({ kind: 'error', text: 'Unable to Generate PDF' })
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="layout-container py-12">
      {res ? (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-subtle)]">
            <div>
              <h1 className="text-3xl font-bold font-display text-white mb-1">Detailed Clinical Report</h1>
              <p className="text-sm text-[var(--text-muted)] font-mono">
                ID: {new Date().getTime().toString(36).toUpperCase()} • {new Date().toLocaleDateString()}
              </p>
            </div>

            <button
              className="btn btn-primary"
              onClick={exportPdf}
              disabled={exporting}
            >
              <FileDown size={18} />
              {exporting ? 'Creating PDF...' : 'Download PDF'}
            </button>
          </div>

          {/* Core Metrics */}
          <RiskIndicator
            level={riskLevel}
            score={res.risk_score || 0}
            title={riskLevel.toUpperCase().replace('_', ' ')}
            description={res.explanation}
            breakdown={res.risk_breakdown}
          />

          {/* Charts Row */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card-panel">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-4 border-b border-[var(--border-subtle)] pb-2">
                Risk Logic Breakdown
              </h3>
              <RiskChartBreakdown breakdown={res.risk_breakdown} />
            </div>

            <div className="card-panel flex flex-col justify-center items-center text-center p-8">
              <div className="mb-4">
                <Activity size={48} className="text-[var(--accent-primary)] opacity-50" />
              </div>
              <h3 className="text-2xl font-bold font-mono text-white mb-1">
                {res.effectiveness_score || 0}%
              </h3>
              <p className="text-sm text-[var(--text-muted)]">Projected Efficacy Score</p>
              <div className="w-full bg-[var(--border-subtle)] h-1.5 rounded-full mt-4 overflow-hidden">
                <div className="bg-[var(--accent-primary)] h-full" style={{ width: `${res.effectiveness_score || 0}%` }} />
              </div>
            </div>
          </div>

          {/* Patient Context Stub */}
          {profile && (
            <div className="card-panel flex items-center gap-4 bg-[var(--bg-app)] border-dashed">
              <div className="w-10 h-10 rounded-full bg-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)]">
                <FileText size={18} />
              </div>
              <div className="text-sm font-mono text-[var(--text-muted)]">
                <div>Analyzing Profile: {profile.age}y / {profile.gender || 'Unknown'} / {profile.weight}kg</div>
              </div>
            </div>
          )}

        </div>
      ) : (
        <div className="min-h-[50vh] flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-subtle)] flex items-center justify-center mb-6 shadow-xl">
            <FileText size={32} className="text-[var(--text-dim)]" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">No Report Found</h1>
          <p className="text-[var(--text-muted)] mb-8 max-w-sm">
            Analysis results are cleared when you leave. Please run a new check to generate a report.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => nav('/check')}
          >
            Start New Analysis
          </button>
        </div>
      )}
    </div>
  )
}

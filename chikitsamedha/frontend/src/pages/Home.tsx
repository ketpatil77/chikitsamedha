import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { t } from '../i18n'
import Seo from '../components/Seo'
import { ArrowRight, ShieldCheck, Activity, BrainCircuit } from 'lucide-react'

/* ── Minimal Fade Animation ── */
const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
}

export default function Home() {
  const { lang } = useLang()
  const nav = useNavigate()

  return (
    <div className="min-h-screen bg-[var(--bg-app)] flex flex-col justify-center">
      <Seo titleKey="home" descKey="meta_home" />

      {/* ── Main Layout Container ── */}
      <div className="layout-container py-20 md:py-32">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* ── Trust Badge ── */}
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-panel)] border border-[var(--border-subtle)] text-xs font-medium text-[var(--accent-primary)] mb-8">
            <ShieldCheck size={14} />
            <span>Clinical Grade • Offline First • Zero Tracking</span>
          </motion.div>

          {/* ── Headline ── */}
          <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6 text-balance leading-[1.1]">
            {lang === 'en'
              ? 'Intelligent Drug Safety.'
              : 'बुद्धिमान औषध सुरक्षा.'}
            <span className="block text-[var(--text-muted)] font-medium text-2xl md:text-4xl mt-3">
              {lang === 'en'
                ? 'Instant, private interaction analysis.'
                : 'त्वरित, खाजगी संवाद विश्लेषण.'}
            </span>
          </motion.h1>

          {/* ── Subtitle ── */}
          <motion.p variants={fadeInUp} className="text-lg text-[var(--text-dim)] max-w-2xl mx-auto mb-10 leading-relaxed">
            {lang === 'en'
              ? 'Check complex multi-drug interactions locally on your device. Powered by verified clinical datasets and explainable AI logic.'
              : 'आपल्या डिव्हाइसवर स्थानिक पातळीवर जटिल औषध परस्परसंवाद तपासा. सत्यापित क्लिनिकल डेटासेट आणि स्पष्टीकरणात्मक AI तर्काद्वारे समर्थित.'}
          </motion.p>

          {/* ── Actions ── */}
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => nav('/check')}
              className="btn btn-primary min-w-[180px] h-12 text-base shadow-lg shadow-emerald-900/20"
            >
              Start Analysis <ArrowRight size={18} />
            </button>

            <button
              onClick={() => nav('/about')}
              className="btn btn-ghost min-w-[160px] h-12 text-base"
            >
              How it works
            </button>
          </motion.div>

          {/* ── Features Grid (Clean) ── */}
          <motion.div variants={fadeInUp} className="grid md:grid-cols-3 gap-6 mt-24 text-left">
            {[
              {
                icon: Activity,
                title: 'Interaction Engine',
                desc: 'Detects pair-wise and cumulative risks across 5+ medications instantly.'
              },
              {
                icon: BrainCircuit,
                title: 'Logic Graph',
                desc: 'Visualizes the decision path. See exactly why a combination is flagged.'
              },
              {
                icon: ShieldCheck,
                title: 'Sovereign Data',
                desc: '100% offline execution. Your health profile never leaves your browser.'
              }
            ].map((f, i) => (
              <div key={i} className="card-panel group hover:bg-[var(--bg-panel-hover)] transition-colors">
                <div className="w-10 h-10 rounded-lg bg-[var(--border-subtle)] flex items-center justify-center text-[var(--text-main)] mb-4">
                  <f.icon size={20} />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">{f.title}</h3>
                <p className="text-sm text-[var(--text-dim)] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* ── Simple Footer ── */}
      <footer className="border-t border-[var(--border-subtle)] py-8 text-center text-xs text-[var(--text-dim)]">
        <p>© 2025 Chikitsāmedhā Research Labs. Not a substitute for professional medical advice.</p>
      </footer>
    </div>
  )
}

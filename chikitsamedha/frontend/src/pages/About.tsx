import { motion } from 'framer-motion'
import { t } from '../i18n'
import { useLang } from '../context/LangContext'
import { Activity, Shield, Sparkles, Database, Lock, Terminal, Cpu } from 'lucide-react'
import Seo from '../components/Seo'

const tech = [
  { icon: Terminal, name: 'React 18', group: 'Front-End' },
  { icon: Cpu, name: 'FAST API', group: 'Compute' },
  { icon: Database, name: 'SQlite3', group: 'Persistence' },
  { icon: Lock, name: 'Web-RSA', group: 'Security' },
]

const values = [
  { icon: Shield, title: 'Absolute Offline', desc: 'No servers. No cloud latency. No external dependencies for core logic.' },
  { icon: Sparkles, title: 'Bilingual Core', desc: 'Native support for Marathi and English, bridging clinical accessibility.' },
  { icon: Activity, title: 'Explainable AI', desc: 'Human-readable clinical logic instead of a "black box" prediction engine.' }
]

export default function About() {
  const { lang } = useLang()

  return (
    <div className="pt-24 pb-20">
      <Seo titleKey="about" descKey="meta_about" />

      {/* ── HEADER ── */}
      <section className="page-container text-center mb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="label-meta mb-4"
        >
          Project Credo
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold font-display max-w-4xl mx-auto mb-8 tracking-tighter"
        >
          Clinical Truth, <br />
          <span className="text-[var(--emerald-primary)]">Sovereign Hardware.</span>
        </motion.h1>
      </section>

      {/* ── VALUES: Staggered & Tilted ── */}
      <section className="page-container grid md:grid-cols-3 gap-8 mb-40">
        {values.map((v, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2 }}
            whileHover={{ scale: 1.02, rotate: 0.5 }}
            className="elevation-2 p-10 rounded-2xl border-[var(--border-subtle)]"
          >
            <div className="w-12 h-12 rounded-xl elevation-1 flex items-center justify-center mb-6 text-[var(--emerald-primary)]">
              <v.icon size={24} />
            </div>
            <h3 className="text-xl font-display font-medium mb-4 text-white">{v.title}</h3>
            <p className="text-sm font-medium text-[#8B949E] leading-relaxed">
              {v.desc}
            </p>
          </motion.div>
        ))}
      </section>

      {/* ── TECH STACK ── */}
      <section className="page-container mb-40">
        <div className="elevation-3 rounded-2xl p-12 border border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-3xl font-display font-bold mb-6">Built for Autonomy</h2>
              <p className="text-[#8B949E] font-medium leading-relaxed mb-8">
                Chikitsāmedhā is an engineering investigation into local-first medical intelligence. We combine structured clinical datasets with modern TypeScript patterns to ensure zero-latency care.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {tech.map((t, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 elevation-2 rounded-lg border border-white/5">
                    <t.icon size={16} className="text-emerald-400" />
                    <span className="text-[11px] font-mono tracking-wider font-bold">{t.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative group">
              <div className="absolute inset-0 bg-emerald-500/20 blur-[100px] rounded-full opacity-50 group-hover:opacity-70 transition-opacity" />
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="elevation-1 p-10 rounded-2xl relative z-10 text-center"
              >
                <div className="text-5xl font-mono font-bold mb-2 text-emerald-400">100%</div>
                <div className="label-meta">Edge Execution</div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DRAMATIC CTA ── */}
      <section className="page-container mb-20 text-center">
        <div className="elevation-1 rounded-3xl p-16 overflow-hidden relative">
          <div className="absolute inset-0 bg-grid-vertical opacity-[0.03]" />
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 relative z-10">
            Ready to Verify?
          </h2>
          <p className="text-[#8B949E] font-medium mb-10 max-w-sm mx-auto relative z-10">
            Start your first clinical check with zero trackers and instant offline results.
          </p>
          <button
            className="btn-signature btn-primary-signature px-12 py-5 rounded-2xl relative z-10"
            onClick={() => window.location.href = '/check'}
          >
            Launch Interaction Engine
          </button>
        </div>
      </section>
    </div>
  )
}

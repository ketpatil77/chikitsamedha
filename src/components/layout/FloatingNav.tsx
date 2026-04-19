'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Gauge, RefreshCcw, ShieldCheck } from 'lucide-react';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useModelMeta } from '@/hooks/useModelMeta';

export function FloatingNav() {
  const { version, accuracy, updatedAt, refresh, loading } = useModelMeta();
  const accuracyPercent = accuracy ? `${(accuracy * 100).toFixed(1)}%` : '—';
  const updatedLabel = updatedAt ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(updatedAt) : 'Offline';

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed left-1/2 top-6 z-30 w-[min(1100px,92vw)] -translate-x-1/2 rounded-full border border-white/10 bg-slate-900/70 px-6 py-3 shadow-card backdrop-blur-3xl"
      aria-label="Primary navigation"
    >
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <Link href="/" className="flex items-center gap-2 font-display text-base font-semibold tracking-tight text-white">
          <ShieldCheck className="h-5 w-5 text-primary" /> AgroVision
        </Link>
        <span className="chip-muted">
          <Gauge className="h-3.5 w-3.5 text-primary" /> v{version}
        </span>
        <span className="chip-muted">
          <span className="font-semibold text-primary">{accuracyPercent}</span> accuracy
        </span>
        <span className="chip-muted">Updated {updatedLabel}</span>
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => refresh()}
            disabled={loading}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:border-primary/60 hover:text-primary disabled:cursor-not-allowed"
            aria-label="Refresh model metadata"
          >
            <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin-slow' : ''}`} />
          </button>
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </motion.nav>
  );
}

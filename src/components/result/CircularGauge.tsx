'use client';

import { motion } from 'framer-motion';

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface CircularGaugeProps {
  value: number;
  label: string;
  accent?: 'emerald' | 'rose';
}

export function CircularGauge({ value, label, accent = 'emerald' }: CircularGaugeProps) {
  const clamped = Math.min(Math.max(value, 0), 1);
  const offset = CIRCUMFERENCE - clamped * CIRCUMFERENCE;
  const color = accent === 'rose' ? '#fb7185' : '#34d399';

  return (
    <div className="metric-card flex flex-col items-center gap-3">
      <div className="relative">
        <svg width="140" height="140" className="-rotate-90">
          <circle cx="70" cy="70" r={RADIUS} stroke="rgba(255,255,255,0.15)" strokeWidth="8" fill="transparent" />
          <motion.circle
            cx="70"
            cy="70"
            r={RADIUS}
            stroke={color}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            strokeLinecap="round"
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <span className="text-3xl font-semibold">{Math.round(clamped * 100)}%</span>
          <p className="text-xs uppercase tracking-wide text-white/70">{label}</p>
        </div>
      </div>
    </div>
  );
}

import { motion } from 'framer-motion'
import { Activity } from 'lucide-react'

export default function Loader({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <motion.div
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="relative"
      >
        {/* Outer ring */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="w-16 h-16 rounded-full border-4 border-emerald-500/20"
        />

        {/* Spinning gradient ring */}
        <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-t-emerald-500 border-r-teal-500 animate-spin" />

        {/* Center icon */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Activity size={24} className="text-emerald-500" strokeWidth={2.5} />
        </motion.div>
      </motion.div>

      {/* Loading text with dots animation */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-sm font-medium text-gray-600 dark:text-gray-400"
      >
        {text}
        <motion.span
          animate={{
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          ...
        </motion.span>
      </motion.p>
    </div>
  )
}

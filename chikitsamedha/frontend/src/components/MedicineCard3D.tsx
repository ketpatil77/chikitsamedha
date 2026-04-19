import { motion } from 'framer-motion'
import { useState } from 'react'
import { Info, X } from 'lucide-react'

interface MedicineCard3DProps {
    medicine: {
        name: string
        purpose: string
        dosage: string
        sideEffects: string[]
        warnings: string[]
        interactions: string[]
    }
    className?: string
}

/**
 * Advanced 3D Card Flip Component
 * 
 * Features:
 * - Perspective-correct 3D rotation
 * - Smooth 600ms flip animation
 * - Front: Basic info with visual appeal
 * - Back: Detailed medical information
 * - Accessible keyboard navigation
 * - Reduced motion support
 */
export default function MedicineCard3D({ medicine, className = '' }: MedicineCard3DProps) {
    const [isFlipped, setIsFlipped] = useState(false)

    const handleFlip = () => {
        setIsFlipped(!isFlipped)
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleFlip()
        }
    }

    return (
        <div className={`card-3d-container ${className}`}>
            <motion.div
                className="card-3d-wrapper"
                initial={false}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{
                    duration: 0.6,
                    ease: [0.4, 0, 0.2, 1]
                }}
                style={{
                    transformStyle: 'preserve-3d',
                    position: 'relative'
                }}
            >
                {/* Front of card */}
                <motion.div
                    className="card-3d-face card-3d-front"
                    style={{
                        backfaceVisibility: 'hidden',
                        position: 'absolute',
                        width: '100%',
                        height: '100%'
                    }}
                >
                    <div className="card p-6 h-full flex flex-col justify-between bg-gradient-to-br from-white to-emerald-50 dark:from-gray-900 dark:to-emerald-950">
                        {/* Medicine name */}
                        <div>
                            <h3 className="text-2xl font-bold mb-2 gradient-text">
                                {medicine.name}
                            </h3>
                            <p className="text-sm opacity-70 mb-4">
                                {medicine.purpose}
                            </p>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm">
                                <span className="font-medium">Dosage:</span>
                                <span>{medicine.dosage}</span>
                            </div>
                        </div>

                        {/* Flip button */}
                        <button
                            onClick={handleFlip}
                            onKeyDown={handleKeyPress}
                            className="btn glass mt-4 w-full justify-center"
                            aria-label="Flip card to see details"
                        >
                            <Info size={18} />
                            <span>View Details</span>
                        </button>
                    </div>
                </motion.div>

                {/* Back of card */}
                <motion.div
                    className="card-3d-face card-3d-back"
                    style={{
                        backfaceVisibility: 'hidden',
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        transform: 'rotateY(180deg)'
                    }}
                >
                    <div className="card p-6 h-full flex flex-col bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 overflow-y-auto">
                        {/* Header with close button */}
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold">{medicine.name} - Details</h3>
                            <button
                                onClick={handleFlip}
                                onKeyDown={handleKeyPress}
                                className="btn glass p-2"
                                aria-label="Flip back to front"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Side effects */}
                        <div className="mb-4">
                            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                                Side Effects
                            </h4>
                            <ul className="text-sm space-y-1 opacity-80">
                                {medicine.sideEffects.map((effect, i) => (
                                    <motion.li
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 + 0.3 }}
                                        className="flex items-start gap-2"
                                    >
                                        <span className="text-amber-500 mt-1">•</span>
                                        <span>{effect}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </div>

                        {/* Warnings */}
                        <div className="mb-4">
                            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                Warnings
                            </h4>
                            <ul className="text-sm space-y-1 opacity-80">
                                {medicine.warnings.map((warning, i) => (
                                    <motion.li
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 + 0.4 }}
                                        className="flex items-start gap-2"
                                    >
                                        <span className="text-red-500 mt-1">⚠</span>
                                        <span>{warning}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </div>

                        {/* Interactions */}
                        <div>
                            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                                Known Interactions
                            </h4>
                            <ul className="text-sm space-y-1 opacity-80">
                                {medicine.interactions.map((interaction, i) => (
                                    <motion.li
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 + 0.5 }}
                                        className="flex items-start gap-2"
                                    >
                                        <span className="text-purple-500 mt-1">↔</span>
                                        <span>{interaction}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    )
}

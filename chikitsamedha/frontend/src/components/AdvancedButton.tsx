import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, MouseEvent as ReactMouseEvent } from 'react'
import { Check, X, Loader2 } from 'lucide-react'
import { useMotion } from '../context/MotionContext'

type ButtonState = 'idle' | 'hover' | 'active' | 'loading' | 'success' | 'error'
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

interface AdvancedButtonProps {
    children: React.ReactNode
    onClick?: () => void | Promise<void>
    variant?: ButtonVariant
    disabled?: boolean
    className?: string
    type?: 'button' | 'submit' | 'reset'
    ariaLabel?: string
    icon?: React.ReactNode
    fullWidth?: boolean
}

interface Ripple {
    id: number
    x: number
    y: number
}

/**
 * Advanced Button Component with State-Aware Animations
 * 
 * Features:
 * - 5 visual states: idle, hover, active, loading, success, error
 * - Ripple effect on click
 * - Loading state with spinner
 * - Success state with checkmark animation
 * - Error state with shake animation
 * - Reduced motion support
 * - Full accessibility
 */
export default function AdvancedButton({
    children,
    onClick,
    variant = 'primary',
    disabled = false,
    className = '',
    type = 'button',
    ariaLabel,
    icon,
    fullWidth = false
}: AdvancedButtonProps) {
    const [state, setState] = useState<ButtonState>('idle')
    const [ripples, setRipples] = useState<Ripple[]>([])
    const rippleIdRef = useRef(0)
    const buttonRef = useRef<HTMLButtonElement>(null)
    const { reduced } = useMotion()

    const variantStyles = {
        primary: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30',
        secondary: 'bg-white/10 dark:bg-white/5 border border-white/20 backdrop-blur-sm',
        ghost: 'bg-transparent hover:bg-white/10',
        danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30'
    }

    const stateColors = {
        success: 'from-emerald-500 to-emerald-600',
        error: 'from-red-500 to-red-600',
        loading: variantStyles[variant]
    }

    const createRipple = (e: ReactMouseEvent<HTMLButtonElement>) => {
        if (!buttonRef.current || reduced) return

        const button = buttonRef.current
        const rect = button.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        const newRipple: Ripple = {
            id: rippleIdRef.current++,
            x,
            y
        }

        setRipples(prev => [...prev, newRipple])

        // Remove ripple after animation
        setTimeout(() => {
            setRipples(prev => prev.filter(r => r.id !== newRipple.id))
        }, 600)
    }

    const handleClick = async (e: ReactMouseEvent<HTMLButtonElement>) => {
        if (disabled || state === 'loading') return

        createRipple(e)
        setState('active')

        if (!onClick) {
            setTimeout(() => setState('idle'), 100)
            return
        }

        try {
            setState('loading')
            await onClick()
            setState('success')
            setTimeout(() => setState('idle'), 2000)
        } catch (error) {
            setState('error')
            setTimeout(() => setState('idle'), 2000)
        }
    }

    const handleMouseEnter = () => {
        if (state === 'idle' && !disabled) {
            setState('hover')
        }
    }

    const handleMouseLeave = () => {
        if (state === 'hover') {
            setState('idle')
        }
    }

    // Animation variants
    const buttonVariants = {
        idle: {
            scale: 1,
            y: 0
        },
        hover: {
            scale: 1.02,
            y: -2,
            transition: { duration: 0.2 }
        },
        active: {
            scale: 0.98,
            y: 0,
            transition: { duration: 0.05 }
        },
        loading: {
            scale: 1,
            y: 0
        },
        success: {
            scale: [1, 1.05, 1],
            transition: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }
        },
        error: {
            x: [0, -4, 4, -4, 4, 0],
            transition: { duration: 0.35 }
        }
    }

    const contentVariants = {
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 10 }
    }

    const currentBgClass = state === 'success'
        ? `bg-gradient-to-r ${stateColors.success}`
        : state === 'error'
            ? `bg-gradient-to-r ${stateColors.error}`
            : variantStyles[variant]

    return (
        <motion.button
            ref={buttonRef}
            type={type}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            disabled={disabled || state === 'loading'}
            aria-label={ariaLabel}
            className={`
        relative overflow-hidden
        px-6 py-3 rounded-xl
        font-medium
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${currentBgClass}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
            variants={reduced ? {} : buttonVariants}
            animate={state}
            whileTap={reduced ? {} : { scale: 0.98 }}
        >
            {/* Ripple effects */}
            <AnimatePresence>
                {ripples.map(ripple => (
                    <motion.span
                        key={ripple.id}
                        className="absolute rounded-full bg-white/30 pointer-events-none"
                        style={{
                            left: ripple.x,
                            top: ripple.y,
                            width: 0,
                            height: 0
                        }}
                        initial={{ scale: 0, opacity: 0.6 }}
                        animate={{ scale: 4, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                    />
                ))}
            </AnimatePresence>

            {/* Button content */}
            <div className="relative flex items-center justify-center gap-2">
                <AnimatePresence mode="wait">
                    {state === 'loading' && (
                        <motion.div
                            key="loading"
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            variants={contentVariants}
                            className="flex items-center gap-2"
                        >
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            >
                                <Loader2 size={18} />
                            </motion.div>
                            <span>Loading...</span>
                        </motion.div>
                    )}

                    {state === 'success' && (
                        <motion.div
                            key="success"
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            variants={contentVariants}
                            className="flex items-center gap-2"
                        >
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{
                                    type: 'spring',
                                    stiffness: 300,
                                    damping: 20
                                }}
                            >
                                <Check size={18} />
                            </motion.div>
                            <span>Success!</span>
                        </motion.div>
                    )}

                    {state === 'error' && (
                        <motion.div
                            key="error"
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            variants={contentVariants}
                            className="flex items-center gap-2"
                        >
                            <motion.div
                                initial={{ scale: 0, rotate: 180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{
                                    type: 'spring',
                                    stiffness: 300,
                                    damping: 20
                                }}
                            >
                                <X size={18} />
                            </motion.div>
                            <span>Error!</span>
                        </motion.div>
                    )}

                    {(state === 'idle' || state === 'hover' || state === 'active') && (
                        <motion.div
                            key="content"
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            variants={contentVariants}
                            className="flex items-center gap-2"
                        >
                            {icon && <span>{icon}</span>}
                            <span>{children}</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Glow effect for hover */}
            {state === 'hover' && !reduced && (
                <motion.div
                    className="absolute inset-0 rounded-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                        background: 'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%)'
                    }}
                />
            )}
        </motion.button>
    )
}

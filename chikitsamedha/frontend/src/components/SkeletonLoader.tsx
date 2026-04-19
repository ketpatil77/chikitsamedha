import { motion } from 'framer-motion'
import { useMotion } from '../context/MotionContext'

interface SkeletonLoaderProps {
    className?: string
    width?: string | number
    height?: string | number
}

export function SkeletonCard({ className, width = '100%', height = 120 }: SkeletonLoaderProps) {
    const { reduced } = useMotion()

    return (
        <div
            className={`skeleton-base ${className || ''}`}
            style={{ width, height, background: 'var(--skeleton-base)' }}
        >
            {!reduced && <div className="skeleton-shimmer" />}
        </div>
    )
}

export function SkeletonText({ className, width = '60%', height = 16 }: SkeletonLoaderProps) {
    const { reduced } = useMotion()
    return (
        <div
            className={`skeleton-base mb-2 rounded-md ${className || ''}`}
            style={{ width, height }}
        >
            {!reduced && <div className="skeleton-shimmer" />}
        </div>
    )
}

export default function SkeletonLoader({ count = 1 }: { count?: number }) {
    return (
        <div className="space-y-4">
            {Array.from({ length: count }).map((_, i) => (
                <SkeletonCard key={i} />
            ))}
        </div>
    )
}

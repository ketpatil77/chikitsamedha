export const riskAnimations = {
    safe: {
        initial: { scale: 0.96, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        transition: { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }
    },
    caution: {
        initial: { y: 10, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        transition: { duration: 0.5, ease: 'easeOut' }
    },
    danger: {
        initial: { x: -10, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        transition: { type: 'spring', stiffness: 300, damping: 20 }
    },
    critical: {
        animate: {
            x: [0, -4, 4, -4, 4, 0],
            transition: { duration: 0.4, ease: 'easeInOut' }
        }
    }
}

export const pageTransition = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
}

export const cardHover = {
    scale: 1.02,
    y: -4,
    transition: { duration: 0.2 }
}

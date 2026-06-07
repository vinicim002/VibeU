import { motion, type HTMLMotionProps } from 'framer-motion'
import type { ReactNode } from 'react'

interface CardProps extends HTMLMotionProps<'div'> {
  children: ReactNode
  glow?: boolean
  hover?: boolean
}

export function Card({ children, glow, hover = true, className = '', ...props }: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
      transition={{ duration: 0.2 }}
      className={`rounded-2xl border border-white/10 bg-bg-gray/80 backdrop-blur-sm ${glow ? 'glow-purple hover:glow-pink' : ''} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}

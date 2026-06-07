import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { motion } from 'framer-motion'

type Variant = 'primary' | 'secondary' | 'ghost' | 'accent' | 'ticket' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  isLoading?: boolean
}

const variants: Record<Variant, string> = {
  primary:
    'bg-primary hover:bg-primary-light text-white glow-purple border border-primary/50',
  secondary:
    'bg-secondary hover:bg-blue-500 text-white border border-secondary/50',
  ghost:
    'bg-transparent hover:bg-white/5 text-white border border-white/20 hover:border-white/40',
  accent:
    'bg-accent hover:bg-pink-500 text-white glow-pink border border-accent/50',
  ticket:
    'bg-accent-yellow hover:brightness-110 text-black font-bold tracking-wider border-0 ticket-notch',
  danger:
    'bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-500/30',
}

const sizes: Record<Size, string> = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading,
      className = '',
      children,
      disabled,
      ...props
    },
    ref,
  ) => (
    <motion.div whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }} whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}>
      <button
        ref={ref}
        className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold uppercase tracking-wide transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    </motion.div>
  ),
)

Button.displayName = 'Button'

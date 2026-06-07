import { forwardRef, type InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        {label ? (
          <label htmlFor={inputId} className="text-xs font-medium uppercase tracking-wider text-text-muted">
            {label}
          </label>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          className={`w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-text-muted/60 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30 ${error ? 'border-red-500/50' : ''} ${className}`}
          {...props}
        />
        {error ? <span className="text-xs text-red-400">{error}</span> : null}
      </div>
    )
  },
)

Input.displayName = 'Input'

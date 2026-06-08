import { forwardRef, type SelectHTMLAttributes } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: Array<{ value: string; label: string }>
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = '', id, ...props }, ref) => {
    const selectId = id ?? label?.toLowerCase().replace(/\s/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        {label ? (
          <label htmlFor={selectId} className="text-xs font-medium uppercase tracking-wider text-text-muted">
            {label}
          </label>
        ) : null}
        <select
          ref={ref}
          id={selectId}
          className={`w-full rounded-xl border border-border/10 bg-bg-gray px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30 ${error ? 'border-red-500/50' : ''} ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-bg-gray">
              {opt.label}
            </option>
          ))}
        </select>
        {error ? <span className="text-xs text-red-400">{error}</span> : null}
      </div>
    )
  },
)

Select.displayName = 'Select'

import clsx from 'clsx'

const priorityConfig = {
  1: { label: 'Urgent', className: 'text-rose-600 bg-rose-50' },
  2: { label: 'High', className: 'text-amber-600 bg-amber-50' },
  3: { label: 'Medium', className: 'text-blue-600 bg-blue-50' },
  4: { label: 'Basic', className: 'text-zinc-500 bg-zinc-100' },
}

export function Badge({ children, className, variant = 'default', ...props }) {
  const base = 'inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium'

  const variants = {
    default: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
    label: 'text-xs font-medium',
  }

  return (
    <span className={clsx(base, variants[variant], className)} {...props}>
      {children}
    </span>
  )
}

export function PriorityBadge({ priority, className }) {
  const config = priorityConfig[priority] || priorityConfig[4]
  return (
    <span
      className={clsx(
        'inline-flex items-center px-1.5 py-0.5 rounded text-xs font-semibold',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  )
}

import { Flag } from 'lucide-react'
import clsx from 'clsx'

export const priorityConfig = {
  1: { color: 'text-rose-500', fill: 'fill-rose-500', label: 'Urgent' },
  2: { color: 'text-amber-500', fill: 'fill-amber-500', label: 'High' },
  3: { color: 'text-blue-500', fill: 'fill-blue-500', label: 'Medium' },
  4: { color: 'text-zinc-400', fill: '', label: 'Basic' },
}

/**
 * Circular checkbox that fills with color when complete.
 */
export function TaskCheckbox({ completed, priority = 4, onChange }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={completed}
      aria-label={completed ? 'Mark incomplete' : 'Mark complete'}
      onClick={onChange}
      className={clsx(
        'flex-shrink-0 w-[18px] h-[18px] mt-0.5 rounded-full border-2 transition-all duration-150',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-zinc-400',
        completed
          ? 'border-zinc-300 dark:border-zinc-600 bg-zinc-200 dark:bg-zinc-700'
          : [
              priority === 1 ? 'border-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30' : '',
              priority === 2 ? 'border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/30' : '',
              priority === 3 ? 'border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30' : '',
              'border-zinc-300 dark:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800',
            ]
      )}
      style={
        !completed
          ? {
              borderColor:
                priority === 1
                  ? '#f43f5e'
                  : priority === 2
                  ? '#f59e0b'
                  : priority === 3
                  ? '#3b82f6'
                  : undefined,
            }
          : {}
      }
    >
      {completed && (
        <svg viewBox="0 0 18 18" className="w-full h-full">
          <circle cx="9" cy="9" r="9" className="fill-zinc-300 dark:fill-zinc-600" />
          <path
            d="M5 9.5l2.5 2.5L13 7"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      )}
    </button>
  )
}

/**
 * Flag icon colored by priority level.
 */
export function PriorityFlag({ priority = 4, className }) {
  const config = priorityConfig[priority] || priorityConfig[4]
  return (
    <Flag
      size={14}
      className={clsx(config.color, priority < 4 && config.fill, className)}
      aria-label={config.label}
    />
  )
}

export default TaskCheckbox

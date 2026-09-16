import { ChevronDown, ChevronRight, Plus } from 'lucide-react'
import { useState } from 'react'
import clsx from 'clsx'
import { TaskItem } from './TaskItem'

export function TaskGroup({
  title,
  tasks = [],
  count,
  defaultOpen = true,
  accentColor,
  hideDateBadge = false,
  onComplete,
  onEdit,
  onDelete,
  onAddTask,
}) {
  const [open, setOpen] = useState(defaultOpen)
  const taskCount = count ?? tasks.length

  return (
    <div className="mb-6">
      {/* Group Header */}
      <div className="flex items-center justify-between py-1 px-1 mb-2">
        <button
          type="button"
          className="flex items-center gap-2 group text-left"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
        >
          <span className="text-zinc-400 dark:text-zinc-500 transition-transform duration-150">
            {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </span>
          <span
            className={clsx(
              'text-xs font-semibold uppercase tracking-wider',
              accentColor || 'text-zinc-500 dark:text-zinc-400'
            )}
          >
            {title}
          </span>
          {taskCount > 0 && (
            <span className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 px-1.5 py-0.2 rounded-full bg-zinc-100 dark:bg-zinc-800">
              {taskCount}
            </span>
          )}
        </button>

        {onAddTask && (
          <button
            type="button"
            onClick={onAddTask}
            className="text-xs text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 flex items-center gap-1 font-medium transition-colors"
          >
            <Plus size={13} />
            Add task
          </button>
        )}
      </div>

      {/* Task List */}
      {open && (
        <div className="space-y-2">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                hideDateBadge={hideDateBadge}
                onComplete={onComplete}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          ) : (
            <div className="py-4 px-3 text-xs text-zinc-400 dark:text-zinc-500 italic text-center rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800">
              No tasks in this section
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default TaskGroup

import { useMemo } from 'react'
import {
  format,
  parseISO,
  isToday,
  isTomorrow,
  addDays,
  startOfDay,
  isAfter,
} from 'date-fns'
import { Plus } from 'lucide-react'
import { TaskGroup } from '../components/task/TaskGroup'
import useUIStore from '../store/uiStore'
import useTaskStore from '../store/taskStore'
import { sortTasks } from '../utils/taskSorter'

function getGroupLabel(dateStr) {
  const date = parseISO(dateStr)
  if (isToday(date)) return 'Today'
  if (isTomorrow(date)) return 'Tomorrow'
  return format(date, 'EEEE, MMMM d')
}

export default function Upcoming() {
  const { openTaskModal } = useUIStore()
  const { tasks } = useTaskStore()

  // Group uncompleted future + today tasks by date
  const groups = useMemo(() => {
    const today = startOfDay(new Date())
    const relevant = tasks.filter(
      (t) => !t.completed && t.dueDate && isAfter(parseISO(t.dueDate), addDays(today, -1))
    )

    const grouped = relevant.reduce((acc, task) => {
      const key = task.dueDate
      if (!acc[key]) acc[key] = []
      acc[key].push(task)
      return acc
    }, {})

    return Object.keys(grouped)
      .sort()
      .map((date) => ({
        date,
        label: getGroupLabel(date),
        tasks: sortTasks(grouped[date]),
      }))
  }, [tasks])

  return (
    <div className="max-w-2xl mx-auto py-2">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800/80 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Upcoming
          </h1>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
            Tasks scheduled for future days
          </p>
        </div>

        <button
          type="button"
          onClick={() => openTaskModal({ dueDate: format(addDays(new Date(), 1), 'yyyy-MM-dd') })}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-semibold hover:opacity-90 transition-opacity shadow-xs"
        >
          <Plus size={14} />
          <span>Schedule Task</span>
        </button>
      </div>

      {groups.length === 0 ? (
        <div className="text-center py-20 px-4 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/20">
          <h3 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200 mb-2">
            No upcoming tasks
          </h3>
          <p className="text-sm text-zinc-400 dark:text-zinc-500 max-w-sm mx-auto mb-6">
            Tasks with future due dates will appear here organized by date.
          </p>
          <button
            type="button"
            onClick={() => openTaskModal()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-medium text-sm hover:opacity-90 transition-opacity"
          >
            <Plus size={16} />
            Create a Task
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {groups.map(({ date, label, tasks: groupTasks }) => (
            <TaskGroup
              key={date}
              title={label}
              tasks={groupTasks}
              hideDateBadge={false}
              onAddTask={() => openTaskModal({ dueDate: date })}
            />
          ))}
        </div>
      )}
    </div>
  )
}

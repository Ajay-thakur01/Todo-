import { useMemo, useEffect } from 'react'
import { format, parseISO, isBefore, startOfDay } from 'date-fns'
import { Plus } from 'lucide-react'
import { TaskGroup } from '../components/task/TaskGroup'
import useUIStore from '../store/uiStore'
import useTaskStore from '../store/taskStore'

export default function Today() {
  const { openTaskModal } = useUIStore()
  const { tasks, cleanOldCompletedTasks } = useTaskStore()

  const todayStr = format(new Date(), 'yyyy-MM-dd')
  const todayFormattedDate = format(new Date(), 'EEEE, MMMM d')

  // Run day rollover cleanup on mount (removes completed tasks from previous days)
  useEffect(() => {
    cleanOldCompletedTasks()
  }, [cleanOldCompletedTasks])

  // Filter tasks for Today (uncompleted)
  const todayTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (t.completed) return false
      return t.dueDate === todayStr || (!t.dueDate && t.createdAt?.startsWith(todayStr))
    })
  }, [tasks, todayStr])

  // Filter Overdue / Due tasks (tasks from past days that remain uncompleted)
  // "also the dues task will appear after the todays tasks"
  const dueTasks = useMemo(() => {
    const todayStart = startOfDay(new Date())
    return tasks.filter((t) => {
      if (t.completed || !t.dueDate) return false
      const due = parseISO(t.dueDate)
      return isBefore(startOfDay(due), todayStart)
    })
  }, [tasks])

  // Completed today tasks (remain during today with strikethrough animation, then disappear tomorrow)
  const completedTodayTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (!t.completed) return false
      // Only show tasks completed today
      if (t.completedAt) {
        return t.completedAt.startsWith(todayStr)
      }
      return t.dueDate === todayStr
    })
  }, [tasks, todayStr])

  const totalRemaining = todayTasks.length + dueTasks.length

  const handleOpenAddToday = () => {
    openTaskModal({ dueDate: todayStr })
  }

  const hasAnyTasks =
    todayTasks.length > 0 || dueTasks.length > 0 || completedTodayTasks.length > 0

  return (
    <div className="max-w-2xl mx-auto py-2">
      {/* Clean Minimal Header: Large text with Date in front of Today */}
      <div className="flex items-baseline justify-between mb-8 pb-4 border-b border-zinc-100 dark:border-zinc-800/80">
        <div>
          <div className="flex items-baseline gap-3 flex-wrap">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Today
            </h1>
            <span className="text-sm font-medium text-zinc-400 dark:text-zinc-500">
              — {todayFormattedDate}
            </span>
          </div>
        </div>

        {totalRemaining > 0 && (
          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            {totalRemaining} remaining
          </div>
        )}
      </div>

      {/* Empty State when no tasks exist */}
      {!hasAnyTasks ? (
        <div className="text-center py-20 px-4 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/30">
          <h3 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200 mb-2">
            No tasks for today
          </h3>
          <p className="text-sm text-zinc-400 dark:text-zinc-500 max-w-sm mx-auto mb-6">
            Your day is clean and clear. Add tasks to plan your day.
          </p>
          <button
            type="button"
            onClick={handleOpenAddToday}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-medium text-sm hover:opacity-90 transition-opacity shadow-sm"
          >
            <Plus size={16} />
            Add Task
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* 1. TODAY'S TASKS - Shown FIRST */}
          <TaskGroup
            title="Today"
            tasks={todayTasks}
            hideDateBadge={true}
            accentColor="text-zinc-900 dark:text-zinc-100"
            onAddTask={handleOpenAddToday}
          />

          {/* 2. DUE / OVERDUE TASKS - Shown AFTER Today's Tasks */}
          {dueTasks.length > 0 && (
            <TaskGroup
              title="Due Tasks"
              tasks={dueTasks}
              hideDateBadge={false}
              accentColor="text-rose-500 dark:text-rose-400"
            />
          )}

          {/* 3. COMPLETED TASKS - Shown at the bottom with mid-cut strikethrough animation */}
          {completedTodayTasks.length > 0 && (
            <TaskGroup
              title="Completed Today"
              tasks={completedTodayTasks}
              hideDateBadge={true}
              defaultOpen={true}
              accentColor="text-zinc-400 dark:text-zinc-500"
            />
          )}

          {/* Add task quick CTA */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleOpenAddToday}
              className="flex items-center gap-2 w-full px-4 py-3 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 text-sm font-medium text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all justify-center group"
            >
              <Plus size={16} className="group-hover:rotate-90 transition-transform duration-200" />
              Add task to today
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

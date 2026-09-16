import { useState, useEffect, useRef } from 'react'
import {
  Clock,
  MoreHorizontal,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronRight,
  Plus,
  Check,
  Calendar,
} from 'lucide-react'
import { format, parseISO } from 'date-fns'
import clsx from 'clsx'
import { TaskCheckbox } from './TaskCheckbox'
import useUIStore from '../../store/uiStore'
import useTaskStore from '../../store/taskStore'
import { formatTime12H, getRemainingTime } from '../../utils/timeUtils'

export function TaskItem({
  task,
  hideDateBadge = false,
  onComplete,
  onEdit,
  onDelete,
}) {
  const { openTaskModal } = useUIStore()
  const { toggleTask, deleteTask, toggleSubtask, addSubtask } = useTaskStore()

  const [menuOpen, setMenuOpen] = useState(false)
  const [subtasksExpanded, setSubtasksExpanded] = useState(false)
  const [newSubtaskInput, setNewSubtaskInput] = useState('')
  const [showAddSubtask, setShowAddSubtask] = useState(false)

  // Live remaining time calculation
  const [remaining, setRemaining] = useState(() =>
    getRemainingTime(task.dueDate, task.dueTime)
  )

  const menuRef = useRef(null)

  // Interval to keep timer alive
  useEffect(() => {
    const updateTimer = () => {
      setRemaining(getRemainingTime(task.dueDate, task.dueTime))
    }
    updateTimer()
    const interval = setInterval(updateTimer, 15000)
    return () => clearInterval(interval)
  }, [task.dueDate, task.dueTime])

  // Click outside to close three-dots menu
  useEffect(() => {
    if (!menuOpen) return
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  const handleCheckbox = (e) => {
    e.stopPropagation()
    if (onComplete) {
      onComplete(task)
    } else {
      toggleTask(task.id)
    }
  }

  const handleEditClick = (e) => {
    e.stopPropagation()
    setMenuOpen(false)
    if (onEdit) {
      onEdit(task)
    } else {
      openTaskModal({}, task)
    }
  }

  const handleDeleteClick = (e) => {
    e.stopPropagation()
    setMenuOpen(false)
    if (onDelete) {
      onDelete(task)
    } else {
      deleteTask(task.id)
    }
  }

  const handleAddInlineSubtask = (e) => {
    e.preventDefault()
    if (!newSubtaskInput.trim()) return
    addSubtask(task.id, newSubtaskInput.trim())
    setNewSubtaskInput('')
    setShowAddSubtask(false)
    setSubtasksExpanded(true)
  }

  const subtasks = task.subtasks || []
  const completedSubtasks = subtasks.filter((s) => s.completed).length
  const hasSubtasks = subtasks.length > 0

  const time12H = formatTime12H(task.dueTime)

  return (
    <div
      className={clsx(
        'group relative flex flex-col p-3.5 rounded-xl border transition-all duration-150',
        'bg-white dark:bg-zinc-900',
        task.completed
          ? 'border-zinc-100 dark:border-zinc-800/60 opacity-60 bg-zinc-50/50 dark:bg-zinc-900/40'
          : 'border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-sm'
      )}
    >
      {/* Main Task Line */}
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <div className="pt-0.5">
          <TaskCheckbox
            completed={task.completed}
            priority={task.priority}
            onChange={handleCheckbox}
            taskId={task.id}
          />
        </div>

        {/* Title & Description */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-2">
            <span
              className={clsx(
                'strikethrough-anim text-[15px] font-medium leading-normal tracking-tight break-words select-text',
                task.completed
                  ? 'completed text-zinc-400 dark:text-zinc-500'
                  : 'text-zinc-900 dark:text-zinc-100'
              )}
            >
              {task.title}
            </span>

            {/* Quick Actions & Three Dots */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity flex-shrink-0">
              <button
                type="button"
                onClick={handleEditClick}
                className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                title="Edit task"
              >
                <Pencil size={13} />
              </button>

              {/* Three Dots Menu Button */}
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setMenuOpen((prev) => !prev)
                  }}
                  className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  title="More actions"
                >
                  <MoreHorizontal size={14} />
                </button>

                {/* Three Dots Dropdown Menu */}
                {menuOpen && (
                  <div
                    className="absolute right-0 top-6 z-30 w-40 py-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg animate-scaleUp"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={handleEditClick}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-left transition-colors"
                    >
                      <Pencil size={12} />
                      Edit task
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false)
                        setShowAddSubtask(true)
                        setSubtasksExpanded(true)
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-left transition-colors"
                    >
                      <Plus size={12} />
                      Add subtask
                    </button>
                    <div className="my-1 border-t border-zinc-100 dark:border-zinc-800" />
                    <button
                      type="button"
                      onClick={handleDeleteClick}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-left transition-colors"
                    >
                      <Trash2 size={12} />
                      Delete task
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          {task.description && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
              {task.description}
            </p>
          )}

          {/* Metadata Row: Date (if not hidden), Time (12h), Remaining Timer, Subtasks badge, Priority */}
          <div className="flex items-center flex-wrap gap-2.5 mt-2">
            {/* Due date if outside Today view */}
            {!hideDateBadge && task.dueDate && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-400 dark:text-zinc-500">
                <Calendar size={11} />
                {format(parseISO(task.dueDate), 'MMM d')}
              </span>
            )}

            {/* 12-Hour Time */}
            {time12H && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                <Clock size={11} className="text-zinc-400" />
                {time12H}
              </span>
            )}

            {/* Remaining Time Countdown Timer with Dynamic Green to Red Animation */}
            {!task.completed && remaining && (
              <span
                className={clsx(
                  'time-left-indicator inline-flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded-full border transition-all duration-1000',
                  remaining.colorClass
                )}
              >
                <span className={clsx('w-1.5 h-1.5 rounded-full', remaining.dotColor)} />
                {remaining.text}
              </span>
            )}

            {/* Subtasks Count / Toggle */}
            {hasSubtasks && (
              <button
                type="button"
                onClick={() => setSubtasksExpanded((prev) => !prev)}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 px-1.5 py-0.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                {subtasksExpanded ? (
                  <ChevronDown size={11} />
                ) : (
                  <ChevronRight size={11} />
                )}
                <span>
                  {completedSubtasks}/{subtasks.length} subtasks
                </span>
              </button>
            )}

            {/* Priority Indicator */}
            {task.priority && (
              <span
                className={clsx(
                  'text-[10px] font-semibold px-2 py-0.5 rounded-md border tracking-tight',
                  task.priority === 1 && 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900',
                  task.priority === 2 && 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900',
                  task.priority === 3 && 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900',
                  task.priority === 4 && 'text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-800'
                )}
              >
                {task.priority === 1 ? 'Urgent' : task.priority === 2 ? 'High' : task.priority === 3 ? 'Medium' : 'Basic'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Subtasks Checklist Section */}
      {(subtasksExpanded || showAddSubtask) && (
        <div className="mt-3 ml-7 pl-3 border-l-2 border-zinc-100 dark:border-zinc-800 space-y-2 animate-fadeIn">
          {subtasks.map((st) => (
            <div key={st.id} className="flex items-center gap-2 group/sub">
              <button
                type="button"
                onClick={() => toggleSubtask(task.id, st.id)}
                className={clsx(
                  'w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-colors',
                  st.completed
                    ? 'bg-zinc-700 dark:bg-zinc-400 border-zinc-700 dark:border-zinc-400 text-white dark:text-zinc-900'
                    : 'border-zinc-300 dark:border-zinc-600 hover:border-zinc-400'
                )}
              >
                {st.completed && <Check size={8} strokeWidth={3} />}
              </button>
              <span
                className={clsx(
                  'text-xs flex-1 transition-colors',
                  st.completed
                    ? 'line-through text-zinc-400 dark:text-zinc-500'
                    : 'text-zinc-700 dark:text-zinc-300'
                )}
              >
                {st.title}
              </span>
            </div>
          ))}

          {/* Inline Add Subtask Field */}
          {showAddSubtask ? (
            <form onSubmit={handleAddInlineSubtask} className="flex gap-2 pt-1">
              <input
                type="text"
                value={newSubtaskInput}
                onChange={(e) => setNewSubtaskInput(e.target.value)}
                placeholder="Subtask name..."
                autoFocus
                className="flex-1 px-2.5 py-1 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-zinc-400"
              />
              <button
                type="submit"
                disabled={!newSubtaskInput.trim()}
                className="px-2.5 py-1 text-xs font-medium rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 disabled:opacity-40"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setShowAddSubtask(false)}
                className="px-2 text-xs text-zinc-400 hover:text-zinc-600"
              >
                Cancel
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setShowAddSubtask(true)}
              className="text-xs text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 flex items-center gap-1 pt-0.5 transition-colors"
            >
              <Plus size={11} />
              Add subtask
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default TaskItem

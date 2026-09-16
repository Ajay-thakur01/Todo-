import { useState, useEffect, useRef } from 'react'
import { X, Plus, Trash2, Calendar, Clock, Flag, Check } from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'sonner'
import clsx from 'clsx'
import useUIStore from '../../store/uiStore'
import useTaskStore from '../../store/taskStore'
import { formatTime12H } from '../../utils/timeUtils'

const PRIORITIES = [
  { level: 1, label: 'Urgent', color: 'text-rose-500 border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40' },
  { level: 2, label: 'High', color: 'text-amber-500 border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/40' },
  { level: 3, label: 'Medium', color: 'text-blue-500 border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40' },
  { level: 4, label: 'Basic', color: 'text-zinc-500 border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40' },
]

function TaskModalForm({ editingTask, defaults, onClose }) {
  const { addTask, updateTask } = useTaskStore()

  // Derive initial values
  const [title, setTitle] = useState(() => editingTask?.title || '')
  const [description, setDescription] = useState(() => editingTask?.description || '')
  const [dueDate, setDueDate] = useState(() => editingTask?.dueDate || defaults?.dueDate || format(new Date(), 'yyyy-MM-dd'))
  const [priority, setPriority] = useState(() => editingTask?.priority || defaults?.priority || 4)
  const [subtasks, setSubtasks] = useState(() => (editingTask?.subtasks ? [...editingTask.subtasks] : []))
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('')

  // 12-hour clock time state
  const [hasTime, setHasTime] = useState(() => Boolean(editingTask?.dueTime))
  const [timeHour, setTimeHour] = useState(() => {
    if (editingTask?.dueTime) {
      const match = formatTime12H(editingTask.dueTime).match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
      if (match) {
        const h = parseInt(match[1], 10)
        return h < 10 ? `0${h}` : `${h}`
      }
    }
    return '09'
  })
  const [timeMinute, setTimeMinute] = useState(() => {
    if (editingTask?.dueTime) {
      const match = formatTime12H(editingTask.dueTime).match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
      if (match) return match[2]
    }
    return '00'
  })
  const [timePeriod, setTimePeriod] = useState(() => {
    if (editingTask?.dueTime) {
      const match = formatTime12H(editingTask.dueTime).match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
      if (match) return match[3].toUpperCase()
    }
    return 'AM'
  })

  const titleInputRef = useRef(null)

  useEffect(() => {
    titleInputRef.current?.focus()
  }, [])

  const handleAddSubtask = (e) => {
    e?.preventDefault()
    if (!newSubtaskTitle.trim()) return
    setSubtasks((prev) => [
      ...prev,
      {
        id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        title: newSubtaskTitle.trim(),
        completed: false,
      },
    ])
    setNewSubtaskTitle('')
  }

  const handleRemoveSubtask = (subId) => {
    setSubtasks((prev) => prev.filter((s) => s.id !== subId))
  }

  const handleToggleSubtask = (subId) => {
    setSubtasks((prev) =>
      prev.map((s) => (s.id === subId ? { ...s, completed: !s.completed } : s))
    )
  }

  const handleSubmit = (e) => {
    e?.preventDefault()
    if (!title.trim()) {
      toast.error('Please enter a task title')
      titleInputRef.current?.focus()
      return
    }

    const dueTime = hasTime ? `${timeHour}:${timeMinute} ${timePeriod}` : null

    const taskPayload = {
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate || format(new Date(), 'yyyy-MM-dd'),
      dueTime,
      priority,
      subtasks,
    }

    if (editingTask) {
      updateTask(editingTask.id, taskPayload)
      toast.success('Task updated')
    } else {
      addTask(taskPayload)
      toast.success('Task added')
    }

    onClose()
  }

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-scaleUp">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-5 pb-3">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          {editingTask ? 'Edit Task' : 'New Task'}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Scrollable Body */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-2 space-y-5">
        {/* Title */}
        <div>
          <input
            ref={titleInputRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What do you need to do?"
            className="w-full text-lg font-medium placeholder:text-zinc-400 dark:placeholder:text-zinc-500 bg-transparent text-zinc-900 dark:text-zinc-100 border-none outline-none focus:ring-0 p-0"
          />
        </div>

        {/* Description */}
        <div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add description or notes (optional)"
            rows={2}
            className="w-full text-sm placeholder:text-zinc-400 dark:placeholder:text-zinc-500 bg-transparent text-zinc-700 dark:text-zinc-300 border-none outline-none focus:ring-0 p-0 resize-none"
          />
        </div>

        <div className="h-px bg-zinc-100 dark:bg-zinc-800" />

        {/* Schedule: Date & 12-Hour Clock Time */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5">
              <Calendar size={13} />
              Schedule
            </label>
            <button
              type="button"
              onClick={() => setHasTime((v) => !v)}
              className="text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 flex items-center gap-1"
            >
              <Clock size={12} />
              {hasTime ? 'Remove time' : '+ Set time (12h)'}
            </button>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="px-3 py-1.5 text-sm rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
            />

            {hasTime && (
              <div className="flex items-center gap-1.5 bg-zinc-50 dark:bg-zinc-800/50 px-2 py-1 rounded-lg border border-zinc-200 dark:border-zinc-800">
                {/* Hour */}
                <select
                  value={timeHour}
                  onChange={(e) => setTimeHour(e.target.value)}
                  className="bg-transparent text-sm font-medium text-zinc-800 dark:text-zinc-200 outline-none cursor-pointer"
                >
                  {['01','02','03','04','05','06','07','08','09','10','11','12'].map((h) => (
                    <option key={h} value={h} className="dark:bg-zinc-900">
                      {h}
                    </option>
                  ))}
                </select>
                <span className="text-zinc-400 font-bold">:</span>
                {/* Minute */}
                <select
                  value={timeMinute}
                  onChange={(e) => setTimeMinute(e.target.value)}
                  className="bg-transparent text-sm font-medium text-zinc-800 dark:text-zinc-200 outline-none cursor-pointer"
                >
                  {['00','05','10','15','20','25','30','35','40','45','50','55'].map((m) => (
                    <option key={m} value={m} className="dark:bg-zinc-900">
                      {m}
                    </option>
                  ))}
                </select>
                {/* Period AM/PM */}
                <button
                  type="button"
                  onClick={() => setTimePeriod((p) => (p === 'AM' ? 'PM' : 'AM'))}
                  className="ml-1 px-2 py-0.5 rounded text-xs font-semibold bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 hover:opacity-80 transition-opacity"
                >
                  {timePeriod}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Priority */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5">
            <Flag size={13} />
            Priority
          </label>
          <div className="flex gap-2">
            {PRIORITIES.map((p) => (
              <button
                key={p.level}
                type="button"
                onClick={() => setPriority(p.level)}
                className={clsx(
                  'flex-1 py-1.5 text-xs font-medium rounded-lg border transition-all text-center',
                  priority === p.level
                    ? `${p.color} ring-2 ring-zinc-400/40 font-semibold`
                    : 'border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-zinc-300 dark:hover:border-zinc-700'
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Subtasks */}
        <div className="space-y-2.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5">
            <Check size={13} />
            Subtasks {subtasks.length > 0 && `(${subtasks.length})`}
          </label>

          {subtasks.length > 0 && (
            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {subtasks.map((st) => (
                <div
                  key={st.id}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800/80 group"
                >
                  <button
                    type="button"
                    onClick={() => handleToggleSubtask(st.id)}
                    className={clsx(
                      'w-4 h-4 rounded-full border flex items-center justify-center transition-colors',
                      st.completed
                        ? 'bg-zinc-700 border-zinc-700 text-white'
                        : 'border-zinc-300 dark:border-zinc-600'
                    )}
                  >
                    {st.completed && <Check size={10} strokeWidth={3} />}
                  </button>
                  <span
                    className={clsx(
                      'flex-1 text-xs text-zinc-700 dark:text-zinc-300 break-words',
                      st.completed && 'line-through text-zinc-400 dark:text-zinc-500'
                    )}
                  >
                    {st.title}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubtask(st.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-rose-500 transition-opacity"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add Subtask input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newSubtaskTitle}
              onChange={(e) => setNewSubtaskTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddSubtask()
                }
              }}
              placeholder="Add a subtask and press Enter"
              className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400"
            />
            <button
              type="button"
              onClick={handleAddSubtask}
              disabled={!newSubtaskTitle.trim()}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-40 transition-colors flex items-center gap-1"
            >
              <Plus size={12} />
              Add
            </button>
          </div>
        </div>
      </form>

      {/* Footer */}
      <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="px-5 py-2 text-sm font-semibold rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white shadow-sm transition-all"
        >
          {editingTask ? 'Save Changes' : 'Create Task'}
        </button>
      </div>
    </div>
  )
}

export function TaskModal() {
  const { taskModalOpen, taskModalDefaults, editingTask, closeTaskModal } = useUIStore()

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && taskModalOpen) {
        closeTaskModal()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [taskModalOpen, closeTaskModal])

  if (!taskModalOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeTaskModal()
      }}
      role="dialog"
      aria-modal="true"
    >
      <TaskModalForm
        key={editingTask ? editingTask.id : 'new-task'}
        editingTask={editingTask}
        defaults={taskModalDefaults}
        onClose={closeTaskModal}
      />
    </div>
  )
}

export default TaskModal

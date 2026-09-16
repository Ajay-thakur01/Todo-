import { useState, useMemo, useRef, useEffect } from 'react'
import {
  format,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  setMonth as setDateMonth,
  setYear as setDateYear,
} from 'date-fns'
import { ChevronLeft, ChevronRight, ChevronDown, Plus } from 'lucide-react'
import clsx from 'clsx'
import useUIStore from '../store/uiStore'
import useTaskStore from '../store/taskStore'
import { TaskItem } from '../components/task/TaskItem'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

function MonthYearPickerModal({ currentMonth, onSelect, onClose }) {
  const [selectedYear, setSelectedYear] = useState(() => currentMonth.getFullYear())
  const activeMonthIdx = currentMonth.getMonth()
  const modalRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  const handleSelectMonth = (monthIndex) => {
    let newDate = setDateYear(currentMonth, selectedYear)
    newDate = setDateMonth(newDate, monthIndex)
    onSelect(newDate)
    onClose()
  }

  return (
    <div
      ref={modalRef}
      className="absolute left-0 top-12 z-40 w-72 p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl animate-scaleUp"
    >
      {/* Year Selector */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-100 dark:border-zinc-800">
        <button
          type="button"
          onClick={() => setSelectedYear((y) => y - 1)}
          className="p-1 rounded-lg text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          <ChevronLeft size={16} />
        </button>

        <span className="text-base font-bold text-zinc-900 dark:text-zinc-100">
          {selectedYear}
        </span>

        <button
          type="button"
          onClick={() => setSelectedYear((y) => y + 1)}
          className="p-1 rounded-lg text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Month 3x4 Grid */}
      <div className="grid grid-cols-3 gap-1.5">
        {MONTHS.map((monthName, idx) => {
          const isCurrent =
            idx === activeMonthIdx && selectedYear === currentMonth.getFullYear()
          return (
            <button
              key={monthName}
              type="button"
              onClick={() => handleSelectMonth(idx)}
              className={clsx(
                'py-2 text-xs font-medium rounded-xl transition-colors',
                isCurrent
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold shadow-xs'
                  : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              )}
            >
              {monthName.slice(0, 3)}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [pickerOpen, setPickerOpen] = useState(false)

  const { openTaskModal } = useUIStore()
  const { tasks } = useTaskStore()

  // Generate calendar grid days for currentMonth
  const days = useMemo(() => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)
    return eachDayOfInterval({ start: startDate, end: endDate })
  }, [currentMonth])

  // Map tasks by dueDate 'yyyy-MM-dd'
  const tasksByDate = useMemo(() => {
    const map = {}
    tasks.forEach((task) => {
      if (task.dueDate) {
        if (!map[task.dueDate]) map[task.dueDate] = []
        map[task.dueDate].push(task)
      }
    })
    return map
  }, [tasks])

  // Tasks for selected day
  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd')
  const selectedDayTasks = tasksByDate[selectedDateStr] || []

  const handlePrevMonth = () => setCurrentMonth((prev) => subMonths(prev, 1))
  const handleNextMonth = () => setCurrentMonth((prev) => addMonths(prev, 1))
  const handleJumpToToday = () => {
    const today = new Date()
    setCurrentMonth(today)
    setSelectedDate(today)
  }

  const handleAddTaskForDate = () => {
    openTaskModal({ dueDate: selectedDateStr })
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-2">
      {/* Page Title */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800/80">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Calendar
          </h1>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
            Plan and view scheduled tasks across days
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleJumpToToday}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors"
          >
            Today
          </button>
        </div>
      </div>

      {/* Calendar Card Container */}
      <div className="card p-6 bg-white dark:bg-zinc-900 shadow-sm">
        {/* Month & Year Navigation with Interactive Picker */}
        <div className="flex items-center justify-between mb-6">
          <div className="relative">
            <button
              type="button"
              onClick={() => setPickerOpen((prev) => !prev)}
              className="flex items-center gap-2 py-1 px-2.5 -ml-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xl font-bold text-zinc-900 dark:text-zinc-100 transition-colors group"
              title="Click to choose month and year"
            >
              <span>{format(currentMonth, 'MMMM yyyy')}</span>
              <ChevronDown
                size={16}
                className={clsx(
                  'text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition-transform duration-200',
                  pickerOpen && 'rotate-180'
                )}
              />
            </button>

            {/* Quick Month & Year Picker Dropdown */}
            {pickerOpen && (
              <MonthYearPickerModal
                currentMonth={currentMonth}
                onSelect={(newDate) => setCurrentMonth(newDate)}
                onClose={() => setPickerOpen(false)}
              />
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Next month"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="py-1 text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day) => {
            const dateStr = format(day, 'yyyy-MM-dd')
            const isSelected = isSameDay(day, selectedDate)
            const isCurrMonth = isSameMonth(day, currentMonth)
            const isCurrentDay = isToday(day)
            const dayTasks = tasksByDate[dateStr] || []
            const uncompletedCount = dayTasks.filter((t) => !t.completed).length

            return (
              <button
                key={day.toISOString()}
                type="button"
                onClick={() => setSelectedDate(day)}
                className={clsx(
                  'h-16 p-1.5 rounded-xl flex flex-col items-center justify-between transition-all duration-100 relative group',
                  isSelected
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold shadow-xs'
                    : isCurrMonth
                    ? 'hover:bg-zinc-100 dark:hover:bg-zinc-800/70 text-zinc-800 dark:text-zinc-200'
                    : 'text-zinc-300 dark:text-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/30'
                )}
              >
                {/* Day number */}
                <span
                  className={clsx(
                    'text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full',
                    isCurrentDay && !isSelected && 'bg-zinc-200 dark:bg-zinc-700 font-bold text-zinc-900 dark:text-zinc-100',
                    isCurrentDay && isSelected && 'ring-2 ring-white dark:ring-zinc-900'
                  )}
                >
                  {format(day, 'd')}
                </span>

                {/* Task Indicators */}
                <div className="flex items-center justify-center gap-1 h-3">
                  {dayTasks.length > 0 && (
                    <div className="flex items-center gap-0.5">
                      {uncompletedCount > 0 ? (
                        <span
                          className={clsx(
                            'w-1.5 h-1.5 rounded-full',
                            isSelected
                              ? 'bg-white dark:bg-zinc-900'
                              : 'bg-zinc-700 dark:bg-zinc-300'
                          )}
                        />
                      ) : (
                        <span
                          className={clsx(
                            'w-1.5 h-1.5 rounded-full',
                            isSelected
                              ? 'bg-zinc-400 dark:bg-zinc-500'
                              : 'bg-zinc-300 dark:bg-zinc-600'
                          )}
                        />
                      )}
                      {dayTasks.length > 1 && (
                        <span
                          className={clsx(
                            'text-[9px] font-bold leading-none',
                            isSelected
                              ? 'text-white/90 dark:text-zinc-900/90'
                              : 'text-zinc-500 dark:text-zinc-400'
                          )}
                        >
                          {dayTasks.length}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Selected Day's Task Section */}
      <div className="space-y-4 pt-2">
        <div className="flex items-baseline justify-between">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Tasks for {format(selectedDate, 'EEEE, MMMM d')}
            </h3>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
              {selectedDayTasks.length} {selectedDayTasks.length === 1 ? 'task' : 'tasks'} scheduled
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddTaskForDate}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-semibold hover:opacity-90 transition-opacity shadow-xs"
          >
            <Plus size={14} />
            <span>Add Task</span>
          </button>
        </div>

        {/* Selected Day's Task List */}
        {selectedDayTasks.length > 0 ? (
          <div className="space-y-2">
            {selectedDayTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                hideDateBadge={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/20">
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-3">
              No tasks scheduled for this day
            </p>
            <button
              type="button"
              onClick={handleAddTaskForDate}
              className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 underline underline-offset-4 hover:opacity-80 transition-opacity"
            >
              + Add a task for {format(selectedDate, 'MMM d')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

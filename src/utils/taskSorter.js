import { parseISO, isToday, isBefore, startOfDay } from 'date-fns'

const PRIORITY_ORDER = { 1: 0, 2: 1, 3: 2, 4: 3 }

/**
 * Sort tasks for the Today and Upcoming views.
 * Order: overdue → by priority → by time → by manual order
 *
 * @param {Array} tasks
 * @returns {Array}
 */
export function sortTasks(tasks) {
  return [...tasks].sort((a, b) => {
    const aOverdue = isOverdue(a)
    const bOverdue = isOverdue(b)

    // Overdue tasks come first
    if (aOverdue && !bOverdue) return -1
    if (!aOverdue && bOverdue) return 1

    // Then by priority
    const priorityDiff =
      (PRIORITY_ORDER[a.priority] ?? 3) - (PRIORITY_ORDER[b.priority] ?? 3)
    if (priorityDiff !== 0) return priorityDiff

    // Then by time
    if (a.dueTime && b.dueTime) {
      return a.dueTime.localeCompare(b.dueTime)
    }
    if (a.dueTime) return -1
    if (b.dueTime) return 1

    // Finally by manual order
    return (a.order ?? 0) - (b.order ?? 0)
  })
}

/**
 * Group tasks by their due date for the Upcoming view.
 *
 * @param {Array} tasks
 * @returns {Record<string, Array>} - { 'yyyy-MM-dd': [task, ...] }
 */
export function groupTasksByDate(tasks) {
  return tasks.reduce((groups, task) => {
    const key = task.dueDate || 'no-date'
    if (!groups[key]) groups[key] = []
    groups[key].push(task)
    return groups
  }, {})
}

/**
 * Check if a task is overdue (due date is before today and not completed).
 *
 * @param {Object} task
 * @returns {boolean}
 */
export function isOverdue(task) {
  if (!task.dueDate || task.completed) return false
  const due = parseISO(task.dueDate)
  return isBefore(startOfDay(due), startOfDay(new Date()))
}

/**
 * Filter tasks due today.
 *
 * @param {Array} tasks
 * @returns {Array}
 */
export function filterTodayTasks(tasks) {
  return tasks.filter((t) => {
    if (!t.dueDate || t.parentTaskId) return false
    return isToday(parseISO(t.dueDate))
  })
}

/**
 * Filter overdue tasks.
 *
 * @param {Array} tasks
 * @returns {Array}
 */
export function filterOverdueTasks(tasks) {
  return tasks.filter((t) => !t.parentTaskId && isOverdue(t))
}

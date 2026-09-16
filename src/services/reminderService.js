import { toast } from 'sonner'
import { getRemainingTime } from '../utils/timeUtils'

/**
 * Request notification permissions from the browser if supported
 */
export async function requestNotificationPermission() {
  if (typeof window === 'undefined' || !('Notification' in window)) return false
  if (Notification.permission === 'granted') return true
  if (Notification.permission === 'denied') return false

  try {
    const perm = await Notification.requestPermission()
    return perm === 'granted'
  } catch {
    return false
  }
}

/**
 * Sends a notification:
 * - If user is NOT using the app (tab hidden or unfocused), send browser Web Notification.
 * - If user IS using the app (tab visible and focused), send gentle in-app toast reminder.
 */
export function sendTaskReminder(task, thresholdLabel, remainingText) {
  const isAppInactive = document.hidden || !document.hasFocus()
  const title = `Task Reminder: ${task.title}`
  const body = `${remainingText} left to complete this task.`

  if (isAppInactive && 'Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: '/favicon.svg',
        tag: `reminder-${task.id}-${thresholdLabel}`,
      })
      return
    } catch {
      // Fallback to in-app toast if Notification construction fails
    }
  }

  // Gentle In-App Reminder
  toast(
    `Gentle Reminder: "${task.title}" is due in ${remainingText}`,
    {
      description: task.description || 'Check your remaining schedule.',
      icon: '⏳',
      duration: 6000,
    }
  )
}

/**
 * Evaluates active tasks and triggers reminders at 1hr (60m), 1/2hr (30m), and 10min
 */
export function checkTaskReminders(tasks, markReminderSent) {
  const now = new Date()
  const todayStr = now.toISOString().slice(0, 10)

  tasks.forEach((task) => {
    // Only remind for uncompleted tasks due today with a dueTime
    if (task.completed || !task.dueDate || !task.dueTime) return
    if (task.dueDate !== todayStr) return

    const remaining = getRemainingTime(task.dueDate, task.dueTime)
    if (!remaining || remaining.diffMinutes === null || remaining.isOverdue) return

    const diff = remaining.diffMinutes
    const sent = task.remindersSent || []

    // Fire once when the task reaches each reminder threshold.
    if (diff <= 60 && !sent.includes('1h')) {
      markReminderSent(task.id, '1h')
      sendTaskReminder(task, '1h', `${diff} minutes (1 hour)`)
      return
    }

    if (diff <= 30 && !sent.includes('30m')) {
      markReminderSent(task.id, '30m')
      sendTaskReminder(task, '30m', `${diff} minutes (half hour)`)
      return
    }

    // 10 Minutes Reminder (between 0 and 10 minutes)
    if (diff <= 10 && diff >= 0 && !sent.includes('10m')) {
      markReminderSent(task.id, '10m')
      sendTaskReminder(task, '10m', `${diff} minutes`)
      return
    }
  })
}

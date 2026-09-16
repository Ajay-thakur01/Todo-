import { useEffect } from 'react'
import useTaskStore from '../store/taskStore'
import { checkTaskReminders } from '../services/reminderService'

/**
 * Periodically checks tasks to send reminders at 1h, 30m, and 10m.
 */
export function useReminderWorker() {
  const { tasks, markReminderSent } = useTaskStore()

  useEffect(() => {
    // Immediate check
    checkTaskReminders(tasks, markReminderSent)

    // Check often enough to catch a threshold without making the UI busy.
    const interval = setInterval(() => {
      checkTaskReminders(tasks, markReminderSent)
    }, 30000)

    return () => clearInterval(interval)
  }, [tasks, markReminderSent])
}

export default useReminderWorker

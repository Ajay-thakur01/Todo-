import { parseISO, isToday, isPast, differenceInMinutes, differenceInDays } from 'date-fns'

/**
 * Normalizes any time string to 12-hour format (e.g., "02:30 PM")
 */
export function formatTime12H(timeStr) {
  if (!timeStr) return null
  const trimmed = timeStr.trim()
  
  // Already has AM/PM
  if (/am|pm/i.test(trimmed)) {
    return trimmed.toUpperCase()
  }

  // Parse HH:mm
  const [hoursStr, minutesStr] = trimmed.split(':')
  if (hoursStr === undefined || minutesStr === undefined) return trimmed
  
  let hours = parseInt(hoursStr, 10)
  const minutes = parseInt(minutesStr, 10)
  if (isNaN(hours) || isNaN(minutes)) return trimmed

  const period = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12
  if (hours === 0) hours = 12
  const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`

  return `${hours}:${formattedMinutes} ${period}`
}

/**
 * Converts a 12-hour time string ("02:30 PM") into a 24-hour time string ("14:30") for time inputs
 */
export function to24Hour(time12) {
  if (!time12) return ''
  const trimmed = time12.trim()
  const match = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i)
  if (!match) return time12

  let hours = parseInt(match[1], 10)
  const minutes = match[2]
  const period = (match[3] || '').toUpperCase()

  if (period === 'PM' && hours < 12) hours += 12
  if (period === 'AM' && hours === 12) hours = 0

  return `${hours < 10 ? '0' + hours : hours}:${minutes}`
}

/**
 * Calculates remaining time until task is due.
 * Returns dynamic color scale from calm Green -> Amber -> Orange -> Urgent Red (with pulse animation).
 * 
 * @returns {{
 *   text: string,
 *   isOverdue: boolean,
 *   diffMinutes: number | null,
 *   colorClass: string,
 *   dotColor: string
 * } | null}
 */
export function getRemainingTime(dueDateStr, dueTimeStr) {
  if (!dueDateStr) return null

  const now = new Date()

  // If time is specified
  if (dueTimeStr) {
    const time12 = formatTime12H(dueTimeStr)
    const time24 = to24Hour(time12)
    const [h, m] = time24.split(':').map(Number)

    const targetDate = parseISO(dueDateStr)
    targetDate.setHours(h, m, 0, 0)

    const diffMinutes = differenceInMinutes(targetDate, now)

    // Overdue
    if (diffMinutes < 0) {
      const overdueMins = Math.abs(diffMinutes)
      const text =
        overdueMins < 60
          ? `overdue ${overdueMins}m`
          : `overdue ${Math.floor(overdueMins / 60)}h`

      return {
        text,
        isOverdue: true,
        diffMinutes,
        colorClass:
          'border-rose-300 dark:border-rose-800 bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-200 font-semibold',
        dotColor: 'bg-rose-600',
      }
    }

    // Due Right Now
    if (diffMinutes === 0) {
      return {
        text: 'due now',
        isOverdue: false,
        diffMinutes: 0,
        colorClass:
          'border-rose-400 dark:border-rose-700 bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-200 animate-pulseUrgent font-semibold',
        dotColor: 'bg-rose-600',
      }
    }

    // Less than 30 minutes (Urgent Red with pulse animation)
    if (diffMinutes < 30) {
      return {
        text: `in ${diffMinutes}m`,
        isOverdue: false,
        diffMinutes,
        colorClass:
          'border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 animate-pulseUrgent font-semibold',
        dotColor: 'bg-rose-500',
      }
    }

    // 30 to 59 minutes (Orange)
    if (diffMinutes < 60) {
      return {
        text: `in ${diffMinutes}m`,
        isOverdue: false,
        diffMinutes,
        colorClass:
          'border-orange-200 dark:border-orange-900 bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 font-medium',
        dotColor: 'bg-orange-500',
      }
    }

    // 1 hour to 2 hours (Amber / Yellow)
    const diffHours = Math.floor(diffMinutes / 60)
    const remainingMins = diffMinutes % 60
    if (diffMinutes < 120) {
      const text = remainingMins > 0 ? `in 1h ${remainingMins}m` : 'in 1h'
      return {
        text,
        isOverdue: false,
        diffMinutes,
        colorClass:
          'border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-medium',
        dotColor: 'bg-amber-500',
      }
    }

    // 2 hours to 24 hours (Green / Emerald - Calm)
    if (diffHours < 24) {
      const text = remainingMins > 0 ? `in ${diffHours}h ${remainingMins}m` : `in ${diffHours}h`
      return {
        text,
        isOverdue: false,
        diffMinutes,
        colorClass:
          'border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-medium',
        dotColor: 'bg-emerald-500',
      }
    }

    // Days in future (Green)
    const diffDays = differenceInDays(targetDate, now)
    return {
      text: `in ${diffDays + 1}d`,
      isOverdue: false,
      diffMinutes,
      colorClass:
        'border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-medium',
      dotColor: 'bg-emerald-500',
    }
  }

  // Only date provided
  const targetDate = parseISO(dueDateStr)
  targetDate.setHours(23, 59, 59, 999)

  if (isPast(targetDate) && !isToday(targetDate)) {
    return {
      text: 'overdue',
      isOverdue: true,
      diffMinutes: null,
      colorClass:
        'border-rose-300 dark:border-rose-800 bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-200 font-semibold',
      dotColor: 'bg-rose-600',
    }
  }

  if (isToday(targetDate)) {
    return {
      text: 'due today',
      isOverdue: false,
      diffMinutes: null,
      colorClass:
        'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 text-zinc-600 dark:text-zinc-400 font-medium',
      dotColor: 'bg-zinc-400',
    }
  }

  const diffDays = differenceInDays(targetDate, now)
  return {
    text: `in ${diffDays + 1}d`,
    isOverdue: false,
    diffMinutes: null,
    colorClass:
      'border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-medium',
    dotColor: 'bg-emerald-500',
  }
}

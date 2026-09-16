import { parseDate, parse } from 'chrono-node'
import { format } from 'date-fns'

/**
 * Parse natural language task input into structured task data.
 *
 * Examples:
 *   "Buy groceries tomorrow at 6pm"
 *   "Fix auth bug Friday p1"
 *   "Team meeting next Monday at 10am"
 *
 * @param {string} input - Raw user input
 * @returns {{ title: string, dueDate: string|null, dueTime: string|null }}
 */
export function parseTaskInput(input) {
  if (!input || typeof input !== 'string') {
    return { title: input, dueDate: null, dueTime: null }
  }

  const now = new Date()
  const results = parse(input, now, { forwardDate: true })

  if (!results.length) {
    return { title: input.trim(), dueDate: null, dueTime: null }
  }

  const result = results[0]
  const date = result.start.date()

  // Remove the matched date text from the title
  const title = input
    .replace(result.text, '')
    .replace(/\s+/g, ' ')
    .trim()

  const dueDate = format(date, 'yyyy-MM-dd')

  // Only include time if explicitly stated
  const hasTime =
    result.start.isCertain('hour') || result.start.isCertain('minute')
  const dueTime = hasTime ? format(date, 'HH:mm') : null

  return {
    title: title || input.trim(),
    dueDate,
    dueTime,
  }
}

/**
 * Parse priority from natural language.
 * Supports: urgent, high, medium, basic and legacy p1-p4 labels.
 *
 * @param {string} input
 * @returns {{ priority: number|null, cleanedInput: string }}
 */
export function parsePriorityFromInput(input) {
  const priorityMap = {
    p1: 1, urgent: 1,
    p2: 2, high: 2,
    p3: 3, medium: 3,
    p4: 4, low: 4, basic: 4,
  }

  const pattern = /\b(p[1-4]|urgent|high|medium|low|basic)\b/gi
  const match = input.match(pattern)

  if (!match) return { priority: null, cleanedInput: input }

  const keyword = match[0].toLowerCase()
  const priority = priorityMap[keyword] || null
  const cleanedInput = input.replace(pattern, '').replace(/\s+/g, ' ').trim()

  return { priority, cleanedInput }
}

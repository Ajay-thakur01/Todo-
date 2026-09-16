import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { format, parseISO, isBefore, startOfDay } from 'date-fns'

const getTodayStr = () => format(new Date(), 'yyyy-MM-dd')

export const useTaskStore = create(
  persist(
    (set) => ({
      tasks: [], // Empty initially - user adds tasks
      
      // Add a new task
      addTask: (taskData) => {
        const todayStr = getTodayStr()
        const newTask = {
          id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          title: taskData.title.trim(),
          description: taskData.description?.trim() || '',
          dueDate: taskData.dueDate || todayStr,
          dueTime: taskData.dueTime || null, // e.g. '02:30 PM'
          priority: taskData.priority || 4, // 1 to 4 (1: Urgent, 2: High, 3: Medium, 4: Basic)
          completed: false,
          completedAt: null,
          subtasks: taskData.subtasks || [],
          remindersSent: [], // ['1h', '30m', '10m']
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        set((state) => ({
          tasks: [newTask, ...state.tasks],
        }))
        return newTask
      },

      // Update an existing task
      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id
              ? {
                  ...t,
                  ...updates,
                  // If dueTime changed, reset remindersSent
                  remindersSent:
                    updates.dueTime !== undefined && updates.dueTime !== t.dueTime
                      ? []
                      : t.remindersSent || [],
                  updatedAt: new Date().toISOString(),
                }
              : t
          ),
        }))
      },

      // Delete a task
      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        }))
      },

      // Toggle task completion
      toggleTask: (id) => {
        set((state) => ({
          tasks: state.tasks.map((t) => {
            if (t.id !== id) return t
            const nextCompleted = !t.completed
            return {
              ...t,
              completed: nextCompleted,
              completedAt: nextCompleted ? new Date().toISOString() : null,
              updatedAt: new Date().toISOString(),
            }
          }),
        }))
      },

      // Mark reminder sent for a specific threshold ('1h', '30m', '10m')
      markReminderSent: (taskId, threshold) => {
        set((state) => ({
          tasks: state.tasks.map((t) => {
            if (t.id !== taskId) return t
            const existing = t.remindersSent || []
            if (existing.includes(threshold)) return t
            return {
              ...t,
              remindersSent: [...existing, threshold],
            }
          }),
        }))
      },

      // Subtask operations
      toggleSubtask: (taskId, subtaskId) => {
        set((state) => ({
          tasks: state.tasks.map((t) => {
            if (t.id !== taskId) return t
            const updatedSubtasks = (t.subtasks || []).map((st) =>
              st.id === subtaskId ? { ...st, completed: !st.completed } : st
            )
            return { ...t, subtasks: updatedSubtasks, updatedAt: new Date().toISOString() }
          }),
        }))
      },

      addSubtask: (taskId, title) => {
        if (!title?.trim()) return
        const newSubtask = {
          id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          title: title.trim(),
          completed: false,
        }
        set((state) => ({
          tasks: state.tasks.map((t) => {
            if (t.id !== taskId) return t
            return {
              ...t,
              subtasks: [...(t.subtasks || []), newSubtask],
              updatedAt: new Date().toISOString(),
            }
          }),
        }))
      },

      deleteSubtask: (taskId, subtaskId) => {
        set((state) => ({
          tasks: state.tasks.map((t) => {
            if (t.id !== taskId) return t
            return {
              ...t,
              subtasks: (t.subtasks || []).filter((st) => st.id !== subtaskId),
              updatedAt: new Date().toISOString(),
            }
          }),
        }))
      },

      // Day Rollover & single-day lifecycle cleanup
      cleanOldCompletedTasks: () => {
        const todayStart = startOfDay(new Date())
        set((state) => ({
          tasks: state.tasks.filter((t) => {
            if (!t.completed) return true
            if (t.completedAt) {
              const compDate = parseISO(t.completedAt)
              return !isBefore(startOfDay(compDate), todayStart)
            }
            return false
          }),
        }))
      },
    }),
    {
      name: 'taskpilot-storage',
    }
  )
)

export default useTaskStore

import api from './api'
import { mockTasks } from '../data/mockTasks'

// Simulate async delay for mock data
const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms))

// Flag: when true, use mock data instead of real API
const USE_MOCK = true

const taskService = {
  async getTasks(params = {}) {
    if (USE_MOCK) {
      await delay()
      return { data: mockTasks }
    }
    return api.get('/tasks', { params })
  },

  async getTask(id) {
    if (USE_MOCK) {
      await delay()
      const task = mockTasks.find((t) => t.id === id)
      return { data: task }
    }
    return api.get(`/tasks/${id}`)
  },

  async createTask(taskData) {
    if (USE_MOCK) {
      await delay()
      const newTask = {
        id: `task-${Date.now()}`,
        completed: false,
        attachments: [],
        comments: [],
        order: 9999,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...taskData,
      }
      return { data: newTask }
    }
    return api.post('/tasks', taskData)
  },

  async updateTask(id, updates) {
    if (USE_MOCK) {
      await delay()
      return { data: { id, ...updates, updatedAt: new Date().toISOString() } }
    }
    return api.patch(`/tasks/${id}`, updates)
  },

  async deleteTask(id) {
    if (USE_MOCK) {
      await delay()
      return { data: { id } }
    }
    return api.delete(`/tasks/${id}`)
  },

  async completeTask(id) {
    return taskService.updateTask(id, { completed: true })
  },

  async uncompleteTask(id) {
    return taskService.updateTask(id, { completed: false })
  },
}

export default taskService

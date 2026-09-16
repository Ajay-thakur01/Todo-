import api from './api'
import { mockProjects, mockSections } from '../data/mockProjects'

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms))
const USE_MOCK = true

const projectService = {
  async getProjects() {
    if (USE_MOCK) {
      await delay()
      return { data: mockProjects }
    }
    return api.get('/projects')
  },

  async getProject(id) {
    if (USE_MOCK) {
      await delay()
      return { data: mockProjects.find((p) => p.id === id) }
    }
    return api.get(`/projects/${id}`)
  },

  async createProject(data) {
    if (USE_MOCK) {
      await delay()
      return {
        data: {
          id: `project-${Date.now()}`,
          archived: false,
          order: 9999,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ...data,
        },
      }
    }
    return api.post('/projects', data)
  },

  async updateProject(id, updates) {
    if (USE_MOCK) {
      await delay()
      return { data: { id, ...updates } }
    }
    return api.patch(`/projects/${id}`, updates)
  },

  async deleteProject(id) {
    if (USE_MOCK) {
      await delay()
      return { data: { id } }
    }
    return api.delete(`/projects/${id}`)
  },

  // Sections
  async getSections(projectId) {
    if (USE_MOCK) {
      await delay()
      return { data: mockSections.filter((s) => s.projectId === projectId) }
    }
    return api.get(`/projects/${projectId}/sections`)
  },
}

export default projectService

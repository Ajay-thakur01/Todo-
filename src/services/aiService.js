// AI Service abstraction — never put API keys here.
// The backend will proxy all AI requests.

import api from './api'

const aiService = {
  /**
   * Send a message to the AI assistant.
   * @param {string} message - User's message
   * @param {Object} context - Optional task context
   */
  async chat(message, context = {}) {
    // Backend will forward to OpenAI / Gemini / Anthropic
    return api.post('/ai/chat', { message, context })
  },

  /**
   * Ask AI to break a task into subtasks.
   * @param {string} taskTitle
   */
  async breakdownTask(taskTitle) {
    return api.post('/ai/breakdown', { taskTitle })
  },

  /**
   * Ask AI to improve a task description.
   * @param {string} taskTitle
   * @param {string} description
   */
  async improveTask(taskTitle, description) {
    return api.post('/ai/improve', { taskTitle, description })
  },

  /**
   * Ask AI to summarize today's tasks.
   * @param {Array} tasks
   */
  async summarizeTasks(tasks) {
    return api.post('/ai/summarize', { tasks })
  },
}

export default aiService

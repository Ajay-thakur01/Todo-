import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useUIStore = create(
  persist(
    (set) => ({
      // Sidebar
      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

      // Theme
      theme: 'light', // 'light' | 'dark' | 'system'
      setTheme: (theme) => {
        set({ theme })
        applyTheme(theme)
      },

      // Task modal (for both add & edit)
      taskModalOpen: false,
      taskModalDefaults: {},
      editingTask: null,
      openTaskModal: (defaults = {}, editingTask = null) =>
        set({ taskModalOpen: true, taskModalDefaults: defaults, editingTask }),
      closeTaskModal: () =>
        set({ taskModalOpen: false, taskModalDefaults: {}, editingTask: null }),

      // Task detail panel
      selectedTaskId: null,
      setSelectedTaskId: (id) => set({ selectedTaskId: id }),
      clearSelectedTask: () => set({ selectedTaskId: null }),
    }),
    {
      name: 'flowtask-ui',
      partialState: (state) => ({ theme: state.theme, sidebarOpen: state.sidebarOpen }),
    }
  )
)

function applyTheme(theme) {
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
  } else if (theme === 'light') {
    root.classList.remove('dark')
  } else {
    // system
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    root.classList.toggle('dark', prefersDark)
  }
}

export function initTheme(theme) {
  applyTheme(theme)
}

export default useUIStore

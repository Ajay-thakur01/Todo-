import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      // Credentials Login
      login: async (email, password) => {
        if (!email || !password) throw new Error('Please provide email and password')
        const name = email.split('@')[0]
        const initials = name.slice(0, 2).toUpperCase()
        const user = {
          id: `user-${Date.now()}`,
          name: name.charAt(0).toUpperCase() + name.slice(1),
          email,
          avatarInitials: initials,
        }
        set({ user, token: `token-${Date.now()}`, isAuthenticated: true })
        return user
      },

      // 1-Click Demo Login
      loginAsDemo: () => {
        const user = {
          id: 'user-demo',
          name: 'Alex Pilot',
          email: 'alex@taskpilot.io',
          avatarInitials: 'AP',
        }
        set({ user, token: 'demo-token-12345', isAuthenticated: true })
        return user
      },

      // Signup
      signup: async (name, email, password) => {
        if (!name || !email || !password) throw new Error('Please fill all fields')
        const initials = name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2)
        const user = {
          id: `user-${Date.now()}`,
          name,
          email,
          avatarInitials: initials || 'TP',
        }
        set({ user, token: `token-${Date.now()}`, isAuthenticated: true })
        return user
      },

      // Logout
      logout: () => set({ user: null, token: null, isAuthenticated: false }),

      // Update user profile
      updateUser: (updates) =>
        set((s) => ({ user: s.user ? { ...s.user, ...updates } : null })),
    }),
    {
      name: 'taskpilot-auth',
    }
  )
)

export default useAuthStore

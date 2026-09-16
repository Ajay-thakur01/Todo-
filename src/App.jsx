import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect } from 'react'
import { AppLayout } from './layouts/AppLayout'
import Today from './pages/Today'
import Inbox from './pages/Inbox'
import Upcoming from './pages/Upcoming'
import Calendar from './pages/Calendar'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import Filters from './pages/Filters'
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Terms from './pages/Terms'
import useAuthStore from './store/authStore'
import useUIStore, { initTheme } from './store/uiStore'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
})

function ThemeInitializer() {
  const theme = useUIStore((s) => s.theme)
  useEffect(() => {
    initTheme(theme)
  }, [theme])
  return null
}

function ProtectedRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  return isAuthenticated ? <AppLayout /> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeInitializer />
        <Routes>
          {/* Redirect root to today */}
          <Route path="/" element={<Navigate to="/today" replace />} />

          {/* App shell */}
          <Route element={<ProtectedRoute />}>
            <Route path="/inbox" element={<Inbox />} />
            <Route path="/today" element={<Today />} />
            <Route path="/upcoming" element={<Upcoming />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:projectId" element={<ProjectDetail />} />
            <Route path="/filters" element={<Filters />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/terms" element={<Terms />} />

          {/* 404 fallback */}
          <Route path="*" element={<Navigate to="/today" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

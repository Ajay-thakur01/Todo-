import { Outlet } from 'react-router-dom'
import { Toaster } from 'sonner'
import { Sidebar } from '../components/layout/Sidebar'
import { Header } from '../components/layout/Header'
import { TaskModal } from '../components/task/TaskModal'
import { useReminderWorker } from '../hooks/useReminderWorker'

export function AppLayout() {
  // Run global background reminder engine
  useReminderWorker()

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 overflow-hidden font-sans">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-5 py-8 md:px-10">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Global Task Creation & Edit Modal */}
      <TaskModal />

      {/* Toast Notifications */}
      <Toaster
        position="bottom-right"
        closeButton
        toastOptions={{
          style: {
            fontFamily: 'Inter, system-ui, sans-serif',
            borderRadius: '1rem',
          },
        }}
      />
    </div>
  )
}

export default AppLayout

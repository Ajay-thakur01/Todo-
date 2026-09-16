import { NavLink } from 'react-router-dom'
import {
  Sun,
  CalendarDays,
  CalendarRange,
  Plus,
  X,
  CheckCircle2,
} from 'lucide-react'
import { format } from 'date-fns'
import clsx from 'clsx'
import useUIStore from '../../store/uiStore'
import useTaskStore from '../../store/taskStore'

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen, openTaskModal } = useUIStore()
  const { tasks } = useTaskStore()

  const todayStr = format(new Date(), 'yyyy-MM-dd')
  const todayRemainingCount = tasks.filter(
    (t) => !t.completed && (t.dueDate === todayStr || (!t.dueDate && t.createdAt?.startsWith(todayStr)))
  ).length

  const upcomingCount = tasks.filter(
    (t) => !t.completed && t.dueDate && t.dueDate > todayStr
  ).length

  const handleAddTask = () => {
    openTaskModal()
    if (window.innerWidth < 768) setSidebarOpen(false)
  }

  const handleNavClick = () => {
    if (window.innerWidth < 768) setSidebarOpen(false)
  }

  const NAV_ITEMS = [
    { to: '/today', icon: Sun, label: 'Today', badge: todayRemainingCount },
    { to: '/upcoming', icon: CalendarDays, label: 'Upcoming', badge: upcomingCount },
    { to: '/calendar', icon: CalendarRange, label: 'Calendar' },
  ]

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-xs md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={clsx(
          'fixed top-0 left-0 z-40 h-full flex flex-col',
          'w-[240px] bg-zinc-50 dark:bg-zinc-950',
          'border-r border-zinc-200/80 dark:border-zinc-800/80',
          'transition-transform duration-200 ease-in-out',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          'md:static md:translate-x-0 md:flex',
          !sidebarOpen && 'md:hidden'
        )}
        aria-label="Sidebar navigation"
      >
        {/* Top Logo & Title */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200/60 dark:border-zinc-800/60">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-zinc-900 dark:bg-zinc-100 rounded-lg flex items-center justify-center text-white dark:text-zinc-900 shadow-sm">
              <CheckCircle2 size={16} />
            </div>
            <span className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              TaskPilot
            </span>
          </div>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            aria-label="Close sidebar"
          >
            <X size={16} />
          </button>
        </div>

        {/* Add Task Button */}
        <div className="px-3.5 py-3">
          <button
            type="button"
            onClick={handleAddTask}
            className="flex items-center justify-center gap-2 w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold
                       bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900
                       hover:bg-zinc-800 dark:hover:bg-white shadow-xs
                       transition-all duration-150 group"
            aria-label="Add new task"
          >
            <Plus size={16} className="group-hover:rotate-90 transition-transform duration-200" />
            <span>Add Task</span>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-2.5 space-y-1 py-1">
          {NAV_ITEMS.map(({ to, icon: Icon, label, badge }) => (
            <NavLink
              key={to}
              to={to}
              onClick={handleNavClick}
              className={({ isActive }) =>
                clsx('nav-item', isActive && 'active')
              }
            >
              <Icon size={16} className="flex-shrink-0" />
              <span className="flex-1 text-sm">{label}</span>
              {badge !== undefined && badge > 0 && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-200/80 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                  {badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}

export default Sidebar

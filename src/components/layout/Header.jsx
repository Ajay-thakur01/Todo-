import { useState, useRef, useEffect } from 'react'
import { Menu, Plus, Sun, Moon, Monitor } from 'lucide-react'
import clsx from 'clsx'
import useUIStore from '../../store/uiStore'
import useAuthStore from '../../store/authStore'

function ThemeToggle() {
  const { theme, setTheme } = useUIStore()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const themes = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ]

  const CurrentIcon = theme === 'dark' ? Moon : theme === 'system' ? Monitor : Sun

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        aria-label="Toggle theme"
      >
        <CurrentIcon size={16} />
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-50 w-36 rounded-xl shadow-xl border bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 py-1 animate-scaleUp">
          {themes.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setTheme(value)
                setOpen(false)
              }}
              className={clsx(
                'flex items-center gap-2.5 w-full px-3 py-2 text-xs font-medium transition-colors',
                'hover:bg-zinc-50 dark:hover:bg-zinc-800',
                theme === value
                  ? 'text-zinc-900 dark:text-zinc-100 font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400'
              )}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function Header() {
  const { toggleSidebar, openTaskModal } = useUIStore()
  const { user, logout } = useAuthStore()

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between px-6 h-14 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200/70 dark:border-zinc-800/70">
      {/* Left: Sidebar toggle */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={toggleSidebar}
          className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu size={18} />
        </button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Add Task Primary Action */}
        <button
          type="button"
          onClick={() => openTaskModal()}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white text-xs font-semibold shadow-sm transition-all"
        >
          <Plus size={14} />
          <span>Add Task</span>
        </button>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Clean minimal avatar */}
        <button
          type="button"
          onClick={logout}
          className="w-7 h-7 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center text-xs font-semibold select-none"
          title="Sign out"
          aria-label="Sign out"
        >
          {user?.avatarInitials || 'U'}
        </button>
      </div>
    </header>
  )
}

export default Header

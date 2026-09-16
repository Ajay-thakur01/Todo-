import { Settings as SettingsIcon, Moon, Sun, Monitor, Bell } from 'lucide-react'
import { useState } from 'react'
import { requestNotificationPermission } from '../services/reminderService'
import useUIStore from '../store/uiStore'
import clsx from 'clsx'

function SettingRow({ label, description, children }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-800 last:border-0">
      <div>
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{label}</p>
        {description && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{description}</p>
        )}
      </div>
      <div>{children}</div>
    </div>
  )
}

function ThemeOption({ value, label, icon: Icon, current, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={clsx(
        'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors',
        current === value
          ? 'bg-red-500 text-white'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
      )}
    >
      <Icon size={14} />
      {label}
    </button>
  )
}

export default function Settings() {
  const { theme, setTheme } = useUIStore()
  const [notificationStatus, setNotificationStatus] = useState(() =>
    typeof Notification !== 'undefined' ? Notification.permission : 'unsupported'
  )

  const enableNotifications = async () => {
    const granted = await requestNotificationPermission()
    setNotificationStatus(granted ? 'granted' : 'denied')
  }

  return (
    <div>
      <div className="flex items-center gap-2.5 mb-8">
        <SettingsIcon size={22} className="text-gray-500" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
      </div>

      {/* Appearance */}
      <div className="card p-6 mb-4">
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
          Appearance
        </h2>
        <SettingRow label="Theme" description="Choose your preferred color scheme">
          <div className="flex items-center gap-2">
            <ThemeOption value="light" label="Light" icon={Sun} current={theme} onSelect={setTheme} />
            <ThemeOption value="dark" label="Dark" icon={Moon} current={theme} onSelect={setTheme} />
            <ThemeOption value="system" label="System" icon={Monitor} current={theme} onSelect={setTheme} />
          </div>
        </SettingRow>
      </div>

      {/* Account */}
      <div className="card p-6 mb-4">
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
          Account
        </h2>
        <SettingRow label="Name" description="Your display name">
          <span className="text-sm text-gray-400 dark:text-gray-500">Alex Johnson</span>
        </SettingRow>
        <SettingRow label="Email" description="Your account email">
          <span className="text-sm text-gray-400 dark:text-gray-500">alex@example.com</span>
        </SettingRow>
      </div>

      {/* Notifications */}
      <div className="card p-6">
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
          Notifications
        </h2>
        <SettingRow
          label="Browser notifications"
          description="Get notified about reminders and due tasks"
        >
          <button type="button" onClick={enableNotifications} disabled={notificationStatus === 'granted' || notificationStatus === 'unsupported'} className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 disabled:opacity-50">
            <Bell size={13} />
            {notificationStatus === 'granted' ? 'Enabled' : notificationStatus === 'denied' ? 'Blocked in browser' : notificationStatus === 'unsupported' ? 'Unavailable' : 'Enable'}
          </button>
        </SettingRow>
      </div>
    </div>
  )
}

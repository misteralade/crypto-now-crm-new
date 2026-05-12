import { Bell, User } from 'lucide-react'
import { useMemo, type ReactNode } from 'react'
import { LOCAL_STORAGE_KEYS, ROUTES } from '../../util/constants.util'
import { Link } from '@tanstack/react-router'

interface PageHeaderProps {
  title: string
  subtitle?: string
  actions?: ReactNode
  className?: string
}

/** Decode the JWT payload without verifying - used only for display (email/name). */
function decodeAdminEmail(): string {
  try {
    const token = localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN)
    if (!token) return 'Admin'
    const base64 = token.split('.')[1]
    if (!base64) return 'Admin'
    const payload = JSON.parse(atob(base64.replace(/-/g, '+').replace(/_/g, '/')))
    const email: string = payload?.email || ''
    // Show name part of email (before @) formatted nicely
    const name = email.split('@')[0] ?? 'Admin'
    return name.charAt(0).toUpperCase() + name.slice(1).replace(/[._-]/g, ' ')
  } catch {
    return 'Admin'
  }
}

const PageHeader = ({ title, subtitle, actions, className }: PageHeaderProps) => {
  const adminName = useMemo(() => decodeAdminEmail(), [])

  return (
    <div className={`sticky top-0 z-20 w-full border-b border-gray-100 bg-white ${className ?? ''}`}>
      <div className="flex w-full items-center justify-between gap-4 px-6 py-4">
        <div className="min-w-0">
          <h2 className="text-balance text-xl font-semibold leading-tight text-gray-900">{title}</h2>
          {subtitle && <p className="mt-1 text-pretty text-sm text-gray-500">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-4">
          {actions}

          {/* Bell - links to notifications page */}
          <Link
            to={ROUTES.NOTIFICATIONS}
            className="relative rounded-xl bg-gray-50 p-2 text-gray-600 transition-colors hover:bg-gray-100"
            title="Notifications"
          >
            <Bell className="h-5 w-5" />
          </Link>

          {/* Admin name + icon */}
          <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
            <div className="flex size-9 flex-shrink-0 items-center justify-center rounded-full bg-blue-50">
              <User className="h-4.5 w-4.5 text-blue-600" style={{ width: 18, height: 18 }} />
            </div>
            <span className="hidden max-w-[120px] truncate text-sm font-medium text-gray-700 sm:block" title={adminName}>
              {adminName}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PageHeader

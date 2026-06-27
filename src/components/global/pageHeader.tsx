import { Bell, Menu, User, ArrowLeft } from 'lucide-react'
import { useMemo, type ReactNode } from 'react'
import { LOCAL_STORAGE_KEYS, ROUTES } from '../../util/constants.util'
import { Link } from '@tanstack/react-router'
import { useSidebarToggle } from '../../layout/sidebar-toggle-context.tsx'

interface PageHeaderProps {
  title: string
  subtitle?: string
  actions?: ReactNode
  className?: string
  onBack?: () => void
}

/** Decode the JWT payload without verifying - used only for display (email/name). */
function decodeAdminName(): string {
  try {
    const token = localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN)
    if (!token) return 'Admin'
    const base64 = token.split('.')[1]
    if (!base64) return 'Admin'
    const payload = JSON.parse(atob(base64.replace(/-/g, '+').replace(/_/g, '/')))
    
    // Prioritize real name from JWT
    const { firstName, lastName, username, email } = payload
    if (firstName && firstName !== 'admin' && lastName && lastName !== 'admin') {
      return `${firstName} ${lastName}`
    } else if (firstName && firstName !== 'admin') {
      return firstName
    }

    // Fallback to username
    if (username && username !== 'admin') {
      return username.charAt(0).toUpperCase() + username.slice(1)
    }

    const emailStr: string = email || ''
    // Show name part of email (before @) formatted nicely
    const name = emailStr.split('@')[0] ?? 'Admin'
    return name.charAt(0).toUpperCase() + name.slice(1).replace(/[._-]/g, ' ')
  } catch {
    return 'Admin'
  }
}

const PageHeader = ({ title, subtitle, actions, className, onBack }: PageHeaderProps) => {
  const adminName = useMemo(() => decodeAdminName(), [])
  const sidebarToggle = useSidebarToggle()

  return (
    <div className={`sticky top-0 z-20 w-full border-b border-gray-100 bg-white ${className ?? ''}`}>
      <div className="flex w-full flex-col gap-2 px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex w-full items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2 sm:gap-4">
            {sidebarToggle && (
              <button
                onClick={sidebarToggle.toggleSidebar}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-100 bg-white text-gray-700 shadow-sm transition-all hover:bg-gray-50 active:scale-95 lg:hidden"
                aria-label={sidebarToggle.isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
              >
                <Menu className="h-4.5 w-4.5" />
              </button>
            )}
            {onBack && (
              <button
                onClick={onBack}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-100 bg-gray-50 text-gray-600 transition-all hover:bg-gray-100 active:scale-95 sm:h-9 sm:w-9"
                aria-label="Go back"
              >
                <ArrowLeft className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
              </button>
            )}
            <div className="min-w-0">
              <h2 className="text-balance text-[17px] font-semibold leading-tight text-gray-900 sm:text-xl">
                {title}
              </h2>
              {subtitle && (
                <p className="mt-1 hidden text-pretty text-sm leading-5 text-gray-500 sm:block">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {actions && (
              <div className="hidden sm:flex sm:items-center sm:gap-3">
                {actions}
              </div>
            )}

            {/* Bell - links to notifications page */}
            <Link
              to={ROUTES.NOTIFICATIONS}
              className="relative rounded-xl bg-gray-50 p-1.5 text-gray-600 transition-colors hover:bg-gray-100 sm:p-2"
              title="Notifications"
            >
              <Bell className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
            </Link>

            {/* Admin name + icon */}
            <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
              <div className="flex size-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-50 sm:size-9">
                <User className="h-4.5 w-4.5 text-blue-600" style={{ width: 18, height: 18 }} />
              </div>
              <span className="hidden max-w-[120px] truncate text-sm font-medium text-gray-700 sm:block" title={adminName}>
                {adminName}
              </span>
            </div>
          </div>
        </div>

        {actions && (
          <div className="flex flex-wrap items-center gap-2 sm:hidden mt-1">
            {actions}
          </div>
        )}

        {subtitle && (
          <p className="text-pretty text-xs text-gray-500 sm:hidden mt-0.5">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  )
}

export default PageHeader

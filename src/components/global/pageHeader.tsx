import { Bell, User } from 'lucide-react'
import { useMemo } from 'react'
import { LOCAL_STORAGE_KEYS, ROUTES } from '../../util/constants.util'
import { Link } from '@tanstack/react-router'

interface PageHeaderProps {
  title: string
  subtitle?: string
}

/** Decode the JWT payload without verifying — used only for display (email/name). */
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

const PageHeader = ({ title, subtitle }: PageHeaderProps) => {
  const adminName = useMemo(() => decodeAdminEmail(), [])

  return (
    <div className="flex justify-between items-center py-4 px-6 bg-white border-b border-gray-100 sticky top-0 z-20">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 leading-tight tracking-tight">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-4">
        {/* Bell — links to notifications page */}
        <Link
          to={ROUTES.NOTIFICATIONS}
          className="relative p-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-gray-600"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
        </Link>

        {/* Admin name + icon */}
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
            <User className="w-4.5 h-4.5 text-blue-600" style={{ width: 18, height: 18 }} />
          </div>
          <span className="text-sm font-medium text-gray-700 hidden sm:block max-w-[120px] truncate" title={adminName}>
            {adminName}
          </span>
        </div>
      </div>
    </div>
  )
}

export default PageHeader

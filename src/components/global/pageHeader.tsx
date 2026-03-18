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
    <div className="flex justify-between items-center py-3.5 px-6 bg-white border-b border-[#ECECEC] sticky top-0 z-20">
      <div>
        <h2 className="text-[17px] font-semibold text-[#0E0F0C] leading-tight">{title}</h2>
        {subtitle && <p className="text-[12px] text-[#9A9A9A] mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        {/* Bell — links to notifications page */}
        <Link
          to={ROUTES.NOTIFICATIONS}
          className="relative p-2 rounded-xl bg-[#F5F5FF] hover:bg-[#D3D4F8] transition-colors"
          title="Notifications"
        >
          <Bell className="w-4.5 h-4.5 text-[#03034D]" style={{ width: 18, height: 18 }} />
        </Link>

        {/* Admin name + icon */}
        <div className="flex items-center gap-2 pl-3 border-l border-[#ECECEC]">
          <div className="w-8 h-8 rounded-full bg-[#D3D4F8] flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-[#03034D]" />
          </div>
          <span className="text-[13px] font-semibold text-[#03034D] hidden sm:block max-w-[120px] truncate" title={adminName}>
            {adminName}
          </span>
        </div>
      </div>
    </div>
  )
}

export default PageHeader

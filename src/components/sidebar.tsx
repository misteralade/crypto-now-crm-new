import { useEffect, useState } from 'react'
import {Link, useNavigate, useRouterState} from '@tanstack/react-router'
import { History, LogOut } from 'lucide-react'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import logo from '../assets/img/logo.svg'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import sidebar from '../assets/img/Vector.svg'
import {LOCAL_STORAGE_KEYS, ROUTES} from '../util/constants.util.ts'

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }
    const listener = () => setMatches(media.matches)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [matches, query])

  return matches
}

const navItems = [
  {
    path: ROUTES.DASHBOARD,
    label: 'Overview',
    icon: (props: { className?: string }) => (
      <img
        src="/icons/overview-icon.svg"
        alt="Overview"
        className={`${props.className ?? ''} w-5 h-5`}
      />
    ),
  },
  {
    path: ROUTES.TRANSACTIONS,
    label: 'Manage Transactions',
    icon: (props: { className?: string }) => (
      <img
        src="/icons/transaction.svg"
        alt="Transaction"
        className={`${props.className ?? ''} w-5 h-5`}
      />
    ),
  },
  {
    path: ROUTES.COIN_MANAGEMENT,
    label: 'Coin Management',
    icon: (props: { className?: string }) => (
      <img
        src="/icons/btc.svg"
        alt="BTC"
        className={`${props.className ?? ''} w-5 h-5`}
      />
    ),
  },
  {
    path: ROUTES.MANAGE_FIAT,
    label: 'Manage Fiat',
    icon: (props: { className?: string }) => (
      <img
        src="/icons/naira.svg"
        alt="Naira"
        className={`${props.className ?? ''} w-5 h-5`}
      />
    ),
  },
  {
    path: ROUTES.KYC_TIER_LIMITS,
    label: 'KYC Tier Limits',
    icon: (props: { className?: string }) => (
      <img
        src="/icons/user.svg"
        alt="KYC Tier Limits"
        className={`${props.className ?? ''} w-5 h-5`}
      />
    ),
  },
  {
    path: ROUTES.SUPPORTED_CURRENCIES,
    label: 'Currencies',
    icon: (props: { className?: string }) => (
      <img
        src="/icons/naira.svg"
        alt="Currencies"
        className={`${props.className ?? ''} w-5 h-5`}
      />
    ),
  },
  {
    path: ROUTES.TESTIMONIALS,
    label: 'Testimonials',
    icon: (props: { className?: string }) => (
      <img
        src="/icons/testimonial.svg"
        alt="Testimonial"
        className={`${props.className ?? ''} w-5 h-5`}
      />
    ),
  },
  {
    path: ROUTES.DISPUTES,
    label: 'Disputes',
    icon: (props: { className?: string }) => (
      <img
        src="/icons/dispute.svg"
        alt="Dispute"
        className={`${props.className ?? ''} w-5 h-5`}
      />
    ),
  },
  {
    path: ROUTES.NOTIFICATIONS,
    label: 'Notifications',
    icon: (props: { className?: string }) => (
      <img
        src="/icons/notification.svg"
        alt="Notification"
        className={`${props.className ?? ''} w-5 h-5`}
      />
    ),
  },
  {
    path: ROUTES.AUDIT_TRAILS,
    label: 'Audit trails',
    icon: History,
  },
  {
    path: ROUTES.USERS,
    label: 'Users',
    icon: (props: { className?: string }) => (
      <img
        src="/icons/user.svg"
        alt="User"
        className={`${props.className ?? ''} w-5 h-5`}
      />
    ),
  },
  {
    path: ROUTES.MANAGE_ADMINS,
    label: 'Manage Admins',
    icon: (props: { className?: string }) => (
      <img
        src="/icons/admin.svg"
        alt="Manage Admins"
        className={`${props.className ?? ''} w-5 h-5`}
      />
    ),
  },
]

interface SidebarProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const routerState = useRouterState()
  const navigate = useNavigate()
  const currentPath = routerState.location.pathname
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  const handleLogout = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
    navigate({ to: ROUTES.LOGIN });
  }

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-[302px] z-50 bg-[#F6F6F6] transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:sticky lg:top-0 lg:translate-x-0 lg:z-0 lg:h-screen`}
        role={isDesktop ? undefined : 'dialog'}
        aria-modal={!isDesktop && isOpen}
        aria-hidden={!isDesktop && !isOpen}
      >
        <div className="flex flex-col h-full w-full overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6">
            <img src={logo} alt="Company Logo" className="h-8 object-contain" />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1 rounded-md bg-[#D3D4F8] transition-transform"
            >
              <img
                src={sidebar}
                alt="Toggle sidebar"
                className={`w-5 h-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = currentPath === item.path

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => {
                    if (!isDesktop) setIsOpen(false)
                  }}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-[#D3D4F8] text-[#323232] hover:bg-[#CFCFF4]'
                      : 'text-[#858585] hover:bg-gray-100 hover:text-[#323232]'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${isActive ? 'text-[#323232]' : 'text-[#858585]'}`}
                  />
                  <span className="text-[18px]">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 mt-auto">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-[#EB5757] transition-colors w-full hover:bg-[#FDECEC] hover:cursor-pointer "
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

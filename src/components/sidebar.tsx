import { useEffect, useState } from 'react'
import {Link, useNavigate, useRouterState} from '@tanstack/react-router'
import { History, LogOut, ChevronLeft, ChevronRight, Wallet, Landmark } from 'lucide-react'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import logo from '../assets/img/logo.svg'
import {LOCAL_STORAGE_KEYS, ROUTES} from '../util/constants.util.ts'
import { useAdminAuth } from '../hooks/useAdminAuth'

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
        className={`${props.className ?? ''} w-5 h-5 brightness-[5]`}
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
        className={`${props.className ?? ''} w-5 h-5 brightness-[5]`}
      />
    ),
  },
  {
    path: ROUTES.COIN_MANAGEMENT,
    label: 'Coin/Wallet Management',
    icon: (props: { className?: string }) => (
      <img
        src="/icons/btc.svg"
        alt="BTC"
        className={`${props.className ?? ''} w-5 h-5 brightness-[5]`}
      />
    ),
  },
  {
    path: ROUTES.ADMIN_WALLETS,
    label: 'Admin Wallets',
    icon: Landmark,
  },
  {
    path: ROUTES.MANAGE_FIAT,
    label: 'Manage Fiat',
    icon: (props: { className?: string }) => (
      <img
        src="/icons/naira.svg"
        alt="Naira"
        className={`${props.className ?? ''} w-5 h-5 brightness-[5]`}
      />
    ),
  },
  {
    path: ROUTES.TREASURY,
    label: 'Treasury',
    icon: Wallet,
  },
  {
    path: ROUTES.KYC_TIER_LIMITS,
    label: 'KYC Tier Limits',
    icon: (props: { className?: string }) => (
      <img
        src="/icons/user.svg"
        alt="KYC Tier Limits"
        className={`${props.className ?? ''} w-5 h-5 brightness-[5]`}
      />
    ),
  },
  {
    path: ROUTES.KYC_SESSIONS,
    label: 'KYC Sessions',
    icon: (props: { className?: string }) => (
      <img
        src="/icons/user.svg"
        alt="KYC Sessions"
        className={`${props.className ?? ''} w-5 h-5 brightness-[5]`}
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
        className={`${props.className ?? ''} w-5 h-5 brightness-[5]`}
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
        className={`${props.className ?? ''} w-5 h-5 brightness-[5]`}
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
        className={`${props.className ?? ''} w-5 h-5 brightness-[5]`}
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
        className={`${props.className ?? ''} w-5 h-5 brightness-[5]`}
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
        className={`${props.className ?? ''} w-5 h-5 brightness-[5]`}
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
        className={`${props.className ?? ''} w-5 h-5 brightness-[5]`}
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
  const { isSuperAdmin } = useAdminAuth()

  const handleLogout = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
    navigate({ to: ROUTES.LOGIN });
  }

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-[272px] z-50 bg-[#03034D] transform transition-transform duration-300 ease-in-out flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:sticky lg:top-0 lg:translate-x-0 lg:z-0 lg:h-screen`}
        role={isDesktop ? undefined : 'dialog'}
        aria-modal={!isDesktop && isOpen}
        aria-hidden={!isDesktop && !isOpen}
      >
        <div className="flex flex-col h-full w-full overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
            <Link
              to={ROUTES.DASHBOARD}
              aria-label="Go to dashboard"
              className="inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white/80 focus-visible:ring-offset-[#03034D] rounded-md"
              onClick={() => {
                // Close sidebar on mobile when navigating with the logo
                if (!isDesktop) setIsOpen(false)
              }}
            >
              <img src={logo} alt="CryptoNow" className="h-7 object-contain brightness-[5]" />
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white"
            >
              {isOpen
                ? <ChevronLeft className="w-4 h-4" />
                : <ChevronRight className="w-4 h-4" />
              }
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems
              .filter((item) => {
                // Only show Manage Admins to Super Admins
                if (item.path === ROUTES.MANAGE_ADMINS) {
                  return isSuperAdmin
                }
                return true
              })
              .map((item) => {
                const Icon = item.icon
                const isActive = item.path === ROUTES.DASHBOARD 
                  ? currentPath === item.path 
                  : currentPath === item.path || currentPath.startsWith(item.path + '/')

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => {
                      if (!isDesktop) setIsOpen(false)
                    }}
                    className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? 'bg-white/15 text-white'
                        : 'text-white/55 hover:bg-white/8 hover:text-white/90'
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-white/55'}`}
                    />
                    <span className="text-[14.5px] font-medium tracking-[-0.01em]">{item.label}</span>
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#948EEE]" />
                    )}
                  </Link>
                )
              })}
          </nav>

          {/* Logout */}
          <div className="px-3 py-4 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium text-[#FF8B8B] hover:bg-red-500/15 hover:text-red-300 transition-colors w-full cursor-pointer"
            >
              <LogOut size={18} className="flex-shrink-0" />
              <span className="text-[14.5px]">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

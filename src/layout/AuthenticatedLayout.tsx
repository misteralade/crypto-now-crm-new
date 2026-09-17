import { type ReactNode, useEffect, useMemo, useState } from 'react'
import Sidebar from "../components/sidebar.tsx";
import {useNavigate, useRouterState} from "@tanstack/react-router";
import {LOCAL_STORAGE_KEYS, ROUTES} from "../util/constants.util.ts";
import { motion, AnimatePresence } from 'framer-motion'
import { SidebarToggleProvider } from "./sidebar-toggle-context.tsx";
import { useAdminAuth } from "../hooks/useAdminAuth.ts";
import { getRequiredPermissionsForPath } from "../util/permissions.util.ts";

const AuthenticatedLayout = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate()
  const routerState = useRouterState()
  const { hasAnyPermission, loading: loadingAdminAuth } = useAdminAuth()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const sidebarToggleValue = useMemo(() => ({
    openSidebar: () => setSidebarOpen(true),
    closeSidebar: () => setSidebarOpen(false),
    toggleSidebar: () => setSidebarOpen((current) => !current),
    isSidebarOpen: sidebarOpen,
  }), [sidebarOpen])
  
  useEffect(() => {
    const isDesktop = window.innerWidth >= 1024
    setSidebarOpen(isDesktop)
    const onResize = () => {
      const desktop = window.innerWidth >= 1024
      setSidebarOpen(desktop)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && window.innerWidth < 1024) setSidebarOpen(false)
    }
    window.addEventListener('resize', onResize)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('keydown', onKey)
    }
  }, [])
  
  // Ping if user is valid before login
  useEffect(() => {
    pingAdminUser();
  }, []);
  
  const pingAdminUser = () => {
    const token = localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
    if (!token) {
      navigate({ to: ROUTES.LOGIN });
    }
  }

  // Guard against direct URL access to a page the admin's permissions don't
  // cover - hiding the nav link is UX, this is the actual enforcement layer
  // on the frontend (the backend still rejects the underlying API calls either way).
  useEffect(() => {
    if (loadingAdminAuth) return;
    const requiredPermissions = getRequiredPermissionsForPath(routerState.location.pathname);
    if (requiredPermissions && !hasAnyPermission(requiredPermissions)) {
      navigate({ to: ROUTES.DASHBOARD });
    }
  }, [loadingAdminAuth, routerState.location.pathname]);
  
  return (
    <div className="min-h-screen bg-[#F5F5FF]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="flex min-h-screen">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        <AnimatePresence>
          {sidebarOpen && window.innerWidth < 1024 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden pointer-events-auto"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>
        <div className="flex-1 flex flex-col min-w-0">
          <SidebarToggleProvider value={sidebarToggleValue}>
            <motion.main
              key={window.location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex-1"
            >
              {children}
            </motion.main>
          </SidebarToggleProvider>
        </div>
      </div>
    </div>
  )
}

export default AuthenticatedLayout;

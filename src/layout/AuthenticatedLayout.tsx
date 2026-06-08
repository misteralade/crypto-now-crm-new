import { type ReactNode, useEffect, useMemo, useState } from 'react'
import Sidebar from "../components/sidebar.tsx";
import {useNavigate} from "@tanstack/react-router";
import {LOCAL_STORAGE_KEYS, ROUTES} from "../util/constants.util.ts";
import { motion, AnimatePresence } from 'framer-motion'
import { SidebarToggleProvider } from "./sidebar-toggle-context.tsx";

const AuthenticatedLayout = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate()
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

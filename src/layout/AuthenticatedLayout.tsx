import {type ReactNode, useEffect, useState} from 'react'
import { Menu } from 'lucide-react'
import Sidebar from "../components/sidebar.tsx";
import {authServiceApi} from "../api/auth.api.ts";
import {useNavigate} from "@tanstack/react-router";
import {LOCAL_STORAGE_KEYS, ROUTES} from "../util/constants.util.ts";

const AuthenticatedLayout = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  
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
  
  const pingAdminUser = async () => {
    const { success } = await authServiceApi.pingAdmin();
    
    if (!success) {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
      navigate({ to: ROUTES.LOGIN })
    }
  }
  
  return (
    <div className="min-h-screen bg-[#F5F5FF]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="flex min-h-screen">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <div className="flex-1 flex flex-col min-w-0">
          {!sidebarOpen && (
            <button
              aria-label="Open sidebar"
              className="lg:hidden fixed top-4 left-4 z-30 p-2 rounded-lg border border-[#ECECEC] bg-white shadow-sm"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5 text-[#03034D]" />
            </button>
          )}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}

export default AuthenticatedLayout;

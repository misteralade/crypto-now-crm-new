import { useEffect, useState } from 'react'
import { Outlet } from '@tanstack/react-router'
import { Menu } from 'lucide-react'
import Sidebar from './components/sidebar'

function App() {
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
  
  return (
    <div className="min-h-screen font-[DM Sans]]">
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/30 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <div className="flex-1 flex flex-col overflow-hidden">
          {!sidebarOpen && (
            <button
              aria-label="Open sidebar"
              className="lg:hidden fixed top-4 left-4 z-30 p-2 rounded-md border border-[#ECECEC] bg-white shadow"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          <main className="">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

export default App

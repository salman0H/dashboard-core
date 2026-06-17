// src/layouts/DashboardLayout.tsx
import { Suspense, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { TopBar } from '@/components/features/TopBar/TopBar'
import { AppSidebar } from '@/components/features/SideBar/AppSidebar'
import { useDirection } from '@/hooks/useDirection'
import { useAppContext } from '@/context/AppContext'

const FLUID_ROUTES = ['/flow-progress', '/substation']

function PageLoadingFallback() {
  return (
    <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
      <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full me-2" />
      Loading…
    </div>
  )
}

export function DashboardLayout() {
  useDirection()

  const { dir } = useAppContext()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()
  const isFluid = FLUID_ROUTES.includes(location.pathname)

  return (
    <div
      id="app-shell"
      dir={dir}
      className={`flex flex-col min-h-screen bg-app-bg ${dir === 'rtl' ? 'font-rtl' : ''}`}
    >
      <div className="sticky top-0 z-50">
        <TopBar
          onToggleSidebar={() => setSidebarOpen((s) => !s)}
          sidebarOpen={sidebarOpen}
        />
      </div>

      <div className="flex flex-1 overflow-hidden">
        <AppSidebar open={sidebarOpen} />

        <main
          className={`flex-1 ${isFluid ? 'overflow-hidden p-0' : 'overflow-y-auto p-6'}`}
        >
          <Suspense fallback={<PageLoadingFallback />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  )
}
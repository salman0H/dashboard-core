import { Suspense, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { TopBar } from '@/components/features/TopBar/TopBar'
import { AppSidebar } from '@/components/features/SideBar/AppSidebar'
import { useDirection } from '@/hooks/useDirection'
import { useAppContext } from '@/context/AppContext'

function PageLoadingFallback() {
  return (
    <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
      <i className="ti ti-loader-2 animate-spin text-xl me-2" aria-hidden="true" />
      Loading…
    </div>
  )
}

export function DashboardLayout() {
  useDirection()

  const { dir } = useAppContext()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div
      id="app-shell"
      dir={dir}
      className={`flex flex-col min-h-screen bg-app-bg ${dir === 'rtl' ? 'font-rtl' : ''}`}
    >
      {/* Sticky top bar */}
      <div className="sticky top-0 z-50">
        <TopBar
          onToggleSidebar={() => setSidebarOpen((s) => !s)}
          sidebarOpen={sidebarOpen}
        />
      </div>

      {/* Body: sidebar + page content side by side */}
      <div className="flex flex-1 overflow-hidden">
        <AppSidebar open={sidebarOpen} />

        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <Suspense fallback={<PageLoadingFallback />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  )
}
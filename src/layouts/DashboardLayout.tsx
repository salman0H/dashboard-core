import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { TopBar } from '@/components/features/TopBar/TopBar'
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

/**
 * DashboardLayout — the core shell.
 * TopBar is always rendered. <Outlet /> is where your pages render.
 * To add a new project: register its routes in router.tsx nested under this layout.
 * The dashboard page content is intentionally empty — add yours via Outlet.
 */
export function DashboardLayout() {
  // Syncs html[dir] and html[lang] reactively — no DOM writes during render.
  useDirection()

  const { dir } = useAppContext()

  return (
    <div
      id="app-shell"
      dir={dir}
      className={`flex flex-col min-h-screen bg-app-bg ${dir === 'rtl' ? 'font-rtl' : ''}`}
    >
      <TopBar />

      {/* Page content — your projects go here */}
      <main className="flex-1 overflow-y-auto scrollbar-thin">
        <Suspense fallback={<PageLoadingFallback />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  )
}

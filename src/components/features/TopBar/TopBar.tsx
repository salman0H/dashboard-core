import { useTranslation } from 'react-i18next'
import { LanguageSwitcher } from '@/components/features/LanguageSwitcher/LanguageSwitcher'
import { UserMenu } from '@/components/features/UserMenu/UserMenu'
import { Button } from '@/components/primitives/Button/Button'

interface TopBarProps {
  onToggleSidebar: () => void
  sidebarOpen: boolean
}

export function TopBar({ onToggleSidebar, sidebarOpen }: TopBarProps) {
  const { t } = useTranslation(['common', 'nav'])

  return (
    <header className="bg-surface border-b border-border flex items-center justify-between gap-3 px-4 py-2 flex-shrink-0 h-[52px]">
      {/* Left: hamburger + brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          className="w-8 h-8 inline-flex items-center justify-center rounded-core text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <i
            className={`ti ${sidebarOpen ? 'ti-layout-sidebar' : 'ti-layout-sidebar-right'} text-lg`}
            aria-hidden="true"
          />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-accent rounded-core grid place-items-center text-white text-sm font-bold flex-shrink-0">
            C
          </div>
          <div>
            <div className="text-[14px] font-semibold text-slate-900 leading-tight">
              CoreUI
            </div>
            <div className="text-[10px] text-slate-400 font-mono">v2.1.0</div>
          </div>
        </div>
      </div>

      {/* Right: search, actions, user */}
      <div className="flex items-center gap-2.5">
        {/* Search */}
        <div className="hidden sm:flex items-center gap-1.5 bg-app-bg border border-border rounded-core px-2.5 py-1.5 text-[13px] text-slate-500 min-w-[180px]">
          <i className="ti ti-search text-slate-400 text-[14px]" aria-hidden="true" />
          <span>{t('common:search')}</span>
          <span className="ms-auto text-[10px] text-slate-400 font-mono">⌘K</span>
        </div>

        <Button aria-label={t('common:notifications')}>
          <i className="ti ti-bell text-base" aria-hidden="true" />
        </Button>

        <LanguageSwitcher />

        <Button aria-label={t('common:settings')}>
          <i className="ti ti-settings text-base" aria-hidden="true" />
        </Button>

        <UserMenu />
      </div>
    </header>
  )
}
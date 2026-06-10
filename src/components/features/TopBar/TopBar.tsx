// File: src/components/features/TopBar/TopBar.tsx
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import { LanguageSwitcher } from '@/components/features/LanguageSwitcher/LanguageSwitcher'
import { UserMenu } from '@/components/features/UserMenu/UserMenu'
import { Button } from '@/components/primitives/Button/Button'
import { Badge } from '@/components/primitives/Badge/Badge'
import { useMenu } from '@/hooks/useMenu'

export function TopBar() {
  const { t } = useTranslation(['common', 'nav'])
  const { sections } = useMenu()

  const allItems = sections.flatMap((s) => s.items)

  return (
    <header className="bg-surface border-b border-border flex flex-wrap items-center justify-between gap-3 px-5 py-2 flex-shrink-0">
      <div className="flex flex-wrap items-center gap-5">
        <div className="flex items-center gap-2 pe-3 border-e border-border">
          <div className="w-8 h-8 bg-accent rounded-core grid place-items-center text-white text-base font-bold flex-shrink-0">
            C
          </div>
          <div>
            <div className="text-[15px] font-semibold text-slate-900 leading-tight">
              CoreUI
            </div>
            <div className="text-[10px] text-slate-400 font-mono">v2.1.0</div>
          </div>
        </div>

        <nav
          className="flex flex-wrap items-center gap-1.5"
          aria-label={t('nav:mainNavAriaLabel')}
        >
          {allItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.route}
              end={item.route === '/'}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-medium transition-colors whitespace-nowrap
                 ${isActive
                   ? 'bg-accent-dim text-accent-text'
                   : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                 }`
              }
            >
              <i className={`ti ${item.icon} text-base`} aria-hidden="true" />
              <span>{t(`nav:${item.labelKey}`)}</span>
              {item.badge != null && (
                <Badge>{t(`nav:${item.badge}`)}</Badge>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="flex items-center gap-1.5 bg-app-bg border border-border rounded-core px-2.5 py-1.5 text-[13px] text-slate-500">
          <i className="ti ti-search text-slate-400 text-[15px]" aria-hidden="true" />
          <span>{t('common:search')}</span>
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
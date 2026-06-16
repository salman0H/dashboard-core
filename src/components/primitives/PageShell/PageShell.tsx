// src/components/primitives/PageShell/PageShell.tsx
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { PageConfig } from '@/types/app.types'

interface PageShellProps {
  config: PageConfig
  actions?: ReactNode
  children: ReactNode
  fluid?: boolean
}

export function PageShell({ config, actions, children, fluid = false }: PageShellProps) {
  const { t } = useTranslation(['common', 'dashboard', 'nav'])

  if (fluid) {
    return <div className="h-full flex flex-col overflow-hidden">{children}</div>
  }

  return (
    <div>
      {config.breadcrumbs && config.breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1.5 text-[12px] text-slate-400 mb-2" aria-label="Breadcrumb">
          {config.breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <i className="ti ti-chevron-right text-[10px]" aria-hidden="true" />}
              {crumb.route ? (
                <Link to={crumb.route} className="hover:text-accent transition-colors">
                  {t(crumb.labelKey)}
                </Link>
              ) : (
                <span className="text-slate-500 font-medium">{t(crumb.labelKey)}</span>
              )}
            </span>
          ))}
        </nav>
      )}

      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          {config.icon && (
            <div className="w-10 h-10 rounded-xl bg-accent-dim grid place-items-center flex-shrink-0">
              <i className={`ti ${config.icon} text-accent text-xl`} aria-hidden="true" />
            </div>
          )}
          <div>
            <h1 className="text-xl font-semibold text-slate-900 leading-tight">
              {t(config.titleKey)}
            </h1>
            {config.subtitleKey && (
              <p className="text-[13px] text-slate-500 mt-0.5">{t(config.subtitleKey)}</p>
            )}
          </div>
        </div>

        {actions && (
          <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>
        )}
      </div>

      {children}
    </div>
  )
}
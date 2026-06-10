import { useTranslation } from 'react-i18next'

export function UserMenu() {
  const { t } = useTranslation('common')
  const userName = t('userName')
  const userRole = t('userRole')

  const initials = userName
    .split(' ')
    .map((w: string) => w[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div
      className="flex items-center gap-2 ps-2 pe-3 py-1 rounded-full bg-app-bg border border-border cursor-pointer hover:bg-slate-100 transition-colors"
      role="button"
      tabIndex={0}
      aria-label={t('userMenuAriaLabel')}
    >
      <div className="w-7 h-7 rounded-full bg-blue-100 grid place-items-center text-[11px] font-semibold text-accent-text flex-shrink-0">
        {initials}
      </div>
      <div className="leading-tight">
        <div className="text-xs font-medium text-slate-900">{userName}</div>
        <div className="text-[10px] text-slate-400">{userRole}</div>
      </div>
    </div>
  )
}
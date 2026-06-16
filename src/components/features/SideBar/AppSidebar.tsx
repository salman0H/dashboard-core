import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  LayoutDashboard,
  ChartBar,
  Folder,
  Network,
  User,
  Settings,
  type LucideIcon,
} from 'lucide-react'
import { useMenu } from '@/hooks/useMenu'
import type { MenuItem } from '@/services/menu.service'

interface AppSidebarProps {
  open: boolean
}

interface BottomItem {
  id: string
  labelKey: string
  icon: string
  route?: string
  badge?: number
  badgeVariant?: 'red' | 'amber'
}

const bottomItems: BottomItem[] = [
  { id: 'user-management', labelKey: 'userManagement', icon: 'User', route: '#' },
  { id: 'system-settings', labelKey: 'systemSettings', icon: 'Settings', route: '#' },
]

const iconMap: Record<string, LucideIcon> = {
  'ti-layout-dashboard': LayoutDashboard,
  'ti-chart-bar': ChartBar,
  'ti-folder': Folder,
  'ti-topology-ring': Network,
  'User': User,
  'Settings': Settings,
}

function getIcon(iconName: string): LucideIcon {
  return iconMap[iconName] || Folder // fallback
}

export function AppSidebar({ open }: AppSidebarProps) {
  const { sections } = useMenu()
  const allItems = sections.flatMap((s) => s.items)

  return (
    <aside
      className={`shrink-0 flex flex-col bg-sidebar border-e border-sidebar-border overflow-hidden transition-all duration-200 ease-in-out ${
        open ? 'w-60' : 'w-[58px]'
      }`}
      style={{ minHeight: 'calc(100vh - 52px)' }}
    >
      {/* Main nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto overflow-x-hidden scrollbar-thin">
        {allItems.map((item) => (
          <SidebarNavItem key={item.id} item={item} expanded={open} />
        ))}
      </nav>

      {/* Bottom items */}
      <div className="px-2 pb-3 pt-3 space-y-0.5 border-t border-sidebar-border">
        {bottomItems.map((item) => (
          <SidebarBottomItem key={item.id} item={item} expanded={open} />
        ))}
      </div>
    </aside>
  )
}

function SidebarNavItem({ item, expanded }: { item: MenuItem; expanded: boolean }) {
  const { t } = useTranslation('nav')
  const Icon = getIcon(item.icon)

  return (
    <NavLink
      to={item.route}
      end={item.route === '/'}
      className={({ isActive }) =>
        `relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
         transition-all duration-150 group border
         ${isActive
           ? 'bg-sidebar-active text-sidebar-primary border-sidebar-primary-border'
           : 'text-sidebar-muted hover:text-sidebar-text hover:bg-sidebar-hover border-transparent'
         } ${!expanded && 'justify-center px-2'}`
      }
      title={!expanded ? t(item.labelKey) : undefined}
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span className="absolute start-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-accent rounded-e-full" />
          )}
          <Icon
            size={20}
            className={`shrink-0 transition-colors ${
              isActive ? 'text-accent' : 'text-sidebar-icon group-hover:text-sidebar-text'
            }`}
          />
          {expanded && (
            <span className="flex-1 truncate text-start">{t(item.labelKey)}</span>
          )}
        </>
      )}
    </NavLink>
  )
}

function SidebarBottomItem({ item, expanded }: { item: BottomItem; expanded: boolean }) {
  const { t } = useTranslation('common')
  const Icon = getIcon(item.icon)

  return (
    <button
      className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
        transition-all duration-150 group border border-transparent
        text-sidebar-muted hover:text-sidebar-text hover:bg-sidebar-hover
        ${!expanded && 'justify-center px-2'}`}
      title={!expanded ? t(item.labelKey) : undefined}
    >
      <Icon
        size={20}
        className="shrink-0 text-sidebar-icon group-hover:text-sidebar-text"
      />
      {expanded && (
        <span className="flex-1 truncate text-start">{t(item.labelKey)}</span>
      )}
      {!expanded && item.badge !== undefined && (
        <span className="absolute top-1.5 end-1.5 w-2 h-2 rounded-full bg-red-500 shrink-0" />
      )}
    </button>
  )
}
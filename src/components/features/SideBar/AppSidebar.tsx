// src/components/features/SideBar/AppSidebar.tsx
import { Menu, Divider } from 'antd'
import type { MenuProps } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useMenu } from '@/hooks/useMenu'
import { useAppContext } from '@/context/AppContext'
import { useEffect, useState } from 'react'

// Ant Design icons
import {
  DashboardOutlined,
  BarChartOutlined,
  FolderOutlined,
  ApartmentOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons'

interface AppSidebarProps {
  open: boolean
}

// Map icon names from API to Ant Design icons
const iconMap: Record<string, React.ReactNode> = {
  'ti-layout-dashboard': <DashboardOutlined />,
  'ti-chart-bar': <BarChartOutlined />,
  'ti-folder': <FolderOutlined />,
  'ti-topology-ring': <ApartmentOutlined />,
}

function getIcon(iconName: string): React.ReactNode {
  return iconMap[iconName] || <FolderOutlined />
}

export function AppSidebar({ open }: AppSidebarProps) {
  const { t } = useTranslation(['nav', 'common'])
  const { dir } = useAppContext()
  const navigate = useNavigate()
  const location = useLocation()
  const { sections } = useMenu()
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])

  const allItems = sections.flatMap((s) => s.items)

  // Sync selected menu item with current route
  useEffect(() => {
    const currentPath = location.pathname
    const matchedItem = allItems.find((item) => item.route === currentPath)
    if (matchedItem) {
      setSelectedKeys([matchedItem.id])
    } else if (currentPath === '/') {
      setSelectedKeys(['dashboard'])
    } else {
      setSelectedKeys([])
    }
  }, [location.pathname, allItems])

  // Build main menu items
  const menuItems: MenuProps['items'] = allItems.map((item) => ({
    key: item.id,
    icon: getIcon(item.icon),
    label: t(item.labelKey),
    onClick: () => navigate(item.route),
  }))

  // Bottom menu items (user, settings, logout)
  const bottomMenuItems: MenuProps['items'] = [
    {
      key: 'user-management',
      icon: <UserOutlined />,
      label: t('common:userManagement'),
      onClick: () => navigate('#'),
    },
    {
      key: 'system-settings',
      icon: <SettingOutlined />,
      label: t('common:systemSettings'),
      onClick: () => navigate('#'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: t('common:logout'),
      danger: true,
      onClick: () => {
        // Handle logout
        console.log('Logout clicked')
      },
    },
  ]

  return (
    <aside
      className={`shrink-0 flex flex-col bg-sidebar border-e border-sidebar-border overflow-hidden transition-all duration-200 ease-in-out ${
        open ? 'w-60' : 'w-[58px]'
      }`}
      style={{ minHeight: 'calc(100vh - 52px)' }}
    >
      {/* Logo area (only when collapsed) */}
      {!open && (
        <div className="flex items-center justify-center py-3">
          <div className="w-8 h-8 bg-accent rounded-md grid place-items-center text-white text-sm font-bold">
            C
          </div>
        </div>
      )}

      {/* Main navigation */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-3">
        <Menu
          mode="inline"
          selectedKeys={selectedKeys}
          items={menuItems}
          inlineCollapsed={!open}
          inlineIndent={16}
          direction={dir}
          className="!border-none !bg-transparent"
          // Override default antd styles to match our design
          style={{ width: '100%' }}
        />
      </div>

      {/* Bottom items */}
      <div className="px-2 pb-3 pt-3 border-t border-sidebar-border">
        <Menu
          mode="inline"
          items={bottomMenuItems}
          inlineCollapsed={!open}
          inlineIndent={16}
          direction={dir}
          className="!border-none !bg-transparent"
          style={{ width: '100%' }}
        />
      </div>
    </aside>
  )
}
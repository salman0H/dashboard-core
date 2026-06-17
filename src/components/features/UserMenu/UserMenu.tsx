// src/components/features/UserMenu/UserMenu.tsx
import { Avatar, Dropdown } from 'antd'
import { SettingOutlined, LogoutOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import type { MenuProps } from 'antd'

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

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <div className="px-2 py-1">
          <div className="font-medium text-slate-900">{userName}</div>
          <div className="text-xs text-slate-400">{userRole}</div>
        </div>
      ),
      disabled: true,
    },
    { type: 'divider' },
    {
      key: '2',
      icon: <SettingOutlined />,
      label: t('settings'),
    },
    {
      key: '3',
      icon: <LogoutOutlined />,
      label: 'خروج',
      danger: true,
    },
  ]

  return (
    <Dropdown menu={{ items }} placement="bottomRight" arrow>
      <div className="flex items-center gap-2 ps-2 pe-3 py-1 rounded-full bg-app-bg border border-border cursor-pointer hover:bg-slate-100 transition-colors">
        <Avatar size="small" className="!bg-blue-100 !text-accent-text !text-[11px] !font-semibold !w-7 !h-7">
          {initials}
        </Avatar>
        <div className="leading-tight hidden sm:block">
          <div className="text-xs font-medium text-slate-900">{userName}</div>
          <div className="text-[10px] text-slate-400">{userRole}</div>
        </div>
      </div>
    </Dropdown>
  )
}
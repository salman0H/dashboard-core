// src/components/features/TopBar/TopBar.tsx
import { useTranslation } from 'react-i18next'
import { LanguageSwitcher } from '@/components/features/LanguageSwitcher/LanguageSwitcher'
import { UserMenu } from '@/components/features/UserMenu/UserMenu'
import { Button, Input } from 'antd'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
  BellOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import { useAppContext } from '@/context/AppContext'

interface TopBarProps {
  onToggleSidebar: () => void
  sidebarOpen: boolean
}

export function TopBar({ onToggleSidebar, sidebarOpen }: TopBarProps) {
  const { t } = useTranslation(['common', 'nav'])
  const { dir } = useAppContext()
  const isRtl = dir === 'rtl'

  return (
    <header className="bg-surface border-b border-border flex items-center justify-between gap-3 px-4 py-2 flex-shrink-0 h-[52px]">
      {/* Left: hamburger + brand */}
      <div className="flex items-center gap-3">
        <Button
          type="text"
          icon={sidebarOpen ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
          onClick={onToggleSidebar}
          aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          className="!w-8 !h-8 !flex !items-center !justify-center !text-slate-500 hover:!text-slate-900"
          style={isRtl ? { transform: 'scaleX(-1)' } : undefined}
        />

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-accent rounded-md grid place-items-center text-white text-sm font-bold flex-shrink-0">
            C
          </div>
          <div>
            <div className="text-[14px] font-semibold text-slate-900 leading-tight">CoreUI</div>
            <div className="text-[10px] text-slate-400 font-mono">v2.1.0</div>
          </div>
        </div>
      </div>

      {/* Right: search, actions, user */}
      <div className="flex items-center gap-2.5">
        <div className="hidden sm:flex items-center">
          <Input
            placeholder={t('common:search')}
            prefix={<SearchOutlined className="text-slate-400" />}
            suffix={<span className="text-[10px] text-slate-400 font-mono">⌘K</span>}
            className="!w-[180px] !bg-app-bg !border-border !rounded-md !text-[13px]"
            size="middle"
          />
        </div>

        <Button
          type="text"
          icon={<BellOutlined className="text-base" />}
          aria-label={t('common:notifications')}
          className="!w-8 !h-8 !flex !items-center !justify-center !text-slate-500 hover:!text-slate-900"
        />

        <LanguageSwitcher />

        <Button
          type="text"
          icon={<SettingOutlined className="text-base" />}
          aria-label={t('common:settings')}
          className="!w-8 !h-8 !flex !items-center !justify-center !text-slate-500 hover:!text-slate-900"
        />

        <UserMenu />
      </div>
    </header>
  )
}
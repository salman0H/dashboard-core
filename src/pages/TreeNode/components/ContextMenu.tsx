// src/pages/TreeNode/components/ContextMenu.tsx
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Dropdown, Menu, Space } from 'antd'
import type { MenuProps } from 'antd'

interface ContextMenuProps {
  x: number
  y: number
  nodeId: string
  nodeName: string
  hasChildren: boolean
  onClose: () => void
  onAddChild: (nodeId: string) => void
  onShowChildren: (nodeId: string, nodeName: string) => void
  onCopy: (nodeId: string) => void
}

export function ContextMenu({
  x,
  y,
  nodeId,
  nodeName,
  hasChildren,
  onClose,
  onAddChild,
  onShowChildren,
  onCopy,
}: ContextMenuProps) {
  const { t } = useTranslation('tree')
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [onClose])

  const items: MenuProps['items'] = [
    {
      key: 'add',
      icon: <span className="text-sm">📁</span>,
      label: t('addSubfolder'),
      onClick: () => onAddChild(nodeId),
    },
    ...(hasChildren ? [{
      key: 'show',
      icon: <span className="text-sm">📂</span>,
      label: t('showChildren'),
      onClick: () => onShowChildren(nodeId, nodeName),
    }] : []),
    { type: 'divider' },
    {
      key: 'copy',
      icon: <span className="text-sm">📋</span>,
      label: t('copyInfo'),
      onClick: () => onCopy(nodeId),
    },
  ]

  return (
    <div
      ref={menuRef}
      style={{
        position: 'fixed',
        top: y,
        left: x,
        zIndex: 1000,
      }}
    >
      <Menu items={items} selectable={false} className="shadow-lg border border-gray-200 rounded-xl min-w-[180px]" />
    </div>
  )
}
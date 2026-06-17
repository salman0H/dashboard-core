import { Button, Dropdown } from 'antd'
import type { MenuProps } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { widgetRegistry, allWidgetTypes } from '../config/widgetRegistry'
import type { WidgetType } from '../types/widget.types'

interface AddWidgetButtonProps {
  existingTypes: WidgetType[]
  onAdd: (type: WidgetType) => void
}

export function AddWidgetButton({ existingTypes, onAdd }: AddWidgetButtonProps) {
  const { t } = useTranslation('dashboard')

  const availableTypes = allWidgetTypes.filter((type) => !existingTypes.includes(type))

  const items: MenuProps['items'] = availableTypes.map((type) => ({
    key: type,
    icon: widgetRegistry[type].icon,
    label: t(widgetRegistry[type].labelKey),
    onClick: () => onAdd(type),
  }))

  const isDisabled = availableTypes.length === 0

  return (
    <Dropdown
      menu={{ items }}
      disabled={isDisabled}
      trigger={['click']}
      placement="bottomEnd"
    >
      <Button icon={<PlusOutlined />} disabled={isDisabled}>
        {t('addWidget')}
      </Button>
    </Dropdown>
  )
}

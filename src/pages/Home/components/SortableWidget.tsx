import type { ReactNode } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Popconfirm, Button } from 'antd'
import { HolderOutlined, CloseOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'

interface SortableWidgetProps {
  id: string
  children: ReactNode
  onRemove: (id: string) => void
}

export function SortableWidget({ id, children, onRemove }: SortableWidgetProps) {
  const { t } = useTranslation('dashboard')
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  }

  return (
    <div ref={setNodeRef} style={style} className="relative group h-full">
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        type="button"
        aria-label={t('dragWidget')}
        className="absolute top-2 start-2 z-10 w-7 h-7 inline-flex items-center justify-center
                   rounded-md bg-white/90 border border-slate-200 text-slate-400
                   opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing
                   hover:text-slate-700 hover:bg-white shadow-sm"
      >
        <HolderOutlined />
      </button>

      {/* Remove button */}
      <Popconfirm
        title={t('removeWidgetTitle')}
        description={t('removeWidgetDescription')}
        okText={t('common:confirm')}
        cancelText={t('common:cancel')}
        okButtonProps={{ danger: true }}
        onConfirm={() => onRemove(id)}
      >
        <Button
          type="text"
          size="small"
          icon={<CloseOutlined />}
          aria-label={t('removeWidgetTitle')}
          className="!absolute top-2 end-2 z-10 !w-7 !h-7 !flex items-center justify-center
                     !opacity-0 group-hover:!opacity-100 !transition-opacity
                     !text-slate-400 hover:!text-red-500 !bg-white/90 hover:!bg-white
                     !border !border-slate-200 !shadow-sm !rounded-md"
        />
      </Popconfirm>

      {children}
    </div>
  )
}

import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'
import { Row, Col, Empty, Alert } from 'antd'
import { useTranslation } from 'react-i18next'
import { SortableWidget } from './SortableWidget'
import { AddWidgetButton } from './AddWidgetButton'
import { widgetRegistry } from '../config/widgetRegistry'
import type { DashboardWidget, WidgetType } from '../types/widget.types'
import type { WidgetRenderContext } from '../config/widgetRegistry'

interface DashboardGridProps {
  widgets: DashboardWidget[]
  renderContext: WidgetRenderContext
  error: string | null
  onReorder: (activeId: string, overId: string) => void
  onAddWidget: (type: WidgetType) => void
  onRemoveWidget: (id: string) => void
}

export function DashboardGrid({
  widgets,
  renderContext,
  error,
  onReorder,
  onAddWidget,
  onRemoveWidget,
}: DashboardGridProps) {
  const { t } = useTranslation('dashboard')

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      onReorder(String(active.id), String(over.id))
    }
  }

  const existingTypes = widgets.map((w) => w.type)

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-4">
        <span className="text-xs text-slate-400">{t('dragHint')}</span>
        <AddWidgetButton existingTypes={existingTypes} onAdd={onAddWidget} />
      </div>

      {error && (
        <Alert message={error} type="error" showIcon closable className="mb-4" />
      )}

      {widgets.length === 0 ? (
        <Empty description={t('emptyDashboard')} className="py-16" />
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={widgets.map((w) => w.id)}
            strategy={rectSortingStrategy}
          >
            <Row gutter={[16, 16]}>
              {widgets.map((widget) => {
                const def = widgetRegistry[widget.type]
                if (!def) return null
                return (
                  <Col key={widget.id} {...def.colSpan}>
                    <SortableWidget id={widget.id} onRemove={onRemoveWidget}>
                      {def.render(renderContext)}
                    </SortableWidget>
                  </Col>
                )
              })}
            </Row>
          </SortableContext>
        </DndContext>
      )}
    </div>
  )
}

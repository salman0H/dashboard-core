import { useState, useEffect, useCallback } from 'react'
import {
  fetchDashboardWidgets,
  saveDashboardWidgets,
  addDashboardWidget,
  removeDashboardWidget,
} from '../services/widget.service'
import type { DashboardWidget, WidgetType } from '../types/widget.types'

interface UseDashboardWidgetsResult {
  widgets: DashboardWidget[]
  loading: boolean
  error: string | null
  reorder: (activeId: string, overId: string) => Promise<void>
  addWidget: (type: WidgetType) => Promise<void>
  removeWidget: (id: string) => Promise<void>
}

function arrayMove<T>(arr: T[], from: number, to: number): T[] {
  const copy = [...arr]
  const [moved] = copy.splice(from, 1)
  copy.splice(to, 0, moved)
  return copy
}

export function useDashboardWidgets(): UseDashboardWidgetsResult {
  const [widgets, setWidgets] = useState<DashboardWidget[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetchDashboardWidgets()
      .then((data) => {
        if (!cancelled) setWidgets(data)
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load widgets')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  // Reorder locally first (snappy drag feedback), then persist the new
  // order to the backend. On failure, revert to the previous state.
  const reorder = useCallback(async (activeId: string, overId: string) => {
    if (activeId === overId) return

    let previous: DashboardWidget[] = []
    let next: DashboardWidget[] = []

    setWidgets((current) => {
      previous = current
      const fromIndex = current.findIndex((w) => w.id === activeId)
      const toIndex = current.findIndex((w) => w.id === overId)
      if (fromIndex === -1 || toIndex === -1) {
        next = current
        return current
      }
      next = arrayMove(current, fromIndex, toIndex).map((w, i) => ({ ...w, order: i }))
      return next
    })

    try {
      await saveDashboardWidgets(next)
    } catch (err) {
      setWidgets(previous)
      setError(err instanceof Error ? err.message : 'Failed to save new order')
    }
  }, [])

  const addWidget = useCallback(async (type: WidgetType) => {
    setError(null)
    try {
      setWidgets((current) => {
        const newWidget: DashboardWidget = {
          id: `${type}-${Date.now()}`,
          type,
          order: current.length,
        }
        addDashboardWidget(newWidget).catch((err: unknown) => {
          setError(err instanceof Error ? err.message : 'Failed to add widget')
          setWidgets((c) => c.filter((w) => w.id !== newWidget.id))
        })
        return [...current, newWidget]
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add widget')
    }
  }, [])

  const removeWidget = useCallback(async (id: string) => {
    setError(null)
    let previous: DashboardWidget[] = []
    setWidgets((current) => {
      previous = current
      return current.filter((w) => w.id !== id)
    })
    try {
      await removeDashboardWidget(id)
    } catch (err) {
      setWidgets(previous)
      setError(err instanceof Error ? err.message : 'Failed to remove widget')
    }
  }, [])

  return { widgets, loading, error, reorder, addWidget, removeWidget }
}

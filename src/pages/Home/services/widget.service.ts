import { apiService } from '@/services/api.service'
import type { DashboardWidget } from '../types/widget.types'

export const fetchDashboardWidgets = async (): Promise<DashboardWidget[]> => {
  const widgets = await apiService.get<DashboardWidget[]>('/dashboardWidgets')
  return [...widgets].sort((a, b) => a.order - b.order)
}

// Sequential writes to avoid json-server race conditions on the single JSON file.
export const saveDashboardWidgets = async (widgets: DashboardWidget[]): Promise<void> => {
  for (const [index, w] of widgets.entries()) {
    await apiService.put(`/dashboardWidgets/${w.id}`, { ...w, order: index })
  }
}

export const addDashboardWidget = async (widget: DashboardWidget): Promise<DashboardWidget> => {
  return apiService.post<DashboardWidget>('/dashboardWidgets', widget)
}

export const removeDashboardWidget = async (id: string): Promise<void> => {
  await apiService.delete(`/dashboardWidgets/${id}`)
}
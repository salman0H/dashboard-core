export type WidgetType =
  | 'stats'
  | 'substationsStats'
  | 'userProfile'
  | 'quickActions'
  | 'substationsTable'

export interface DashboardWidget {
  id: string
  type: WidgetType
  order: number
}

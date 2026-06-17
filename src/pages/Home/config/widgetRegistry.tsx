import type { ReactNode } from 'react'
import { BarChartOutlined, ApartmentOutlined, UserOutlined, ThunderboltOutlined, TableOutlined } from '@ant-design/icons'
import type { WidgetType } from '../types/widget.types'
import { StatsCard } from '../components/StatsCard'
import { SubstationsStatsCard } from '../components/SubstationsStatsCard'
import { UserProfileCard } from '../components/UserProfileCard'
import { QuickActionsCard } from '../components/QuickActionsCard'
import { SubstationsTable } from '../components/SubstationsTable'
import type { DashboardStats, SubstationSummary } from '../types/dashboard.types'

export interface WidgetRenderContext {
  stats: DashboardStats
  substations: SubstationSummary[]
  totalComponents: number
  loading: boolean
}

export interface WidgetDefinition {
  type: WidgetType
  labelKey: string
  icon: ReactNode
  // Grid span — matches the previous Row/Col layout (24-column grid).
  colSpan: { xs: number; sm?: number; lg?: number }
  render: (ctx: WidgetRenderContext) => ReactNode
}

export const widgetRegistry: Record<WidgetType, WidgetDefinition> = {
  stats: {
    type: 'stats',
    labelKey: 'widgetStats',
    icon: <BarChartOutlined />,
    colSpan: { xs: 24, sm: 12, lg: 8 },
    render: (ctx) => <StatsCard totalNodes={ctx.stats.totalNodes} totalEdges={ctx.stats.totalEdges} />,
  },
  substationsStats: {
    type: 'substationsStats',
    labelKey: 'widgetSubstationsStats',
    icon: <ApartmentOutlined />,
    colSpan: { xs: 24, sm: 12, lg: 8 },
    render: (ctx) => (
      <SubstationsStatsCard
        substationCount={ctx.substations.length}
        totalComponents={ctx.totalComponents}
      />
    ),
  },
  userProfile: {
    type: 'userProfile',
    labelKey: 'widgetUserProfile',
    icon: <UserOutlined />,
    colSpan: { xs: 24, sm: 24, lg: 8 },
    render: () => <UserProfileCard />,
  },
  quickActions: {
    type: 'quickActions',
    labelKey: 'widgetQuickActions',
    icon: <ThunderboltOutlined />,
    colSpan: { xs: 24 },
    render: () => <QuickActionsCard />,
  },
  substationsTable: {
    type: 'substationsTable',
    labelKey: 'widgetSubstationsTable',
    icon: <TableOutlined />,
    colSpan: { xs: 24 },
    render: (ctx) => <SubstationsTable data={ctx.substations} loading={ctx.loading} />,
  },
}

export const allWidgetTypes: WidgetType[] = Object.keys(widgetRegistry) as WidgetType[]

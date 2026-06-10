import { apiService } from './api.service'

export interface MenuItem {
  id: string
  labelKey: string
  icon: string
  route: string
  permission?: string
  badge?: string
}

export interface MenuSection {
  id: string
  labelKey: string
  items: MenuItem[]
}

const ALLOWED_ICONS = new Set([
  'ti-layout-dashboard', 'ti-chart-bar', 'ti-users', 'ti-settings',
  'ti-shield', 'ti-help', 'ti-file', 'ti-folder', 'ti-bell',
  'ti-home', 'ti-star', 'ti-search', 'ti-plus', 'ti-edit',
  'ti-trash', 'ti-download', 'ti-upload', 'ti-calendar',
  'ti-git-branch', 'ti-topology-ring', 'ti-sitemap', 'ti-network',
])

export function sanitizeIcon(icon: string): string {
  return ALLOWED_ICONS.has(icon) ? icon : 'ti-file'
}

export async function fetchMenuSections(): Promise<MenuSection[]> {
  const raw = await apiService.get<MenuSection[]>('/menus')
  return raw.map((section) => ({
    ...section,
    items: section.items.map((item) => ({
      ...item,
      icon: sanitizeIcon(item.icon),
    })),
  }))
}

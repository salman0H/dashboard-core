/**
 * styleConfig — single source of truth for design tokens in JavaScript.
 *
 * These values mirror the CSS custom properties in globals.css.
 * Use this when you need raw values (e.g. Recharts colors, React Flow
 * edge stroke, SVG fill) where CSS variables can't be referenced directly.
 *
 * When you update a token here, update the matching CSS var in globals.css too.
 *
 * Usage:
 *   import { styleConfig } from '@/config/styleConfig'
 *   const stroke = styleConfig.colors.accent
 */

export const styleConfig = {
  // ── Colors ──────────────────────────────────────────────────────────────
  colors: {
    accent:        '#2563EB',
    accentHover:   '#1D4ED8',
    accentDim:     '#EFF6FF',
    accentText:    '#1D4ED8',

    success:       '#059669',
    successDim:    '#ECFDF5',
    warning:       '#D97706',
    warningDim:    '#FFFBEB',
    danger:        '#DC2626',
    dangerDim:     '#FEF2F2',
    info:          '#0891B2',
    infoDim:       '#ECFEFF',

    surface:       '#FFFFFF',
    surfaceRaised: '#F8FAFC',
    appBg:         '#F1F5F9',
    border:        '#E2E8F0',
    borderStrong:  '#CBD5E1',

    textPrimary:   '#0F172A',
    textSecondary: '#475569',
    textMuted:     '#94A3B8',
    textDisabled:  '#CBD5E1',
  },

  // ── Typography ──────────────────────────────────────────────────────────
  typography: {
    fontSans:   '"IBM Plex Sans", Vazirmatn, ui-sans-serif, system-ui',
    fontRtl:    'Vazirmatn, "IBM Plex Sans", ui-sans-serif, system-ui',
    fontMono:   '"IBM Plex Mono", ui-monospace',
    sizeXs:     '11px',
    sizeSm:     '12px',
    sizeBase:   '13px',
    sizeMd:     '14px',
    sizeLg:     '16px',
    sizeXl:     '18px',
    size2xl:    '20px',
    size3xl:    '24px',
    weightNormal:   400,
    weightMedium:   500,
    weightSemibold: 600,
    weightBold:     700,
  },

  // ── Spacing ─────────────────────────────────────────────────────────────
  spacing: {
    xs:     '4px',
    sm:     '8px',
    md:     '12px',
    lg:     '16px',
    xl:     '24px',
    '2xl':  '32px',
    '3xl':  '48px',
    contentPadding: '24px',
    topbarHeight:   '60px',
    sidebarWidth:   '260px',
  },

  // ── Shape ───────────────────────────────────────────────────────────────
  radii: {
    sm:   '6px',
    base: '8px',
    lg:   '12px',
    xl:   '16px',
    full: '9999px',
  },

  // ── Elevation ───────────────────────────────────────────────────────────
  shadows: {
    xs:  '0 1px 2px rgba(0,0,0,.05)',
    sm:  '0 1px 3px rgba(0,0,0,.08), 0 1px 2px rgba(0,0,0,.06)',
    md:  '0 4px 6px -1px rgba(0,0,0,.08), 0 2px 4px -2px rgba(0,0,0,.05)',
    lg:  '0 10px 15px -3px rgba(0,0,0,.08), 0 4px 6px -4px rgba(0,0,0,.05)',
    xl:  '0 20px 25px -5px rgba(0,0,0,.08), 0 8px 10px -6px rgba(0,0,0,.05)',
  },

  // ── Motion ──────────────────────────────────────────────────────────────
  motion: {
    durationFast:  150,   // ms
    duration:      200,
    durationSlow:  300,
    ease:         'cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // ── Z-index ─────────────────────────────────────────────────────────────
  zIndex: {
    sidebar:  40,
    topbar:   50,
    modal:    100,
    tooltip:  200,
  },
} as const

// ── Chart palette ─────────────────────────────────────────────────────────
// Accessible 8-color palette safe on both light background and screen
export const chartPalette = [
  '#2563EB', // accent blue
  '#059669', // success green
  '#D97706', // warning amber
  '#DC2626', // danger red
  '#0891B2', // info cyan
  '#7C3AED', // violet
  '#DB2777', // pink
  '#65A30D', // lime
] as const

// ── Semantic status mapping ───────────────────────────────────────────────
export const statusColor: Record<string, string> = {
  active:      styleConfig.colors.success,
  online:      styleConfig.colors.success,
  done:        styleConfig.colors.success,
  warning:     styleConfig.colors.warning,
  maintenance: styleConfig.colors.warning,
  inactive:    styleConfig.colors.textMuted,
  offline:     styleConfig.colors.textMuted,
  danger:      styleConfig.colors.danger,
  fault:       styleConfig.colors.danger,
  blocked:     styleConfig.colors.danger,
  info:        styleConfig.colors.info,
  inProgress:  styleConfig.colors.accent,
}

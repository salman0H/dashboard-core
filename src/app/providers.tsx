import { type ReactNode } from 'react'
import { AppProvider } from '@/context/AppContext'
import { ErrorBoundary } from '@/components/primitives/ErrorBoundary/ErrorBoundary'
// i18n must be imported for its side-effect (initialization) before any component uses it
import '@/config/i18n'

/**
 * AppProviders — wraps the entire tree with all context providers.
 * No Suspense needed here since react.useSuspense is false in i18n config —
 * components render immediately and show keys briefly until translations load.
 * ErrorBoundary catches any uncaught errors from the full tree.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <AppProvider>
        {children}
      </AppProvider>
    </ErrorBoundary>
  )
}

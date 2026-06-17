// src/app/providers.tsx
import { type ReactNode } from 'react'
import { AppProvider } from '@/context/AppContext'
import { ErrorBoundary } from '@/components/primitives/ErrorBoundary/ErrorBoundary'
import { ConfigProvider } from 'antd'
import faIR from 'antd/locale/fa_IR'
import enUS from 'antd/locale/en_US'
import { useAppContext } from '@/context/AppContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import '@/config/i18n'

// Single shared QueryClient for the whole app — created once, outside the
// component tree, so it survives re-renders.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

function AntDesignProvider({ children }: { children: ReactNode }) {
  const { lang, dir } = useAppContext()
  const locale = lang === 'fa' ? faIR : enUS

  return (
    <ConfigProvider
      direction={dir}
      locale={locale}
      theme={{
        token: {
          fontFamily: dir === 'rtl' ? 'Vazirmatn, sans-serif' : 'IBM Plex Sans, sans-serif',
        },
      }}
    >
      {children}
    </ConfigProvider>
  )
}

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <AntDesignProvider>
            {children}
          </AntDesignProvider>
        </AppProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
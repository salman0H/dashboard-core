// src/app/providers.tsx
import { type ReactNode } from 'react'
import { AppProvider } from '@/context/AppContext'
import { ErrorBoundary } from '@/components/primitives/ErrorBoundary/ErrorBoundary'
import { ConfigProvider } from 'antd'
import faIR from 'antd/locale/fa_IR'
import enUS from 'antd/locale/en_US'
import { useAppContext } from '@/context/AppContext'
import '@/config/i18n'

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
      <AppProvider>
        <AntDesignProvider>
          {children}
        </AntDesignProvider>
      </AppProvider>
    </ErrorBoundary>
  )
}
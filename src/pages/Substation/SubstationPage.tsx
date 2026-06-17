import { useDiagramData } from './hooks/useDiagramData'
import { DiagramCanvas } from './components/DiagramCanvas'
import { Spin, Alert, Result, ConfigProvider } from 'antd'
import { useTranslation } from 'react-i18next'
import { useAppContext } from '@/context/AppContext'

function SubstationContent() {
  const { t } = useTranslation('substation')
  const { data, isLoading, error } = useDiagramData(3000)

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Spin size="large" tip={t('loading')} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <Alert
          message={t('error')}
          description={(error as Error).message}
          type="error"
          showIcon
          style={{ maxWidth: 500 }}
        />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Result
          status="info"
          title={t('noData')}
          subTitle={t('noDataDescription')}
        />
      </div>
    )
  }

  return (
    <div className="flex-1 bg-white overflow-hidden">
      <DiagramCanvas data={data} width={2400} height={1200} />
    </div>
  )
}

export function SubstationPage() {
  const { dir } = useAppContext()

  // Note: no QueryClientProvider here — the app-level provider in
  // src/app/providers.tsx already supplies a shared QueryClient.
  return (
    <ConfigProvider direction={dir}>
      <div className="flex flex-col" style={{ height: 'calc(100vh - 52px)' }}>
        <SubstationContent />
      </div>
    </ConfigProvider>
  )
}
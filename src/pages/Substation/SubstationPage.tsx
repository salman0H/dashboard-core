import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useDiagramData } from './hooks/useDiagramData'
import { DiagramCanvas } from './components/DiagramCanvas'

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: true, retry: 1 } },
})

/**
 * SubstationPage — wraps the substation-diagram project for the dashboard shell.
 * Fetches from /api/substation/diagram (proxied to json-server port 3001).
 */
function SubstationContent() {
  const { data, isLoading, error } = useDiagramData(3000)

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-sm text-slate-500">در حال بارگذاری دیاگرام...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-red-600 text-sm">خطا: {(error as Error).message}</div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-sm text-slate-400">داده‌ای موجود نیست</div>
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
  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 52px)' }}>
      <QueryClientProvider client={queryClient}>
        <SubstationContent />
      </QueryClientProvider>
    </div>
  )
}

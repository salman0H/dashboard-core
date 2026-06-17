import { useDashboardData } from '@/pages/Home/hooks/useDashboardData';
import { useDashboardWidgets } from '@/pages/Home/hooks/useDashboardWidgets';
import { useAppContext } from '@/context/AppContext';
import { ConfigProvider, theme, Skeleton, Alert } from 'antd';
import { DashboardHeader } from './components/DashboardHeader';
import { DashboardGrid } from './components/DashboardGrid';

export function HomePage() {
  const { dir } = useAppContext();
  const isRtl = dir === 'rtl';
  const { data, isLoading, error } = useDashboardData();
  const {
    widgets,
    loading: widgetsLoading,
    error: widgetsError,
    reorder,
    addWidget,
    removeWidget,
  } = useDashboardWidgets();

  if (isLoading || widgetsLoading) {
    return (
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        <Alert message="Error loading dashboard" description={(error as Error).message} type="error" showIcon />
      </div>
    );
  }

  const { stats, substations } = data || { stats: { totalNodes: 0, totalEdges: 0 }, substations: [] };
  const totalComponents = substations.reduce((acc, s) => acc + s.componentCount, 0);

  return (
    <ConfigProvider
      direction={dir}
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          fontFamily: isRtl ? 'Vazirmatn, sans-serif' : 'IBM Plex Sans, sans-serif',
        },
      }}
    >
      <div className={`p-4 md:p-6 max-w-7xl mx-auto ${isRtl ? 'font-rtl' : ''}`} dir={dir}>
        <DashboardHeader />
        <DashboardGrid
          widgets={widgets}
          renderContext={{ stats, substations, totalComponents, loading: isLoading }}
          error={widgetsError}
          onReorder={reorder}
          onAddWidget={addWidget}
          onRemoveWidget={removeWidget}
        />
      </div>
    </ConfigProvider>
  );
}

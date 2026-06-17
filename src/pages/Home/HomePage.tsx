import { useDashboardData } from '@/pages/Home/hooks/useDashboardData';
import { useAppContext } from '@/context/AppContext';
import { ConfigProvider, theme, Row, Col, Skeleton, Alert } from 'antd';
import { DashboardHeader } from './components/DashboardHeader';
import { StatsCard } from './components/StatsCard';
import { SubstationsStatsCard } from './components/SubstationsStatsCard';
import { UserProfileCard } from './components/UserProfileCard';
import { QuickActionsCard } from './components/QuickActionsCard';
import { SubstationsTable } from './components/SubstationsTable';

export function HomePage() {
  const { dir } = useAppContext();
  const isRtl = dir === 'rtl';
  const { data, isLoading, error } = useDashboardData();

  if (isLoading) {
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
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={8}>
            <StatsCard totalNodes={stats.totalNodes} totalEdges={stats.totalEdges} />
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <SubstationsStatsCard substationCount={substations.length} totalComponents={totalComponents} />
          </Col>
          <Col xs={24} sm={24} lg={8}>
            <UserProfileCard />
          </Col>
          <Col span={24}>
            <QuickActionsCard />
          </Col>
          <Col span={24}>
            <SubstationsTable data={substations} loading={isLoading} />
          </Col>
        </Row>
      </div>
    </ConfigProvider>
  );
}
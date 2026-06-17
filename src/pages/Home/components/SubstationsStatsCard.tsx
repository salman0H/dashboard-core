import { Card, Statistic, Tag } from 'antd';
import { ApartmentOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

interface SubstationsStatsCardProps {
  substationCount: number;
  totalComponents: number;
}

export const SubstationsStatsCard = ({ substationCount, totalComponents }: SubstationsStatsCardProps) => {
  const { t } = useTranslation('dashboard');
  return (
    <Card variant="borderless" className="shadow-sm hover:shadow-md transition-shadow h-full">
      <Statistic
        title={t('substations')}
        value={substationCount}
        prefix={<ApartmentOutlined style={{ color: '#52c41a' }} />}
        styles={{ content: { color: '#52c41a' } }}
      />
      <div className="mt-4">
        <Tag color="green">{t('activeSubstations')}</Tag>
        <Tag color="default">{t('totalComponents')}: {totalComponents}</Tag>
      </div>
    </Card>
  );
};
import { Card, Statistic, Divider, Flex, Typography } from 'antd';
import { NodeIndexOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Text } = Typography;

interface StatsCardProps {
  totalNodes: number;
  totalEdges: number;
}

export const StatsCard = ({ totalNodes, totalEdges }: StatsCardProps) => {
  const { t } = useTranslation('dashboard');
  return (
    <Card variant="borderless" className="shadow-sm hover:shadow-md transition-shadow">
      <Statistic
        title={t('flowTitle')}
        value={totalNodes + totalEdges}
        prefix={<NodeIndexOutlined style={{ color: '#1677ff' }} />}
        styles={{ content: { color: '#1677ff' } }}
      />
      <Divider style={{ margin: '12px 0' }} />
      <Flex justify="space-between">
        <Text type="secondary" style={{ fontSize: '12px' }}>
          {t('totalNodesLabel')}: <Text strong>{totalNodes}</Text>
        </Text>
        <Text type="secondary" style={{ fontSize: '12px' }}>
          {t('totalEdgesLabel')}: <Text strong>{totalEdges}</Text>
        </Text>
      </Flex>
    </Card>
  );
};
import { Flex, Typography, Button, Space, Grid } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

export const DashboardHeader = () => {
  const { t } = useTranslation('dashboard');
  const navigate = useNavigate();
  const screens = useBreakpoint();

  return (
    <div className="mb-8">
      <Flex vertical={!screens.md} justify="space-between" align={screens.md ? 'center' : 'start'} gap="middle">
        <div>
          <Title level={2} style={{ margin: 0 }}>{t('pageTitle')}</Title>
          <Text type="secondary" style={{ fontSize: '14px' }}>{t('pageSubtitle')}</Text>
        </div>
        <Space wrap>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/flow-progress')}>
            {t('createNew')}
          </Button>
        </Space>
      </Flex>
    </div>
  );
};
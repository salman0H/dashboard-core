import { Card, Flex, Space, Button, Typography } from 'antd';
import { EditOutlined, FolderOutlined, ApartmentOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;

export const QuickActionsCard = () => {
  const { t } = useTranslation('dashboard');
  const navigate = useNavigate();
  return (
    <Card variant="borderless" className="shadow-sm">
      <Flex wrap gap="middle" align="center" justify="space-between">
        <Text strong style={{ fontSize: '15px' }}>{t('quickActions')}</Text>
        <Space wrap size="middle">
          <Button type="primary" icon={<EditOutlined />} onClick={() => navigate('/flow-progress')}>
            {t('editFlowchart')}
          </Button>
          <Button icon={<FolderOutlined />} onClick={() => navigate('/tree-node')}>
            {t('manageTree')}
          </Button>
          <Button icon={<ApartmentOutlined />} onClick={() => navigate('/substation')}>
            {t('viewDiagram')}
          </Button>
        </Space>
      </Flex>
    </Card>
  );
};
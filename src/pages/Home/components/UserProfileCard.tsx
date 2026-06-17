import { Card, Avatar, Typography, Divider, Button, Flex } from 'antd';
import { UserOutlined, SettingOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

export const UserProfileCard = () => {
  const { t } = useTranslation('common');
  return (
    <Card variant="borderless" className="shadow-sm hover:shadow-md transition-shadow h-full">
      <Flex vertical gap="small" align="center" justify="center" style={{ height: '100%' }}>
        <Avatar size={56} icon={<UserOutlined />} style={{ backgroundColor: '#e6f4ff', color: '#1677ff' }} />
        <Title level={5} style={{ margin: 0 }}>{t('userName')}</Title>
        <Text type="secondary" style={{ fontSize: '13px' }}>{t('userRole')}</Text>
        <Divider style={{ margin: '8px 0' }} />
        <Button type="text" icon={<SettingOutlined />} block>
          {t('settings')}
        </Button>
      </Flex>
    </Card>
  );
};
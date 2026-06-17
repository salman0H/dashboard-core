import { Card, Table, Space, Typography, Tag, Badge, Tooltip, Button } from 'antd';
import { ApartmentOutlined, ThunderboltOutlined, RightOutlined, EyeOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { SubstationSummary } from '@/types/dashboard.types';

const { Text } = Typography;

interface SubstationsTableProps {
  data: SubstationSummary[];
  loading: boolean;
}

export const SubstationsTable = ({ data, loading }: SubstationsTableProps) => {
  const { t } = useTranslation('dashboard');
  const navigate = useNavigate();

  const columns = [
    {
      title: t('substationName'),
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => (
        <Space>
          <ApartmentOutlined style={{ color: '#1677ff' }} />
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: t('location'),
      dataIndex: 'location',
      key: 'location',
      render: (text: string) => <Text type="secondary">{text}</Text>,
    },
    {
      title: t('componentCount'),
      dataIndex: 'componentCount',
      key: 'componentCount',
      render: (count: number) => <Badge count={count} showZero color="#1677ff" />,
    },
    {
      title: t('actions'),
      key: 'action',
      align: 'center' as const,
      render: (_: any, record: SubstationSummary) => (
        <Tooltip title={t('viewDiagram')}>
          <Button
            type="primary"
            shape="circle"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => navigate('/substation')}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <Card
      variant="borderless"
      className="shadow-sm"
      title={
        <Space>
          <ThunderboltOutlined style={{ color: '#1677ff' }} />
          <Text strong>{t('substations')}</Text>
          <Tag color="blue" variant="filled">{data.length}</Tag>
        </Space>
      }
      extra={
        <Button type="link" onClick={() => navigate('/substation')}>
          {t('viewAll')} <RightOutlined />
        </Button>
      }
    >
      <Table
        dataSource={data}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '10', '20'] }}
        size="middle"
        scroll={{ x: 'max-content' }}
      />
    </Card>
  );
};
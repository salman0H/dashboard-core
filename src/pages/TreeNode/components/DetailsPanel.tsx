// src/pages/TreeNode/components/DetailsPanel.tsx
import { useTranslation } from 'react-i18next'
import { NodeDetails } from '../types'
import { Card, Descriptions, Skeleton, Empty, Tag, Space } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'

interface DetailsPanelProps {
  details: NodeDetails | null
  loading: boolean
  error: string | null
}

export function DetailsPanel({ details, loading, error }: DetailsPanelProps) {
  const { t } = useTranslation('tree')

  if (loading) {
    return (
      <Card className="h-full shadow-sm" bordered={false}>
        <Skeleton active paragraph={{ rows: 8 }} />
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="h-full shadow-sm" bordered={false}>
        <div className="text-center text-red-600">{t('error')}</div>
        <div className="text-sm text-gray-500">{error}</div>
      </Card>
    )
  }

  if (!details) {
    return (
      <Card className="h-full shadow-sm flex items-center justify-center" bordered={false}>
        <Empty
          image={<InfoCircleOutlined style={{ fontSize: 48, color: '#bfbfbf' }} />}
          description={<span className="text-gray-500">{t('selectNodeHint')}</span>}
        />
      </Card>
    )
  }

  return (
    <Card
      className="h-full shadow-sm overflow-auto"
      bordered={false}
      title={<Space><InfoCircleOutlined /> {t('nodeDetails')}</Space>}
    >
      <Descriptions column={1} bordered size="small" className="mt-2">
        <Descriptions.Item label={t('name')}>{details.name}</Descriptions.Item>
        <Descriptions.Item label={t('type')}><Tag color="blue">{details.type}</Tag></Descriptions.Item>
        <Descriptions.Item label={t('owner')}>{details.owner}</Descriptions.Item>
        <Descriptions.Item label={t('createdDate')}>{details.createdDate}</Descriptions.Item>
        <Descriptions.Item label={t('size')}>{details.size}</Descriptions.Item>
        <Descriptions.Item label={t('permissions')}><Tag color="green">{details.permissions}</Tag></Descriptions.Item>
        <Descriptions.Item label={t('description')}>{details.description}</Descriptions.Item>
        <Descriptions.Item label={t('nodeId')}><span className="font-mono text-xs">{details.id}</span></Descriptions.Item>
      </Descriptions>
    </Card>
  )
}
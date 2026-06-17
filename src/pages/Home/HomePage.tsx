// src/pages/Home/HomePage.tsx
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '@/context/AppContext'
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Button,
  Typography,
  Space,
  Avatar,
  Tag,
  Divider,
  Grid,
  Badge,
  Tooltip,
  Flex,
  ConfigProvider,
  theme,
} from 'antd'
import {
  NodeIndexOutlined,
  ShareAltOutlined,
  UserOutlined,
  SettingOutlined,
  ApartmentOutlined,
  RightOutlined,
  ThunderboltOutlined,
  DatabaseOutlined,
  PlusOutlined,
  EditOutlined,
  FolderOutlined,
  EyeOutlined,
} from '@ant-design/icons'

const { Title, Text, Paragraph } = Typography
const { useBreakpoint } = Grid

interface DashboardStats {
  totalNodes: number
  totalEdges: number
}

interface SubstationSummary {
  id: string
  name: string
  location: string
  componentCount: number
}

export function HomePage() {
  const { t } = useTranslation(['dashboard', 'common'])
  const navigate = useNavigate()
  const { dir } = useAppContext()
  const screens = useBreakpoint()
  const isRtl = dir === 'rtl'

  const [stats, setStats] = useState<DashboardStats>({ totalNodes: 0, totalEdges: 0 })
  const [substations, setSubstations] = useState<SubstationSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [nodesRes, edgesRes, diagramRes] = await Promise.all([
          fetch('/api/flow/nodes'),
          fetch('/api/flow/edges'),
          fetch('/api/substation/diagram'),
        ])
        const nodes = await nodesRes.json()
        const edges = await edgesRes.json()
        const diagram = await diagramRes.json()

        setStats({
          totalNodes: nodes.length,
          totalEdges: edges.length,
        })

        const substationList = diagram.substations.map((sub: any) => ({
          id: sub.id,
          name: sub.name,
          location: sub.tooltipInfo?.Location || '—',
          componentCount: diagram.components.filter((c: any) => c.substationId === sub.id).length,
        }))
        setSubstations(substationList)
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const columns = [
    {
      title: t('dashboard:substationName'),
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
      title: t('dashboard:location'),
      dataIndex: 'location',
      key: 'location',
      render: (text: string) => <Text type="secondary">{text}</Text>,
    },
    {
      title: t('dashboard:componentCount'),
      dataIndex: 'componentCount',
      key: 'componentCount',
      render: (count: number) => <Badge count={count} showZero color="#1677ff" />,
    },
    {
      title: t('dashboard:actions'),
      key: 'action',
      align: 'center' as const,
      render: (_: any, record: SubstationSummary) => (
        <Tooltip title={t('dashboard:viewDiagram')}>
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
  ]

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
        {/* Header Section */}
        <div className="mb-8">
          <Flex vertical={!screens.md} justify="space-between" align={screens.md ? 'center' : 'start'} gap="middle">
            <div>
              <Title level={2} style={{ margin: 0 }}>
                {t('dashboard:pageTitle')}
              </Title>
              <Text type="secondary" style={{ fontSize: '14px' }}>
                {t('dashboard:pageSubtitle')}
              </Text>
            </div>
            <Space wrap>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/flow-progress')}>
                {t('dashboard:createNew')}
              </Button>
            </Space>
          </Flex>
        </div>

        <Row gutter={[16, 16]}>
          {/* Stats Cards */}
          <Col xs={24} sm={12} lg={8}>
            <Card variant="borderless" className="shadow-sm hover:shadow-md transition-shadow">
              <Statistic
                title={t('dashboard:flowTitle')}
                value={stats.totalNodes + stats.totalEdges}
                prefix={<NodeIndexOutlined style={{ color: '#1677ff' }} />}
                styles={{ content: { color: '#1677ff' } }}
              />
              <Divider style={{ margin: '12px 0' }} />
              <Flex justify="space-between">
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {t('dashboard:totalNodesLabel')}: <Text strong>{stats.totalNodes}</Text>
                </Text>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {t('dashboard:totalEdgesLabel')}: <Text strong>{stats.totalEdges}</Text>
                </Text>
              </Flex>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={8}>
            <Card variant="borderless" className="shadow-sm hover:shadow-md transition-shadow h-full">
              <Statistic
                title={t('dashboard:substations')}
                value={substations.length}
                prefix={<ApartmentOutlined style={{ color: '#52c41a' }} />}
                styles={{ content: { color: '#52c41a' } }}
              />
              <div className="mt-4">
                <Tag color="green">{t('dashboard:activeSubstations')}</Tag>
                <Tag color="default">{t('dashboard:totalComponents')}: {substations.reduce((acc, s) => acc + s.componentCount, 0)}</Tag>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={24} lg={8}>
            <Card variant="borderless" className="shadow-sm hover:shadow-md transition-shadow h-full">
              <Flex vertical gap="small" align="center" justify="center" style={{ height: '100%' }}>
                <Avatar size={56} icon={<UserOutlined />} style={{ backgroundColor: '#e6f4ff', color: '#1677ff' }} />
                <Title level={5} style={{ margin: 0 }}>{t('common:userName')}</Title>
                <Text type="secondary" style={{ fontSize: '13px' }}>{t('common:userRole')}</Text>
                <Divider style={{ margin: '8px 0' }} />
                <Button type="text" icon={<SettingOutlined />} block>
                  {t('common:settings')}
                </Button>
              </Flex>
            </Card>
          </Col>

          {/* Quick Actions Cards */}
          <Col span={24}>
            <Card variant="borderless" className="shadow-sm">
              <Flex wrap gap="middle" align="center" justify="space-between">
                <Text strong style={{ fontSize: '15px' }}>
                  {t('dashboard:quickActions')}
                </Text>
                <Space wrap size="middle">
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => navigate('/flow-progress')}
                  >
                    {t('dashboard:editFlowchart')}
                  </Button>
                  <Button
                    icon={<FolderOutlined />}
                    onClick={() => navigate('/tree-node')}
                  >
                    {t('dashboard:manageTree')}
                  </Button>
                  <Button
                    icon={<ApartmentOutlined />}
                    onClick={() => navigate('/substation')}
                  >
                    {t('dashboard:viewDiagram')}
                  </Button>
                </Space>
              </Flex>
            </Card>
          </Col>

          {/* Substations Table */}
          <Col span={24}>
            <Card
              variant="borderless"
              className="shadow-sm"
              title={
                <Space>
                  <ThunderboltOutlined style={{ color: '#1677ff' }} />
                  <Text strong>{t('dashboard:substations')}</Text>
                  <Tag color="blue" variant="filled">{substations.length}</Tag>
                </Space>
              }
              extra={
                <Button type="link" onClick={() => navigate('/substation')}>
                  {t('dashboard:viewAll')} <RightOutlined />
                </Button>
              }
            >
              <Table
                dataSource={substations}
                columns={columns}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '10', '20'] }}
                size="middle"
                scroll={{ x: 'max-content' }}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </ConfigProvider>
  )
}
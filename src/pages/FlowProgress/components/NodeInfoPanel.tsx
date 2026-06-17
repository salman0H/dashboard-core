// src/pages/FlowProgress/components/NodeInfoPanel.tsx
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import * as api from '../services/api'
import { useAppContext } from '@/context/AppContext'
import { Card, Typography, Tag, Space, Spin, Button, Alert, Divider, Descriptions, Skeleton } from 'antd'
import { CloseOutlined, InfoCircleOutlined } from '@ant-design/icons'

const { Text, Title } = Typography

interface NodeInfoPanelProps {
  selectedNodeId: string | null
  onClose: () => void
  onNodeUpdate?: () => void
}

export const NodeInfoPanel = ({ selectedNodeId, onClose, onNodeUpdate }: NodeInfoPanelProps) => {
  const { t } = useTranslation(['flow', 'common'])
  const { dir } = useAppContext()
  const isRtl = dir === 'rtl'

  const side = isRtl ? 'left' : 'right'

  const [formData, setFormData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (selectedNodeId) {
      loadNodeInfo()
    }
  }, [selectedNodeId])

  const loadNodeInfo = async () => {
    if (!selectedNodeId) return
    setLoading(true)
    setError(null)
    try {
      const [nodes, edges, formDataList] = await Promise.all([
        api.fetchEnrichedNodes(),
        api.fetchEdges(),
        api.fetchAllFormData(),
      ])

      const node = nodes.find((n) => n.id === selectedNodeId)
      if (!node) {
        setError(t('common:error'))
        return
      }
      const nodeFormData = formDataList.find((fd) => fd.id === node.formDataId)
      const incomingEdges = edges.filter((e) => e.target === selectedNodeId)
      const outgoingEdges = edges.filter((e) => e.source === selectedNodeId)

      const incomingNodes = incomingEdges.map((edge) => {
        const sourceNode = nodes.find((n) => n.id === edge.source)
        return {
          id: edge.source,
          name: sourceNode?.data?.label || sourceNode?.id || edge.source,
          type: sourceNode?.type,
        }
      })

      const outgoingNodes = outgoingEdges.map((edge) => {
        const targetNode = nodes.find((n) => n.id === edge.target)
        return {
          id: edge.target,
          name: targetNode?.data?.label || targetNode?.id || edge.target,
          type: targetNode?.type,
        }
      })

      setFormData({
        node,
        formData: nodeFormData,
        connections: { incoming: incomingNodes, outgoing: outgoingNodes },
      })
    } catch (err) {
      console.error('Failed to load node info:', err)
      setError(t('common:error_loading'))
    } finally {
      setLoading(false)
    }
  }

  if (!selectedNodeId) return null

  const typeColor = {
    start: 'blue',
    process: 'green',
    input: 'purple',
    decision: 'orange',
  }[formData?.node?.type] || 'default'

  return (
    <div
      className="fixed top-1/2 -translate-y-1/2 w-96 bg-white rounded-2xl shadow-xl border border-gray-200 z-20 max-h-[80vh] overflow-y-auto"
      style={{ [side]: '16px' }}
    >
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
        <Title level={5} style={{ margin: 0 }}>{t('common:node_information')}</Title>
        <Button type="text" icon={<CloseOutlined />} onClick={onClose} />
      </div>

      <div className="p-4">
        {loading && <Skeleton active paragraph={{ rows: 6 }} />}

        {error && (
          <Alert message={error} type="error" showIcon />
        )}

        {!loading && !error && formData && (
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Descriptions column={1} size="small" bordered>
              <Descriptions.Item label={t('flow:id')}>
                <Text code>{formData.node?.id}</Text>
              </Descriptions.Item>
              <Descriptions.Item label={t('flow:position')}>
                ({formData.node?.position.x}, {formData.node?.position.y})
              </Descriptions.Item>
              <Descriptions.Item label={t('common:select_node_type')}>
                <Tag color={typeColor}>{t(formData.node?.type)}</Tag>
              </Descriptions.Item>
            </Descriptions>

            {formData.formData ? (
              <>
                <Divider style={{ margin: '8px 0' }} />
                <Descriptions column={1} size="small" bordered>
                  <Descriptions.Item label={t('common:label')}>
                    <Text strong>{formData.formData.label}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label={t('common:execution_process')}>
                    {formData.formData.executionProcess}
                  </Descriptions.Item>
                  <Descriptions.Item label={t('common:final_process')}>
                    <Tag color={formData.formData.finalProcess === 'yes' ? 'green' : 'gold'}>
                      {formData.formData.finalProcess || t('common:not_specified')}
                    </Tag>
                  </Descriptions.Item>
                  {formData.formData.description && (
                    <Descriptions.Item label={t('common:description')}>
                      <Text type="secondary">{formData.formData.description}</Text>
                    </Descriptions.Item>
                  )}
                </Descriptions>

                <Divider style={{ margin: '8px 0' }} />
                <div>
                  <Text strong>{t('common:connections')}</Text>
                  {formData.connections.incoming.length > 0 && (
                    <div className="mt-2">
                      <Text type="secondary" style={{ fontSize: '12px' }}>{t('common:previous_process')}:</Text>
                      <div className="mt-1">
                        {formData.connections.incoming.map((node: any) => (
                          <Tag key={node.id} color="green">{node.name} ({t(node.type)})</Tag>
                        ))}
                      </div>
                    </div>
                  )}
                  {formData.connections.outgoing.length > 0 && (
                    <div className="mt-2">
                      <Text type="secondary" style={{ fontSize: '12px' }}>{t('common:next_process')}:</Text>
                      <div className="mt-1">
                        {formData.connections.outgoing.map((node: any) => (
                          <Tag key={node.id} color="blue">{node.name} ({t(node.type)})</Tag>
                        ))}
                      </div>
                    </div>
                  )}
                  {formData.connections.incoming.length === 0 && formData.connections.outgoing.length === 0 && (
                    <Text type="secondary" className="text-sm">{t('common:no_connections')}</Text>
                  )}
                </div>
              </>
            ) : (
              <Alert message={t('common:no_form_data')} type="warning" showIcon />
            )}
          </Space>
        )}
      </div>
    </div>
  )
}
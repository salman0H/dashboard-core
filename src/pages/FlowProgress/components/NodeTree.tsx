// src/pages/FlowProgress/components/NodeTree.tsx
import { type Node, type Edge } from '@xyflow/react'
import { useState } from 'react'
import { useAppContext } from '@/context/AppContext'
import { useTranslation } from 'react-i18next'
import { Button, Flex, Typography, Tag, Space } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, CaretRightOutlined, CaretDownOutlined } from '@ant-design/icons'

const { Text } = Typography

interface NodeTreeProps {
  nodes: Node[]
  edges: Edge[]
  onAddChild: (parentId: string) => void
  onEditNode: (nodeId: string) => void
  onDeleteNode: (nodeId: string) => void
}

interface TreeNodeProps {
  node: Node
  level: number
  onAddChild: (parentId: string) => void
  onEditNode: (nodeId: string) => void
  onDeleteNode: (nodeId: string) => void
  allNodes: Node[]
  isRtl: boolean
  t: (key: string) => string
}

const TreeNodeItem = ({
  node,
  level,
  onAddChild,
  onEditNode,
  onDeleteNode,
  allNodes,
  isRtl,
  t,
}: TreeNodeProps) => {
  const children = allNodes.filter((n) => n.parentId === node.id)
  const [isExpanded, setIsExpanded] = useState(true)

  const label = node.data?.label ?? node.id
  const typeLabel = t(node.type as string) || node.type

  const indentStyle = isRtl
    ? { paddingRight: `${level * 20 + 8}px` }
    : { paddingLeft: `${level * 20 + 8}px` }

  const typeColor = {
    start: 'blue',
    process: 'green',
    input: 'purple',
    decision: 'orange',
  }[node.type as string] || 'default'

  return (
    <div>
      <div className="py-1.5 border-b border-gray-100" style={indentStyle}>
        <Flex align="center" gap="small" justify={isRtl ? 'end' : 'start'}>
          {children.length > 0 ? (
            <Button
              type="text"
              size="small"
              icon={isExpanded ? <CaretDownOutlined /> : <CaretRightOutlined />}
              onClick={() => setIsExpanded(!isExpanded)}
              className="!w-5 !h-5 !p-0 !flex items-center justify-center text-gray-400"
            />
          ) : (
            <span className="w-5 flex-shrink-0 text-gray-300 text-center">·</span>
          )}
          <div
            className="flex-1 min-w-0 cursor-pointer hover:text-blue-600"
            onClick={() => onEditNode(node.id)}
          >
            <div className="text-sm font-medium text-gray-800 truncate text-end">{label}</div>
            <div className="text-[11px] text-gray-400 text-end">
              <Tag color={typeColor} size="small">{typeLabel}</Tag>
            </div>
          </div>
          <Space size="small">
            <Button
              type="primary"
              size="small"
              icon={<PlusOutlined />}
              onClick={() => onAddChild(node.id)}
              title={t('common:addChild')}
            />
            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={() => onEditNode(node.id)}
              title={t('common:edit')}
            />
            <Button
              danger
              size="small"
              icon={<DeleteOutlined />}
              onClick={() => onDeleteNode(node.id)}
              title={t('common:delete')}
            />
          </Space>
        </Flex>
      </div>
      {isExpanded && children.length > 0 && (
        <div>
          {children.map((child) => (
            <TreeNodeItem
              key={child.id}
              node={child}
              level={level + 1}
              onAddChild={onAddChild}
              onEditNode={onEditNode}
              onDeleteNode={onDeleteNode}
              allNodes={allNodes}
              isRtl={isRtl}
              t={t}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export const NodeTree = ({ nodes, edges, onAddChild, onEditNode, onDeleteNode }: NodeTreeProps) => {
  const { dir } = useAppContext()
  const { t } = useTranslation(['flow', 'common'])
  const isRtl = dir === 'rtl'
  const rootNodes = nodes.filter((n) => !n.parentId)

  if (nodes.length === 0) {
    return <div className="text-center text-gray-400 text-xs py-4">{t('common:noData')}</div>
  }

  return (
    <div className="overflow-y-auto text-end" dir={dir}>
      <div className="text-[11px] text-gray-400 border-b border-gray-100 pb-1 mb-2 px-1">
        <Space split="|">
          <Text type="secondary">{t('flow:nodesCount')}: {nodes.length}</Text>
          <Text type="secondary">{t('flow:edgesCount')}: {edges.length}</Text>
        </Space>
      </div>
      {rootNodes.map((node) => (
        <TreeNodeItem
          key={node.id}
          node={node}
          level={0}
          onAddChild={onAddChild}
          onEditNode={onEditNode}
          onDeleteNode={onDeleteNode}
          allNodes={nodes}
          isRtl={isRtl}
          t={t}
        />
      ))}
    </div>
  )
}
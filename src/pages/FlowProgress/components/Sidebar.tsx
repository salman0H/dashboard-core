// src/pages/FlowProgress/components/Sidebar.tsx
import { useState } from 'react'
import { type Node, type Edge } from '@xyflow/react'
import { NodeTree } from './NodeTree'
import { SelectChildTypeModal } from './SelectChildTypeModal'
import { useAppContext } from '@/context/AppContext'
import { useTranslation } from 'react-i18next'
import { Card, Button, Select, Typography, Flex, Badge } from 'antd'
import { PlusOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'

const { Text } = Typography

interface SidebarProps {
  nodes: Node[]
  edges: Edge[]
  onAddNode: (type: 'start' | 'process' | 'input' | 'decision') => void
  onAddChild: (parentId: string, type: 'start' | 'process' | 'input' | 'decision') => void
  onEditNode: (nodeId: string) => void
  onDeleteNode: (nodeId: string) => void
}

export const Sidebar = ({
  nodes,
  edges,
  onAddNode,
  onAddChild,
  onEditNode,
  onDeleteNode,
}: SidebarProps) => {
  const { dir } = useAppContext()
  const { t } = useTranslation(['flow', 'common'])
  const isRtl = dir === 'rtl'

  const [isExpanded, setIsExpanded] = useState(true)
  const [selectedNodeType, setSelectedNodeType] = useState<'start' | 'process' | 'input' | 'decision'>('process')
  const [showTypeModal, setShowTypeModal] = useState(false)
  const [pendingParentId, setPendingParentId] = useState<string | null>(null)

  const edgeStyle = isRtl ? { right: 0 } : { left: 0 }
  const sideBarWidth = isExpanded ? 'w-[30%]' : 'w-[3.5%]'
  const sideBarHeight = !isExpanded ? 'h-[5%]' : ''

  const typeOptions = [
    { value: 'start', label: t('flow:startEnd') },
    { value: 'process', label: t('flow:process') },
    { value: 'input', label: t('flow:inputOutput') },
    { value: 'decision', label: t('flow:decision') },
  ]

  const handleAddChildClick = (parentId: string) => {
    setPendingParentId(parentId)
    setShowTypeModal(true)
  }

  const handleTypeSelect = (type: 'start' | 'process' | 'input' | 'decision') => {
    if (pendingParentId) onAddChild(pendingParentId, type)
    setShowTypeModal(false)
    setPendingParentId(null)
  }

  const handleCloseModal = () => {
    setShowTypeModal(false)
    setPendingParentId(null)
  }

  const handleAddNode = () => onAddNode(selectedNodeType)

  return (
    <>
      <div
        dir={dir}
        className={`absolute bg-white shadow-xl rounded-xl border border-gray-200 transition-all duration-300 ease-in-out flex flex-col z-10 overflow-hidden ${sideBarWidth} ${sideBarHeight}`}
        style={{
          top: 12,
          bottom: 12,
          ...edgeStyle,
        }}
      >
        <Button
          type="text"
          icon={isExpanded ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute top-2 w-7 h-7 !flex items-center justify-center z-20 shadow-md"
          style={isRtl
            ? { right: isExpanded ? 'auto' : 12, left: isExpanded ? 14 : 'auto' }
            : { left: isExpanded ? 'auto' : 12, right: isExpanded ? 14 : 'auto' }
          }
          aria-label={isExpanded ? t('flow:sidebarCollapse') : t('flow:sidebarExpand')}
        />

        {isExpanded && (
          <>
            <div className="p-4 border-b border-gray-100 flex-shrink-0">
              <Text strong className="block mb-3 text-sm">{t('flow:addNode')}</Text>
              <div className="mb-3">
                <Text type="secondary" className="text-xs block mb-1">{t('flow:nodeType')}</Text>
                <Select
                  value={selectedNodeType}
                  onChange={(value) => setSelectedNodeType(value)}
                  options={typeOptions}
                  className="w-full"
                  size="middle"
                />
              </div>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddNode}
                block
              >
                {t('flow:addNodeButton')}
              </Button>
            </div>

            <div className="flex-1 flex flex-col p-4 overflow-hidden min-h-0">
              <Text strong className="block mb-3 text-sm">{t('flow:nodeHierarchy')}</Text>
              <div className="flex-1 overflow-y-auto rounded-lg bg-gray-50 p-2">
                <NodeTree
                  nodes={nodes}
                  edges={edges}
                  onAddChild={handleAddChildClick}
                  onEditNode={onEditNode}
                  onDeleteNode={onDeleteNode}
                />
              </div>
              <div className="mt-3 pt-2 border-t border-gray-100 text-xs text-gray-400 flex justify-between">
                <span><Badge count={nodes.length} showZero color="blue" /> {t('flow:nodesCount')}</span>
                <span><Badge count={edges.length} showZero color="green" /> {t('flow:edgesCount')}</span>
              </div>
            </div>
          </>
        )}
      </div>

      <SelectChildTypeModal
        isOpen={showTypeModal}
        onClose={handleCloseModal}
        onSelectType={handleTypeSelect}
      />
    </>
  )
}
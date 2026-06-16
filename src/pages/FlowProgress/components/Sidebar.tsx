import { useState } from 'react'
import { type Node, type Edge } from '@xyflow/react'
import { NodeTree } from './NodeTree'
import { SelectChildTypeModal } from './SelectChildTypeModal'
import { useAppContext } from '@/context/AppContext'
import { useTranslation } from 'react-i18next'

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

  const handleAddNode = () => onAddNode(selectedNodeType)

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

  // Sidebar position: right in RTL, left in LTR
  const edgeStyle = isRtl ? { right: 0 } : { left: 0 }
  const sideBar = !isExpanded ? 'h-[5%] w-[3.5%]' : 'w-[30%]';

  return (
    <>
      <div
        dir={dir}
        className={`absolute bg-white shadow-xl rounded-xl border border-gray-200 transition-all duration-300 ease-in-out flex flex-col z-10 overflow-hidden ${sideBar}`}
        style={{
          top: 12,
          bottom: 12,
          ...edgeStyle,
        }}
      >
        {/* Toggle button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute top-2 w-7 h-7 bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors text-xs z-20 rounded-full shadow-md"
          style={isRtl
            ? { right: isExpanded ? 'auto' : 12, left: isExpanded ? + 14 : 'auto' }
            : { left: isExpanded ? 'auto' : 12, right: isExpanded ? + 14 : 'auto' }
          }
          aria-label={isExpanded ? t('flow:sidebarCollapse') : t('flow:sidebarExpand')}
        >
          {isRtl
            ? (isExpanded ? '→' : '←')
            : (isExpanded ? '←' : '→')
          }
        </button>

        {isExpanded && (
          <>
            {/* Add node card */}
            <div className="p-4 border-b border-gray-100 flex-shrink-0">
              <h3 className="font-semibold text-gray-800 mb-3 text-sm">{t('flow:addNode')}</h3>
              <div className="mb-3">
                <label className="text-xs text-gray-500 block mb-1">{t('flow:nodeType')}</label>
                <select
                  value={selectedNodeType}
                  onChange={(e) => setSelectedNodeType(e.target.value as any)}
                  className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  dir={dir}
                >
                  <option value="start">{t('flow:startEnd')}</option>
                  <option value="process">{t('flow:process')}</option>
                  <option value="input">{t('flow:inputOutput')}</option>
                  <option value="decision">{t('flow:decision')}</option>
                </select>
              </div>
              <button
                onClick={handleAddNode}
                className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors shadow-sm"
              >
                {t('flow:addNodeButton')}
              </button>
            </div>

            {/* Node hierarchy card */}
            <div className="flex-1 flex flex-col p-4 overflow-hidden min-h-0">
              <h3 className="font-semibold text-gray-800 mb-3 text-sm">{t('flow:nodeHierarchy')}</h3>
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
                <span>{t('flow:nodesCount')}: {nodes.length}</span>
                <span>{t('flow:edgesCount')}: {edges.length}</span>
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
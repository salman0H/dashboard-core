import { type Node, type Edge } from '@xyflow/react'
import { useState } from 'react'
import { useAppContext } from '@/context/AppContext'
import { useTranslation } from 'react-i18next'

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

  return (
    <div>
      <div className="py-1.5 border-b border-gray-100" style={indentStyle}>
        <div className="flex items-center gap-2">
          {children.length > 0 ? (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-400 w-5 flex-shrink-0 text-center cursor-pointer hover:text-gray-600"
            >
              {isExpanded ? '▾' : '▸'}
            </button>
          ) : (
            <span className="w-5 flex-shrink-0 text-gray-300 text-center">·</span>
          )}
          <div
            className="flex-1 min-w-0 cursor-pointer hover:text-blue-600"
            onClick={() => onEditNode(node.id)}
          >
            <div className="text-sm font-medium text-gray-800 truncate text-end">{label}</div>
            <div className="text-[11px] text-gray-400 text-end">({typeLabel})</div>
          </div>
          <div className="flex gap-1 flex-shrink-0">
            <button
              onClick={() => onAddChild(node.id)}
              title={t('addChild')}
              className="text-[11px] px-2 py-0.5 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              +
            </button>
            <button
              onClick={() => onEditNode(node.id)}
              className="text-[11px] px-2 py-0.5 bg-emerald-500 text-white rounded hover:bg-emerald-600"
            >
              {t('edit')}
            </button>
            <button
              onClick={() => onDeleteNode(node.id)}
              className="text-[11px] px-2 py-0.5 bg-red-500 text-white rounded hover:bg-red-600"
            >
              {t('delete')}
            </button>
          </div>
        </div>
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
  const { t } = useTranslation('flow')
  const isRtl = dir === 'rtl'
  const rootNodes = nodes.filter((n) => !n.parentId)

  if (nodes.length === 0) {
    return <div className="text-center text-gray-400 text-xs py-4">{t('common:noData')}</div>
  }

  return (
    <div className="overflow-y-auto text-end" dir={dir}>
      <div className="text-[11px] text-gray-400 border-b border-gray-100 pb-1 mb-2 px-1">
        {t('nodesCount')}: {nodes.length} | {t('edgesCount')}: {edges.length}
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
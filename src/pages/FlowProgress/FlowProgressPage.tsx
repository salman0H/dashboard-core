import { useEffect, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Background,
  Controls,
  ReactFlow,
  applyEdgeChanges,
  applyNodeChanges,
  addEdge as addReactFlowEdge,
  MiniMap,
  ReactFlowProvider,
  Panel,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  type Connection,
  type Node,
  type Edge,
  type NodeDragHandler,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { nodeTypes } from './components/CustomNodes'
import { useNodes } from './hooks/useNodes'
import { getLayoutedElements } from './services/layout'
import { Sidebar } from './components/Sidebar'
import { NodeFormModal } from './components/NodeFormModal'
import { NodeInfoPanel } from './components/NodeInfoPanel'
import { useAppContext } from '@/context/AppContext'

const TOPBAR_H = 52

function FlowProgressContent() {
  const { t } = useTranslation('flow')
  const { dir } = useAppContext()
  const isRtl = dir === 'rtl'

  const {
    nodes, edges, loading, error,
    setNodes, setEdges, loadData, refreshData,
    addEdge, updateNodePosition, deleteNode,
  } = useNodes()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [pendingNodeType, setPendingNodeType] = useState<'start' | 'process' | 'input' | 'decision'>('process')
  const [pendingParentId, setPendingParentId] = useState<string | null>(null)
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [isLayouting, setIsLayouting] = useState(false)

  useEffect(() => { loadData() }, [loadData])

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  )
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  )
  const onConnect: OnConnect = useCallback(
    async (connection: Connection) => {
      if (connection.source && connection.target) {
        const tempEdge: Edge = {
          id: `temp-${Date.now()}`,
          source: connection.source,
          target: connection.target,
          type: 'step',
        }
        setEdges((eds) => addReactFlowEdge(tempEdge, eds))
        await addEdge(connection.source, connection.target)
        await refreshData()
      }
    },
    [addEdge, setEdges, refreshData]
  )
  const onNodeDragStop: NodeDragHandler = useCallback(
    async (_event, node) => { await updateNodePosition(node.id, node.position) },
    [updateNodePosition]
  )
  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node)
  }, [])

  const onLayout = useCallback(async (direction: 'DOWN' | 'RIGHT') => {
    if (isLayouting) return
    setIsLayouting(true)
    try {
      const { nodes: ln, edges: le } = await getLayoutedElements(nodes, edges, direction)
      setNodes(ln)
      setEdges(le)
    } catch { /* silent */ } finally {
      setIsLayouting(false)
    }
  }, [nodes, edges, setNodes, setEdges, isLayouting])

  const handleAddNode = (type: 'start' | 'process' | 'input' | 'decision') => {
    setPendingNodeType(type)
    setPendingParentId(null)
    setEditingNodeId(null)
    setIsModalOpen(true)
  }
  const handleAddChild = (parentId: string, type: 'start' | 'process' | 'input' | 'decision') => {
    setPendingNodeType(type)
    setPendingParentId(parentId)
    setEditingNodeId(null)
    setIsModalOpen(true)
  }
  const handleEditNode = (nodeId: string) => {
    setEditingNodeId(nodeId)
    const node = nodes.find((n) => n.id === nodeId)
    if (node) {
      setPendingNodeType(node.type as 'start' | 'process' | 'input' | 'decision')
      setPendingParentId(node.parentId as string | null)
      setIsModalOpen(true)
    }
  }
  const handleFormSuccess = async () => {
    await refreshData()
    setIsModalOpen(false)
    setEditingNodeId(null)
    setPendingParentId(null)
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto" />
          <p className="mt-3 text-sm text-slate-500">{t('common:loading')}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-lg border border-red-200">
          <p className="text-red-600 font-medium mb-2">{t('common:error')}</p>
          <p className="text-sm text-slate-500">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full" style={{ height: `calc(100vh - ${TOPBAR_H}px)` }}>
      {/* Full‑size canvas – no margin/padding */}
      <div className="absolute inset-0">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeDragStop={onNodeDragStop}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          defaultEdgeOptions={{ type: 'step' }}
          panOnScroll
          fitView
        >
          <Background variant="dots" />
          <MiniMap />
          <Controls />
          <Panel position="bottom-center">
            <div className="flex gap-2 bg-white px-3 py-2 rounded-lg shadow border border-slate-200">
              <button
                onClick={() => onLayout('DOWN')}
                disabled={isLayouting}
                className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {t('verticalLayout')}
              </button>
              <button
                onClick={() => onLayout('RIGHT')}
                disabled={isLayouting}
                className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {t('horizontalLayout')}
              </button>
            </div>
          </Panel>
        </ReactFlow>
      </div>

      {/* Overlay sidebar – no canvas shifting */}
      <Sidebar
        nodes={nodes}
        edges={edges}
        onAddNode={handleAddNode}
        onAddChild={handleAddChild}
        onEditNode={handleEditNode}
        onDeleteNode={deleteNode}
      />

      {/* Overlay info panel – opposite side */}
      <NodeInfoPanel
        selectedNodeId={selectedNode?.id ?? null}
        onClose={() => setSelectedNode(null)}
        onNodeUpdate={refreshData}
      />

      <NodeFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingNodeId(null)
          setPendingParentId(null)
        }}
        nodeType={pendingNodeType}
        parentId={pendingParentId}
        existingNodeId={editingNodeId ?? undefined}
        onSuccess={handleFormSuccess}
      />
    </div>
  )
}

export function FlowProgressPage() {
  return (
    <div className="flex flex-col" style={{ height: '100vh' }}>
      <ReactFlowProvider>
        <FlowProgressContent />
      </ReactFlowProvider>
    </div>
  )
}
// src/pages/FlowProgress/FlowProgressPage.tsx
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
import { Button, Spin, Alert, Flex } from 'antd'
import { LayoutOutlined } from '@ant-design/icons'

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
      <Flex justify="center" align="center" style={{ height: '100%' }}>
        <Spin size="large" tip={t('common:loading')} />
      </Flex>
    )
  }

  if (error) {
    return (
      <Flex justify="center" align="center" style={{ height: '100%', padding: '24px' }}>
        <Alert
          message={t('common:error')}
          description={error}
          type="error"
          showIcon
          style={{ maxWidth: 500 }}
        />
      </Flex>
    )
  }

  return (
    <div className="relative w-full h-full" style={{ height: `calc(100vh - ${TOPBAR_H}px)` }}>
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
            <Flex gap="small" style={{ background: 'white', padding: '8px 12px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>
              <Button
                type="primary"
                icon={<LayoutOutlined />}
                onClick={() => onLayout('DOWN')}
                disabled={isLayouting}
              >
                {t('verticalLayout')}
              </Button>
              <Button
                type="primary"
                icon={<LayoutOutlined rotate={90} />}
                onClick={() => onLayout('RIGHT')}
                disabled={isLayouting}
              >
                {t('horizontalLayout')}
              </Button>
            </Flex>
          </Panel>
        </ReactFlow>
      </div>

      <Sidebar
        nodes={nodes}
        edges={edges}
        onAddNode={handleAddNode}
        onAddChild={handleAddChild}
        onEditNode={handleEditNode}
        onDeleteNode={deleteNode}
      />

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
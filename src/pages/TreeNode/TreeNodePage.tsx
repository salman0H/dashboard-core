// File: src/pages/TreeNode/TreeNodePage.tsx
import { useState, useEffect } from 'react'
import { TreeMenu } from './components/TreeMenu'
import { DetailsPanel } from './components/DetailsPanel'
import { ContextMenu } from './components/ContextMenu'
import type { TreeNode, NodeDetails } from './types'
import { useAppContext } from '@/context/AppContext'

export function TreeNodePage() {
  const { dir } = useAppContext()
  const isRtl = dir === 'rtl'

  const [treeData, setTreeData] = useState<TreeNode[]>([])
  const [detailsList, setDetailsList] = useState<NodeDetails[]>([])
  const [selectedDetails, setSelectedDetails] = useState<NodeDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean; x: number; y: number
    nodeId: string; nodeName: string; hasChildren: boolean
  }>({ visible: false, x: 0, y: 0, nodeId: '', nodeName: '', hasChildren: false })

  useEffect(() => {
    Promise.all([
      fetch('/api/tree/treeData').then((r) => { if (!r.ok) throw new Error(`${r.status}`); return r.json() }),
      fetch('/api/tree/details').then((r) => { if (!r.ok) throw new Error(`${r.status}`); return r.json() }),
    ])
      .then(([tree, dets]) => {
        setTreeData(Array.isArray(tree) ? tree : [])
        setDetailsList(Array.isArray(dets) ? dets : [])
      })
      .catch((e: unknown) => setFetchError(e instanceof Error ? e.message : 'خطا'))
      .finally(() => setLoading(false))
  }, [])

  const handleNodeClick = (nodeId: string) => {
    setSelectedDetails(detailsList.find((d) => d.id === nodeId) ?? null)
  }

  const handleNodeContextMenu = (nodeId: string, event: React.MouseEvent) => {
    event.preventDefault()
    const find = (nodes: TreeNode[], id: string): TreeNode | null => {
      for (const n of nodes) {
        if (n.id === id) return n
        if (n.children) { const f = find(n.children, id); if (f) return f }
      }
      return null
    }
    const node = find(treeData, nodeId)
    if (node) {
      setContextMenu({
        visible: true,
        x: event.clientX,
        y: event.clientY,
        nodeId: node.id,
        nodeName: node.name,
        hasChildren: !!(node.children?.length),
      })
    }
  }

  const handleAddChild = (parentId: string) => {
    const newId = `${parentId}.${Math.floor(Math.random() * 1000)}`
    const newChild: TreeNode = { id: newId, name: 'زیرمجموعه جدید', icon: 'folder', children: [] }
    const add = (nodes: TreeNode[]): TreeNode[] =>
      nodes.map((n) => n.id === parentId
        ? { ...n, children: [...(n.children ?? []), newChild] }
        : { ...n, children: n.children ? add(n.children) : n.children }
      )
    setTreeData(add(treeData))
  }

  const handleShowChildren = (nodeId: string, nodeName: string) => {
    const find = (nodes: TreeNode[], id: string): TreeNode | null => {
      for (const n of nodes) { if (n.id === id) return n; if (n.children) { const f = find(n.children, id); if (f) return f } }
      return null
    }
    const node = find(treeData, nodeId)
    alert(node?.children?.length
      ? `زیرمجموعه‌های "${nodeName}": ${node.children.map((c) => c.name).join('، ')}`
      : `گره "${nodeName}" زیرمجموعه‌ای ندارد.`
    )
  }

  const handleCopy = (nodeId: string) => {
    const d = detailsList.find((x) => x.id === nodeId)
    if (d) void navigator.clipboard.writeText(`شناسه: ${d.id}\nنام: ${d.name}\nنوع: ${d.type}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    )
  }
  if (fetchError) {
    return (
      <div className="flex items-center justify-center h-full text-red-500 text-sm">
        خطا: {fetchError}
      </div>
    )
  }

  // In RTL: tree on right, details on left. In LTR: tree on left, details on right.
  const treeOrder = isRtl ? 'order-1' : 'order-0'
  const detailsOrder = isRtl ? 'order-0' : 'order-1'
  const elementsOrder = isRtl ? 'flex-row-reverse' : '';

  return (
    <div className={`flex h-full w-full bg-gray-50 overflow-hidden ${elementsOrder}`} dir={dir}>
      <div className={`w-1/2 p-6 overflow-hidden ${treeOrder}`}>
        {treeData.length > 0 ? (
          <TreeMenu
            data={treeData}
            onNodeClick={handleNodeClick}
            onNodeContextMenu={handleNodeContextMenu}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-sm text-slate-400">
            داده‌ای یافت نشد
          </div>
        )}
      </div>
      <div className={`w-1/2 p-6 overflow-auto ${detailsOrder}`}>
        <DetailsPanel details={selectedDetails} loading={false} error={null} />
      </div>

      {contextMenu.visible && (
        <ContextMenu
          x={contextMenu.x} y={contextMenu.y}
          nodeId={contextMenu.nodeId} nodeName={contextMenu.nodeName}
          hasChildren={contextMenu.hasChildren}
          onClose={() => setContextMenu((s) => ({ ...s, visible: false }))}
          onAddChild={handleAddChild}
          onShowChildren={handleShowChildren}
          onCopy={handleCopy}
        />
      )}
    </div>
  )
}
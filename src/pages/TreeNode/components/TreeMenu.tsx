// src/pages/TreeNode/components/TreeMenu.tsx
import { Tree } from 'react-arborist'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TreeNode } from '../types'
import { TreeNodeRenderer } from './TreeNodeRenderer'
import { FolderTree } from 'lucide-react'
import { TreeProvider } from './TreeContext'
import { SearchBox } from './SearchBox'
import { useAppContext } from '@/context/AppContext'
import { Card, Typography, Space } from 'antd'

const { Title, Text } = Typography

interface TreeMenuProps {
  data: TreeNode[]
  onNodeClick: (nodeId: string) => void
  onNodeContextMenu?: (nodeId: string, event: React.MouseEvent) => void
}

export function TreeMenu({ data, onNodeClick, onNodeContextMenu }: TreeMenuProps) {
  const { t } = useTranslation('tree')
  const { dir } = useAppContext()
  const isRtl = dir === 'rtl'
  const [treeHeight, setTreeHeight] = useState(400)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const updateHeight = () => {
      const headerHeight = 85
      const availableHeight = Math.min(window.innerHeight * 0.6, 500)
      setTreeHeight(availableHeight - headerHeight)
    }
    updateHeight()
    window.addEventListener('resize', updateHeight)
    return () => window.removeEventListener('resize', updateHeight)
  }, [])

  const NodeRenderer = (props: any) => (
    <TreeNodeRenderer {...props} onContextMenu={onNodeContextMenu} />
  )

  return (
    <TreeProvider treeData={data}>
      <Card
        className="h-full overflow-hidden shadow-sm"
        bordered={false}
        styles={{ body: { padding: 0, height: '100%', display: 'flex', flexDirection: 'column' } }}
      >
        <div className="p-4 border-b border-gray-200 flex-shrink-0">
          <Space align="center" size="small">
            <FolderTree className="w-5 h-5 text-blue-600" />
            <div>
              <Title level={5} style={{ margin: 0 }}>{t('folderTree')}</Title>
              <Text type="secondary" className="text-xs">{t('treeStructure')}</Text>
            </div>
          </Space>
          <SearchBox value={searchTerm} onChange={setSearchTerm} />
        </div>
        <div className="flex-1 p-2 overflow-hidden">
          <div className="h-full overflow-auto">
            <Tree
              data={data}
              searchTerm={searchTerm}
              openByDefault={false}
              width="100%"
              height={treeHeight - 20}
              indent={16}
              rowHeight={18}
              overscanCount={5}
              onSelect={(nodes) => {
                if (nodes.length > 0) onNodeClick(nodes[0].data.id)
              }}
            >
              {NodeRenderer}
            </Tree>
          </div>
        </div>
      </Card>
    </TreeProvider>
  )
}
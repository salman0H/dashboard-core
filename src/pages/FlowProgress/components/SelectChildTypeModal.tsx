// src/pages/FlowProgress/components/SelectChildTypeModal.tsx
import { useTranslation } from 'react-i18next'
import { Modal, Button, Grid, Card, Typography } from 'antd'
import { 
  PlayCircleOutlined, 
  SettingOutlined, 
  ImportOutlined, 
  QuestionCircleOutlined 
} from '@ant-design/icons'

const { Text } = Typography

interface SelectChildTypeModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectType: (type: 'start' | 'process' | 'input' | 'decision') => void
}

const typeConfig = {
  start: { icon: <PlayCircleOutlined />, color: '#1677ff', desc: 'Start/End node' },
  process: { icon: <SettingOutlined />, color: '#52c41a', desc: 'Process node' },
  input: { icon: <ImportOutlined />, color: '#722ed1', desc: 'Input/Output node' },
  decision: { icon: <QuestionCircleOutlined />, color: '#fa8c16', desc: 'Decision node' },
}

export const SelectChildTypeModal = ({ isOpen, onClose, onSelectType }: SelectChildTypeModalProps) => {
  const { t } = useTranslation('flow')

  return (
    <Modal
      title={t('selectChildType')}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={480}
      centered
    >
      <div className="grid grid-cols-2 gap-3">
        {(Object.keys(typeConfig) as Array<keyof typeof typeConfig>).map((type) => {
          const config = typeConfig[type]
          return (
            <Card
              key={type}
              hoverable
              className="cursor-pointer border-gray-200 hover:border-blue-400 transition-all"
              onClick={() => onSelectType(type)}
              size="small"
            >
              <div className="flex flex-col items-center text-center p-2">
                <div style={{ color: config.color, fontSize: 24 }}>{config.icon}</div>
                <Text strong className="mt-2">{t(type)}</Text>
                <Text type="secondary" className="text-xs">{config.desc}</Text>
              </div>
            </Card>
          )
        })}
      </div>
      <Button block onClick={onClose} className="mt-5">
        {t('cancel')}
      </Button>
    </Modal>
  )
}
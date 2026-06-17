// src/pages/FlowProgress/components/NodeFormModal.tsx
import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { nodeFormSchema, NodeFormData } from '../schemas/nodeFormSchema'
import * as api from '../services/api'
import { nanoid } from 'nanoid'
import { Modal, Form, Input, Select, Button, Space, Typography, Alert } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'

const { Text } = Typography

interface NodeFormModalProps {
  isOpen: boolean
  onClose: () => void
  nodeType: 'start' | 'process' | 'input' | 'decision'
  parentId: string | null
  existingNodeId?: string
  onSuccess: (nodeId: string, formDataId: string) => void
}

const typeOptions = [
  { value: 'start', label: 'Start/End' },
  { value: 'process', label: 'Process' },
  { value: 'input', label: 'Input/Output' },
  { value: 'decision', label: 'Decision' },
]

const finalProcessOptions = [
  { value: '', label: 'Select status' },
  { value: 'yes', label: 'Yes - Final Node' },
  { value: 'no', label: 'No - Continue' },
  { value: 'conditional', label: 'Conditional' },
]

export const NodeFormModal = ({
  isOpen,
  onClose,
  nodeType,
  parentId,
  existingNodeId,
  onSuccess,
}: NodeFormModalProps) => {
  const [nextProcesses, setNextProcesses] = useState<string[]>([])
  const [previousProcess, setPreviousProcess] = useState<{ id: string; name: string; type: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { control, handleSubmit, reset, setValue, watch } = useForm<NodeFormData>({
    resolver: zodResolver(nodeFormSchema),
    defaultValues: {
      nodeId: '',
      label: '',
      executionProcess: '',
      nextProcess: [],
      previousProcess: null,
      finalProcess: '',
      type: nodeType,
      description: '',
    },
  })

  const watchedType = watch('type')

  useEffect(() => {
    if (existingNodeId && isOpen) {
      loadExistingData()
    }
  }, [existingNodeId, isOpen])

  useEffect(() => {
    if (isOpen && parentId) {
      loadConnectedProcesses()
    }
  }, [parentId, isOpen])

  useEffect(() => {
    setValue('type', nodeType)
  }, [nodeType, setValue])

  const loadExistingData = async () => {
    if (!existingNodeId) return
    try {
      const formData = await api.fetchFormDataByNodeId(existingNodeId)
      if (formData) {
        setValue('label', formData.label)
        setValue('executionProcess', formData.executionProcess)
        setValue('nextProcess', formData.nextProcess)
        setValue('previousProcess', formData.previousProcess)
        setValue('finalProcess', formData.finalProcess || '')
        setValue('description', formData.description || '')
        setValue('type', formData.type)
        if (formData.nextProcess.length > 0) setNextProcesses(formData.nextProcess)
        if (formData.previousProcess) setPreviousProcess(formData.previousProcess)
      }
    } catch (error) {
      console.error('Failed to load form data:', error)
      setError('Failed to load existing data')
    }
  }

  const loadConnectedProcesses = async () => {
    if (!parentId) return
    try {
      const [edges, nodes, formDataList] = await Promise.all([
        api.fetchEdges(),
        api.fetchNodes(),
        api.fetchAllFormData(),
      ])

      const outgoingEdges = edges.filter((edge) => edge.source === parentId)
      const nextNodeIds = outgoingEdges.map((edge) => edge.target)
      const nextNodeNames: string[] = []
      for (const nodeId of nextNodeIds) {
        const node = nodes.find((n) => n.id === nodeId)
        if (node) {
          const formData = formDataList.find((fd) => fd.nodeId === node.id)
          nextNodeNames.push(formData?.label || node.id)
        }
      }
      setNextProcesses(nextNodeNames)
      setValue('nextProcess', nextNodeNames)

      const incomingEdges = edges.filter((edge) => edge.target === parentId)
      if (incomingEdges.length > 0) {
        const parentNode = nodes.find((n) => n.id === incomingEdges[0].source)
        if (parentNode) {
          const parentFormData = formDataList.find((fd) => fd.nodeId === parentNode.id)
          const previousData = {
            id: parentNode.id,
            name: parentFormData?.label || parentNode.id,
            type: parentNode.type,
          }
          setPreviousProcess(previousData)
          setValue('previousProcess', previousData)
        }
      }
    } catch (error) {
      console.error('Failed to load connected processes:', error)
    }
  }

  const onSubmit = async (data: NodeFormData) => {
    setLoading(true)
    setError(null)
    try {
      const nodeId = existingNodeId || nanoid(11)

      const formDataPayload = {
        nodeId,
        label: data.label,
        executionProcess: data.executionProcess,
        nextProcess: nextProcesses,
        previousProcess,
        finalProcess: data.finalProcess || '',
        type: data.type,
        description: data.description || '',
      }

      const savedFormData = await api.saveOrUpdateFormData(formDataPayload)

      if (!existingNodeId) {
        const newNode: api.NodeData = {
          id: nodeId,
          position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
          type: data.type,
          parentId,
          formDataId: savedFormData.id,
        }
        const savedNode = await api.saveNode(newNode)

        if (parentId) {
          const newEdge: api.EdgeData = {
            id: `edge-${Date.now()}`,
            source: parentId,
            target: savedNode.id,
            type: 'step',
          }
          await api.saveEdge(newEdge)
        }

        onSuccess(savedNode.id, savedFormData.id)
      } else {
        onSuccess(existingNodeId, savedFormData.id)
      }

      reset()
      onClose()
    } catch (error) {
      console.error('Failed to save node:', error)
      setError('Failed to save node. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    reset()
    setError(null)
    onClose()
  }

  return (
    <Modal
      title={existingNodeId ? 'Edit Node' : `Add ${nodeType.charAt(0).toUpperCase() + nodeType.slice(1)} Node`}
      open={isOpen}
      onCancel={handleClose}
      footer={null}
      width={520}
      destroyOnHidden
    >
      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          closable
          onClose={() => setError(null)}
          style={{ marginBottom: 16 }}
        />
      )}

      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <Controller
          name="label"
          control={control}
          render={({ field, fieldState }) => (
            <Form.Item
              label="Process Name"
              required
              validateStatus={fieldState.error ? 'error' : ''}
              help={fieldState.error?.message}
            >
              <Input {...field} placeholder="Enter process name" />
            </Form.Item>
          )}
        />

        <Controller
          name="executionProcess"
          control={control}
          render={({ field, fieldState }) => (
            <Form.Item
              label="Execution Process"
              required
              validateStatus={fieldState.error ? 'error' : ''}
              help={fieldState.error?.message}
            >
              <Input {...field} placeholder="Describe the execution process" />
            </Form.Item>
          )}
        />

        <Controller
          name="finalProcess"
          control={control}
          render={({ field }) => (
            <Form.Item label="Final Process Status">
              <Select {...field} options={finalProcessOptions} />
            </Form.Item>
          )}
        />

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Form.Item label="Description">
              <Input.TextArea {...field} rows={3} placeholder="Optional description" />
            </Form.Item>
          )}
        />

        {(nextProcesses.length > 0 || previousProcess) && (
          <div className="p-3 bg-gray-100 rounded mb-4">
            <Space direction="vertical" size="small">
              <Text type="secondary">
                <strong>Next Processes:</strong> {nextProcesses.length > 0 ? nextProcesses.join(', ') : 'None'}
              </Text>
              <Text type="secondary">
                <strong>Previous Process:</strong> {previousProcess ? previousProcess.name : 'None'}
              </Text>
            </Space>
          </div>
        )}

        <Form.Item style={{ marginBottom: 0 }}>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {existingNodeId ? 'Update Node' : 'Create Node'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  )
}
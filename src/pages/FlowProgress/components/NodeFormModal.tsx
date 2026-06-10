import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { nodeFormSchema, NodeFormData } from '../schemas/nodeFormSchema';
import * as api from '../services/api';
import { nanoid } from "nanoid"

interface NodeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodeType: 'start' | 'process' | 'input' | 'decision';
  parentId: string | null;
  existingNodeId?: string;
  onSuccess: (nodeId: string, formDataId: string) => void;
}

export const NodeFormModal = ({ 
  isOpen, 
  onClose, 
  nodeType, 
  parentId, 
  existingNodeId,
  onSuccess 
}: NodeFormModalProps) => {
  const [nextProcesses, setNextProcesses] = useState<string[]>([]);
  const [previousProcess, setPreviousProcess] = useState<{ id: string; name: string; type: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm<NodeFormData>({
    resolver: zodResolver(nodeFormSchema),
    defaultValues: {
      nodeId: '',
      label: '',
      executionProcess: '',
      nextProcess: [],
      previousProcess: null,
      finalProcess: '',
      type: nodeType,
      description: ''
    }
  });

  useEffect(() => {
    if (existingNodeId && isOpen) {
      loadExistingData();
    }
  }, [existingNodeId, isOpen]);

  useEffect(() => {
    if (isOpen && parentId) {
      loadConnectedProcesses();
    }
  }, [parentId, isOpen]);

  const loadExistingData = async () => {
    if (!existingNodeId) return;
    
    try {
      const formData = await api.fetchFormDataByNodeId(existingNodeId);
      if (formData) {
        setValue('label', formData.label);
        setValue('executionProcess', formData.executionProcess);
        setValue('nextProcess', formData.nextProcess);
        setValue('previousProcess', formData.previousProcess);
        setValue('finalProcess', formData.finalProcess || '');
        setValue('description', formData.description || '');
        setValue('type', formData.type);
        
        if (formData.nextProcess.length > 0) {
          setNextProcesses(formData.nextProcess);
        }
        if (formData.previousProcess) {
          setPreviousProcess(formData.previousProcess);
        }
      }
    } catch (error) {
      console.error('Failed to load form data:', error);
    }
  };

  const loadConnectedProcesses = async () => {
    if (!parentId) return;

    try {
      const [edges, nodes, formDataList] = await Promise.all([
        api.fetchEdges(),
        api.fetchNodes(),
        api.fetchAllFormData()
      ]);

      // Get next processes (children)
      const outgoingEdges = edges.filter(edge => edge.source === parentId);
      const nextNodeIds = outgoingEdges.map(edge => edge.target);
      const nextNodeNames: string[] = [];
      
      for (const nodeId of nextNodeIds) {
        const node = nodes.find(n => n.id === nodeId);
        if (node) {
          const formData = formDataList.find(fd => fd.nodeId === node.id);
          if (formData) {
            nextNodeNames.push(formData.label);
          } else {
            nextNodeNames.push(node.id);
          }
        }
      }
      setNextProcesses(nextNodeNames);
      setValue('nextProcess', nextNodeNames);

      // Get previous process (parent)
      const incomingEdges = edges.filter(edge => edge.target === parentId);
      if (incomingEdges.length > 0) {
        const parentNode = nodes.find(n => n.id === incomingEdges[0].source);
        if (parentNode) {
          const parentFormData = formDataList.find(fd => fd.nodeId === parentNode.id);
          const previousData = {
            id: parentNode.id,
            name: parentFormData?.label || parentNode.id,
            type: parentNode.type
          };
          setPreviousProcess(previousData);
          setValue('previousProcess', previousData);
        }
      }
    } catch (error) {
      console.error('Failed to load connected processes:', error);
    }
  };

  const onSubmit = async (data: NodeFormData) => {
    setLoading(true);
    try {
      const generateId = nanoid(11); // create a id
      const nodeId = existingNodeId || generateId;

      const formDataPayload = {
        nodeId: nodeId,
        label: data.label,
        executionProcess: data.executionProcess,
        nextProcess: nextProcesses,
        previousProcess: previousProcess,
        finalProcess: data.finalProcess,
        type: data.type,
        description: data.description || ''
      }
      const savedFormData = await api.saveOrUpdateFormData(formDataPayload);

      if (!existingNodeId) {
        const newNode: api.NodeData = {
          id: nodeId,
          position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
          type: data.type,
          parentId: parentId,
          formDataId: savedFormData.id
        };

        const savedNode = await api.saveNode(newNode);

        if (parentId) {
          const newEdge: api.EdgeData = {
            id: `edge-${Date.now()}`,
            source: parentId,
            target: savedNode.id,
            type: 'step'
          };
          await api.saveEdge(newEdge);
        }

        onSuccess(savedNode.id, savedFormData.id);
      } else {
        onSuccess(existingNodeId, savedFormData.id);
      }
      
      reset();
      onClose();
    } catch (error) {
      console.error('Failed to save node:', error);
      alert('Failed to save node. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={handleClose}>
      <div className="bg-white rounded-lg p-6 w-[500px] max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4">
          {existingNodeId ? 'Edit' : 'Add'} {nodeType.charAt(0).toUpperCase() + nodeType.slice(1)} Node
        </h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Process Name *</label>
            <input
              {...register("label")}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter process name"
            />
            {errors.label && <span className="text-red-500 text-xs">{errors.label.message}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Execution Process *</label>
            <input
              {...register("executionProcess")}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe the execution process"
            />
            {errors.executionProcess && <span className="text-red-500 text-xs">{errors.executionProcess.message}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Final Process Status</label>
            <select
              {...register("finalProcess")}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select status</option>
              <option value="yes">Yes - Final Node</option>
              <option value="no">No - Continue</option>
              <option value="conditional">Conditional</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              {...register("description")}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Optional description"
            />
          </div>

          {/* Auto-populated connections info */}
          {(nextProcesses.length > 0 || previousProcess) && (
            <div className="mt-4 p-3 bg-gray-100 rounded">
              <p className="text-sm">
                <strong>Next Processes:</strong> {nextProcesses.length > 0 ? nextProcesses.join(', ') : 'None'}
              </p>
              <p className="text-sm mt-1">
                <strong>Previous Process:</strong> {previousProcess ? previousProcess.name : 'None'}
              </p>
            </div>
          )}

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:bg-blue-300"
            >
              {loading ? 'Saving...' : existingNodeId ? 'Update Node' : 'Create Node'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
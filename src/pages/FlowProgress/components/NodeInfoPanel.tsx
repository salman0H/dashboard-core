import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import * as api from '../services/api';
import { useAppContext } from '@/context/AppContext';

interface NodeInfoPanelProps {
  selectedNodeId: string | null;
  onClose: () => void;
  onNodeUpdate?: () => void;
}

export const NodeInfoPanel = ({ selectedNodeId, onClose, onNodeUpdate }: NodeInfoPanelProps) => {
  const { t } = useTranslation(['flow', 'common']);
  const { dir } = useAppContext();
  const isRtl = dir === 'rtl';

  // Sidebar position: in RTL it's on the right, so info panel goes to left.
  // In LTR sidebar is on left, so info panel goes to right.
  const side = isRtl ? 'left' : 'right';

  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (selectedNodeId) {
      loadNodeInfo();
      setIsEditing(false);
    }
  }, [selectedNodeId]);

  const loadNodeInfo = async () => {
    if (!selectedNodeId) return;
    setLoading(true);
    setError(null);
    try {
      const [nodes, edges, formDataList] = await Promise.all([
        api.fetchEnrichedNodes(),
        api.fetchEdges(),
        api.fetchAllFormData()
      ]);

      const node = nodes.find(n => n.id === selectedNodeId);
      if (!node) {
        setError(t('common:error'));
        return;
      }
      const nodeFormData = formDataList.find(fd => fd.id === node.formDataId);
      const incomingEdges = edges.filter(e => e.target === selectedNodeId);
      const outgoingEdges = edges.filter(e => e.source === selectedNodeId);

      const incomingNodes = incomingEdges.map((edge) => {
        const sourceNode = nodes.find(n => n.id === edge.source);
        return {
          id: edge.source,
          name: sourceNode?.data?.label || sourceNode?.id || edge.source,
          type: sourceNode?.type
        };
      });
      
      const outgoingNodes = outgoingEdges.map((edge) => {
        const targetNode = nodes.find(n => n.id === edge.target);
        return {
          id: edge.target,
          name: targetNode?.data?.label || targetNode?.id || edge.target,
          type: targetNode?.type
        };
      });

      setFormData({
        node,
        formData: nodeFormData,
        connections: { incoming: incomingNodes, outgoing: outgoingNodes }
      });
      setEditData(nodeFormData ? { ...nodeFormData } : null);
    } catch (err) {
      console.error('Failed to load node info:', err);
      setError(t('common:error_loading'));
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editData || !selectedNodeId) return;
    setSaving(true);
    try {
      const nodes = await api.fetchNodes();
      const node = nodes.find(n => n.id === selectedNodeId);
      if (!node || !node.formDataId) throw new Error('No formData linked');
      const updated = await api.updateFormDataByNodeId(node.formDataId, {
        label: editData.label,
        executionProcess: editData.executionProcess,
        description: editData.description,
        finalProcess: editData.finalProcess
      });
      if (updated) {
        setToast({ message: t('common:save_success'), type: 'success' });
        setIsEditing(false);
        await loadNodeInfo();
        if (onNodeUpdate) onNodeUpdate();
      } else {
        setToast({ message: t('common:error_saving'), type: 'error' });
      }
    } catch (err) {
      console.error('Failed to save:', err);
      setToast({ message: t('common:error_saving'), type: 'error' });
    } finally {
      setSaving(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData(formData?.formData ? { ...formData.formData } : null);
  };

  if (!selectedNodeId) return null;

  return (
    <>
      {toast && (
        <div className={`fixed top-5 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded shadow-lg ${
          toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          {toast.message}
        </div>
      )}
      
      <div 
        className="fixed top-1/2 -translate-y-1/2 w-96 bg-white rounded-2xl shadow-xl border border-gray-200 z-20 max-h-[80vh] overflow-y-auto"
        style={{ [side]: '16px' }}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h3 className="font-bold text-lg">{t('common:node_information')}</h3>
          <button onClick={onClose} className="text-gray-500 cursor-pointer hover:text-gray-700 text-xl">
            ✕
          </button>
        </div>
        
        <div className="p-4">
          {loading && <div className="text-center py-4">{t('common:loading')}</div>}
          {error && <div className="text-red-500 text-center py-4">{error}</div>}
          
          {!loading && !error && formData && (
            <div className="space-y-4">
              <div className="border-b pb-2">
                <h4 className="font-semibold text-sm text-gray-600 mb-2">{t('common:node_details')}</h4>
                <p className="text-sm"><strong>{t('flow:id')}:</strong> {formData.node?.id}</p>
                <p className="text-sm"><strong>{t('flow:position')}:</strong> ({formData.node?.position.x}, {formData.node?.position.y})</p>
                <p className="text-sm"><strong>{t('common:select_node_type')}:</strong> {t(formData.node?.type)}</p>
              </div>

              {formData.formData ? (
                <>
                  <div className="border-b pb-2">
                    <div className="space-y-2">
                      <div className="text-sm"><strong>{t('common:label')}:</strong> {formData.formData.label}</div>
                      <div className="text-sm"><strong>{t('common:execution_process')}:</strong> {formData.formData.executionProcess}</div>
                      <div className="text-sm"><strong>{t('common:final_process')}:</strong> {formData.formData.finalProcess || t('common:not_specified')}</div>
                      {formData.formData.description && (
                        <div className="text-sm"><strong>{t('common:description')}:</strong> {formData.formData.description}</div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm text-gray-600 mb-2">{t('common:connections')}</h4>
                    {formData.connections.incoming.length > 0 && (
                      <div className="mb-2">
                        <p className="text-sm font-medium text-green-600">{t('common:previous_process')}:</p>
                        <ul className="list-disc list-inside text-sm mr-4">
                          {formData.connections.incoming.map((node: any) => (
                            <li key={node.id}>{node.name} ({t(node.type)})</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {formData.connections.outgoing.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-blue-600">{t('common:next_process')}:</p>
                        <ul className="list-disc list-inside text-sm mr-4">
                          {formData.connections.outgoing.map((node: any) => (
                            <li key={node.id}>{node.name} ({t(node.type)})</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {formData.connections.incoming.length === 0 && formData.connections.outgoing.length === 0 && (
                      <p className="text-sm text-gray-500">{t('common:no_connections')}</p>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center text-gray-500 py-4">{t('common:no_form_data')}</div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
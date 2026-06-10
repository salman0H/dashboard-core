import { useState, useCallback, useEffect, useRef } from 'react';
import { Node, Edge } from '@xyflow/react';
import * as api from '../services/api';

export const useNodes = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formDataMap, setFormDataMap] = useState<Map<string, any>>(new Map());
  const isMounted = useRef(true);
  const isLoadingRef = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const loadData = useCallback(async () => {
    if (isLoadingRef.current) return;
    
    isLoadingRef.current = true;
    setLoading(true);
    setError(null);
    
    try {
      console.log('Loading data...');
      const [enrichedNodes, edgesData, formDataList] = await Promise.all([
        api.fetchEnrichedNodes(),
        api.fetchEdges(),
        api.fetchAllFormData()
      ]);
      
      if (isMounted.current) {
        console.log(`Loaded ${enrichedNodes.length} nodes with labels`);
        setNodes(enrichedNodes as Node[]);
        setEdges(edgesData as Edge[]);
        
        // Create formData map for quick lookups
        const map = new Map();
        formDataList.forEach(fd => map.set(fd.nodeId, fd));
        setFormDataMap(map);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      if (isMounted.current) {
        setError('Failed to load data. Please check if json-server is running on port 3002');
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
      isLoadingRef.current = false;
    }
  }, []);

  const addEdge = useCallback(async (source: string, target: string): Promise<api.EdgeData | undefined> => {
    const newEdge: api.EdgeData = {
      id: `edge-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      source,
      target,
      type: 'step'
    };

    try {
      const savedEdge = await api.saveEdge(newEdge);
      if (isMounted.current) {
        setEdges((eds) => [...eds, savedEdge as Edge]);
      }
      return savedEdge;
    } catch (error) {
      console.error('Failed to add edge:', error);
      if (isMounted.current) {
        setError('Failed to add connection');
      }
    }
  }, []);

  const updateNodePosition = useCallback(async (id: string, position: { x: number; y: number }) => {
    try {
      // Optimistic update
      setNodes((nds) =>
        nds.map((node) =>
          node.id === id ? { ...node, position } : node
        )
      );
      
      await api.updateNode(id, { position });
    } catch (error) {
      console.error('Failed to update node position:', error);
      if (isMounted.current) {
        setError('Failed to update node position');
        // Reload data to revert
        await loadData();
      }
    }
  }, [loadData]);

  const deleteNodeWithChildren = useCallback(async (nodeId: string) => {
    if (!window.confirm('آیا از حذف این گره و تمام زیرمجموعه‌های آن اطمینان دارید؟')) {
      return;
    }
    
    try {
      console.log(`Deleting node ${nodeId} and all descendants...`);
      
      // Optimistic update - remove from UI immediately
      setNodes((nds) => nds.filter((n) => n.id !== nodeId));
      setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
      
      // API call that now deletes nodes, edges, AND formData
      const result = await api.deleteNodeAndRelations(nodeId);
      
      console.log(`Deleted:`, result);
      
      // Reload to ensure consistency
      await loadData();
    } catch (error) {
      console.error('Failed to delete node:', error);
      if (isMounted.current) {
        setError('Failed to delete node');
        await loadData();
      }
    }
  }, [loadData]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Manual refresh function
  const refreshData = useCallback(async () => {
    await loadData();
  }, [loadData]);

  return {
    nodes,
    edges,
    loading,
    error,
    formDataMap,
    setNodes,
    setEdges,
    loadData,
    refreshData,
    addEdge,
    updateNodePosition,
    deleteNode: deleteNodeWithChildren,
    clearError
  };
};
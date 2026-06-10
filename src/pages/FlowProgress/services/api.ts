import { NodeFormData } from '../schemas/nodeFormSchema';

export interface NodeData {
  id: string;
  position: { x: number; y: number };
  type: 'start' | 'process' | 'input' | 'decision';
  parentId: string | null;
  formDataId: string;
  data?: {
    label?: string;
    description?: string;
    executionProcess?: string;
  };
}

export interface EdgeData {
  id: string;
  source: string;
  target: string;
  type: string;
}

export interface FormData extends NodeFormData {
  id: string;
}

const API_BASE_URL = '/api/flow';

async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// ============ NODE OPERATIONS ============

export const fetchNodes = async (): Promise<NodeData[]> => {
  return fetchAPI<NodeData[]>('/nodes');
};

export const fetchEdges = async (): Promise<EdgeData[]> => {
  return fetchAPI<EdgeData[]>('/edges');
};

export const saveNode = async (node: NodeData): Promise<NodeData> => {
  return fetchAPI<NodeData>('/nodes', {
    method: 'POST',
    body: JSON.stringify(node),
  });
};

export const updateNode = async (id: string, updates: Partial<NodeData>): Promise<NodeData> => {
  return fetchAPI<NodeData>(`/nodes/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
};

export const deleteNode = async (id: string): Promise<void> => {
  await fetchAPI(`/nodes/${id}`, { method: 'DELETE' });
};

// ============ EDGE OPERATIONS ============

export const saveEdge = async (edge: EdgeData): Promise<EdgeData> => {
  return fetchAPI<EdgeData>('/edges', {
    method: 'POST',
    body: JSON.stringify(edge),
  });
};

export const deleteEdge = async (id: string): Promise<void> => {
  await fetchAPI(`/edges/${id}`, { method: 'DELETE' });
};

// ============ FORM DATA OPERATIONS ============

export const fetchAllFormData = async (): Promise<FormData[]> => {
  return fetchAPI<FormData[]>('/formData');
};

export const fetchFormDataByNodeId = async (nodeId: string): Promise<FormData | null> => {
  const allFormData = await fetchAPI<FormData[]>('/formData');
  return allFormData.find(fd => fd.nodeId === nodeId) || null;
};

// Save or Update formData (no duplicates)
export const saveOrUpdateFormData = async (formData: Partial<FormData> & { nodeId: string }): Promise<FormData> => {
  // Check if formData already exists for this node
  const existing = await fetchFormDataByNodeId(formData.nodeId);
  
  if (existing) {
    // UPDATE existing record (PUT)
    console.log(`Updating existing formData for node ${formData.nodeId}`, existing.id);
    return fetchAPI<FormData>(`/formData/${existing.id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...existing, ...formData, id: existing.id }),
    });
  } else {
    // CREATE new record (POST)
    console.log(`Creating new formData for node ${formData.nodeId}`);
    const newId = `form_${formData.nodeId}`;
    return fetchAPI<FormData>('/formData', {
      method: 'POST',
      body: JSON.stringify({ ...formData, id: newId }),
    });
  }
};

// Legacy function for backward compatibility
export const saveFormData = async (formData: FormData): Promise<FormData> => {
  return saveOrUpdateFormData(formData);
};

export const updateFormDataByNodeId = async (nodeId: string, updates: Partial<FormData>): Promise<FormData | null> => {
  const existing = await fetchFormDataByNodeId(nodeId);
  
  if (existing) {
    console.log(`Updating formData for node ${nodeId}`, existing.id);
    return fetchAPI<FormData>(`/formData/${existing.id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }
  return null;
};

export const deleteFormData = async (id: string): Promise<void> => {
  await fetchAPI(`/formData/${id}`, { method: 'DELETE' });
};

// ============ ENRICHED NODES (with labels from formData) ============

export const fetchEnrichedNodes = async (): Promise<NodeData[]> => {
  console.log('fetchEnrichedNodes - START');
  const [nodes, formDataList] = await Promise.all([
    fetchNodes(),
    fetchAllFormData()
  ]);
  
  console.log(`Found ${nodes.length} nodes and ${formDataList.length} form data entries`);
  
  // Create a map keyed by formData.id for O(1) lookup
  const formDataById = new Map();
  formDataList.forEach(form => {
    formDataById.set(form.id, form);
  });
  
  const enrichedNodes = nodes.map(node => {
    // Look up by node.formDataId, not node.id
    const formData = formDataById.get(node.formDataId);
    const hasFormData = !!formData;
    
    console.log(`Node ${node.id} (formDataId: ${node.formDataId}): hasFormData=${hasFormData}, label=${formData?.label || 'NO LABEL'}`);    
    
    return {
      ...node,
      data: {
        label: formData?.label || node.id,
        description: formData?.description || '',
        executionProcess: formData?.executionProcess || '',
        finalProcess: formData?.finalProcess || ''
      }
    };
  });
  
  console.log('Enriched nodes ready with labels: ', enrichedNodes.map(n => ({
    id: n.id,
    formDataId: n.formDataId,
    label: n.data?.label
  })));
  return enrichedNodes;
};

// ============ CASCADE DELETE INCLUDING FORMDATA ============

export const deleteNodeAndRelations = async (nodeId: string): Promise<{
  deletedNodes: string[];
  deletedEdges: string[];
  deletedFormData: string[];
}> => {
  console.log(`Deleting node ${nodeId} and all relations...`);
  
  const allNodes = await fetchNodes();
  const allEdges = await fetchEdges();
  const allFormData = await fetchAllFormData();
  
  const findDescendants = (id: string): string[] => {
    const children = allNodes.filter(node => node.parentId === id);
    return [id, ...children.flatMap(child => findDescendants(child.id))];
  };
  
  const nodesToDelete = findDescendants(nodeId);
  console.log(`Nodes to delete:`, nodesToDelete);
  
  const edgesToDelete = allEdges.filter(
    edge => nodesToDelete.includes(edge.source) || nodesToDelete.includes(edge.target)
  );
  console.log(`Edges to delete:`, edgesToDelete.map(e => e.id));
  
  // collect formData IDs directly from the nodes
  const formDataIdsToDelete = allNodes
    .filter(node => nodesToDelete.includes(node.id))
    .map(node => node.formDataId)
    .filter(id => id);
  
  console.log(`FormData IDs to delete:`, formDataIdsToDelete);
  
  await Promise.all(edgesToDelete.map(edge => deleteEdge(edge.id)));
  await Promise.all(formDataIdsToDelete.map(fdId => deleteFormData(fdId)));
  await Promise.all(nodesToDelete.map(id => deleteNode(id)));
  
  console.log(`Deleted ${nodesToDelete.length} nodes, ${edgesToDelete.length} edges, ${formDataIdsToDelete.length} formData entries`);
  
  return {
    deletedNodes: nodesToDelete,
    deletedEdges: edgesToDelete.map(e => e.id),
    deletedFormData: formDataIdsToDelete
  };
};

// ============ fix existing mismatches ============
export const fixAllFormDataReferences = async () => {
  const nodes = await fetchNodes();
  const allFormData = await fetchAllFormData();
  const formDataById = new Map(allFormData.map(fd => [fd.id, fd]));

  for (const node of nodes) {
    // Ensure node.formDataId points to an existing formData record
    const linked = formDataById.get(node.formDataId);
    if (linked && linked.nodeId !== node.id) {
      console.log(`Fixing formData ${linked.id}: nodeId ${linked.nodeId} → ${node.id}`);
      await updateFormData(linked.id, { nodeId: node.id });
    } else if (!linked) {
      console.warn(`Node ${node.id} has invalid formDataId ${node.formDataId}. Creating new formData.`);
      // Create a fresh formData for this node (optional, but safe)
      const newId = `form_${node.id}`;
      const newFormData = {
        id: newId,
        nodeId: node.id,
        label: node.data?.label || node.id,
        executionProcess: '',
        nextProcess: [],
        previousProcess: null,
        finalProcess: '',
        type: node.type,
        description: ''
      };
      const saved = await saveFormData(newFormData);
      await updateNode(node.id, { formDataId: saved.id });
    }
  }

  // Delete orphaned formData (no node references them)
  const validFormDataIds = new Set(nodes.map(n => n.formDataId));
  const orphaned = allFormData.filter(fd => !validFormDataIds.has(fd.id));
  for (const fd of orphaned) {
    console.log(`Deleting orphaned formData ${fd.id} (nodeId: ${fd.nodeId})`);
    await deleteFormData(fd.id);
  }
};

export const updateFormData = async (id: string, updates: Partial<FormData>): Promise<FormData> => {
  return fetchAPI<FormData>(`/formData/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
};

// ============ CLEANUP DUPLICATES ============

export const deduplicateFormData = async (): Promise<number> => {
  const formDataList = await fetchAllFormData();
  const nodeFormMap = new Map<string, FormData>();
  const duplicates: string[] = [];
  
  formDataList.forEach(form => {
    if (nodeFormMap.has(form.nodeId)) {
      // Keep the first one, mark second for deletion
      duplicates.push(form.id);
      console.log(`Duplicate found for node ${form.nodeId}, removing ${form.id}`);
    } else {
      nodeFormMap.set(form.nodeId, form);
    }
  });
  
  for (const id of duplicates) {
    await deleteFormData(id);
  }
  
  return duplicates.length;
};


import ELK from 'elkjs';
import { Node, Edge } from '@xyflow/react';
import { resolveCollisions, getNodeDimensions } from './collisionResolver';

const MIN_NODE_DISTANCE = 100;
const nodeDimensions: Record<string, { width: number; height: number }> = {
  start: { width: 150, height: 90 },
  process: { width: 170, height: 80 },
  input: { width: 170, height: 80 },
  decision: { width: 110, height: 110 },
};

export const getLayoutedElements = async (
  nodes: Node[],
  edges: Edge[],
  direction: 'DOWN' | 'RIGHT'
): Promise<{ nodes: Node[]; edges: Edge[] }> => {
  const elk = new ELK();
  const isHorizontal = direction === 'RIGHT';

  const children = nodes.map((node) => {
    const dims = nodeDimensions[node.type as keyof typeof nodeDimensions] || { width: 120, height: 60 };
    return {
      id: node.id,
      width: dims.width,
      height: dims.height,
      originalNode: node,
    };
  });

  const elkEdges = edges.map((edge) => ({
    id: edge.id,
    sources: [edge.source],
    targets: [edge.target],
  }));

  const graph = {
    id: 'root',
    layoutOptions: {
      'elk.algorithm': 'layered',
      'elk.direction': direction,
      'elk.layered.spacing.nodeNodeBetweenLayers': '100',
      'elk.spacing.nodeNode': '100',
      'elk.edgeRouting': 'ORTHOGONAL',
    },
    children,
    edges: elkEdges,
  };

  try {
    const layoutedGraph = await elk.layout(graph);
    let layoutedNodes = (layoutedGraph.children ?? []).map((child) => {
      const originalNode = (child as any).originalNode as Node;
      return {
        ...originalNode,
        position: { x: child.x ?? 0, y: child.y ?? 0 },
        targetPosition: isHorizontal ? 'left' : 'top',
        sourcePosition: isHorizontal ? 'right' : 'bottom',
      };
    });

    // Use robust collision resolver
    const { resolvedNodes, overlapsRemaining } = resolveCollisions(
      layoutedNodes,
      MIN_NODE_DISTANCE,
      150,
      15
    );
    if (overlapsRemaining) {
      console.warn('Some overlaps remain after collision resolution – consider increasing maxIterations or margin');
    }
    layoutedNodes = resolvedNodes;

    return { nodes: layoutedNodes, edges };
  } catch (error) {
    console.error('ELK layout failed:', error);
    return { nodes, edges };
  }
};
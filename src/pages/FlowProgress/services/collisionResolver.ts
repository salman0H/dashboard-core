import { Node } from '@xyflow/react';

export interface NodeDimensions {
  width: number;
  height: number;
}

// Default dimensions per node type (used when actual dimensions not available)
const defaultDimensions: Record<string, NodeDimensions> = {
  start: { width: 120, height: 60 },
  process: { width: 140, height: 50 },
  input: { width: 140, height: 50 },
  decision: { width: 80, height: 80 },
};

// Get actual or fallback dimensions for a node
export function getNodeDimensions(node: Node): NodeDimensions {
  if (node.width && node.height) {
    return { width: node.width, height: node.height };
  }
  const dim = defaultDimensions[node.type as keyof typeof defaultDimensions];
  return dim ?? { width: 120, height: 60 };
}

// Check if two nodes overlap with a given margin
export function nodesOverlap(
  a: Node,
  b: Node,
  margin: number,
  dimsA?: NodeDimensions,
  dimsB?: NodeDimensions
): boolean {
  const dimA = dimsA ?? getNodeDimensions(a);
  const dimB = dimsB ?? getNodeDimensions(b);
  const halfW = (dimA.width + dimB.width) / 2 + margin;
  const halfH = (dimA.height + dimB.height) / 2 + margin;
  const dx = Math.abs(a.position.x - b.position.x);
  const dy = Math.abs(a.position.y - b.position.y);
  return dx < halfW && dy < halfH;
}

// Iterative repulsion resolver – guarantees no overlaps after max iterations
export function resolveCollisions(
  nodes: Node[],
  margin: number = 30,
  maxIterations: number = 200,
  stepSize: number = 10
): { resolvedNodes: Node[]; iterations: number; overlapsRemaining: boolean } {
  let resolved = nodes.map(n => ({ ...n, position: { ...n.position } }));
  let hasOverlap = true;
  let iter = 0;
  const dimensions = new Map(resolved.map(n => [n.id, getNodeDimensions(n)]));

  while (hasOverlap && iter < maxIterations) {
    hasOverlap = false;
    for (let i = 0; i < resolved.length; i++) {
      const a = resolved[i];
      const dimA = dimensions.get(a.id)!;
      for (let j = i + 1; j < resolved.length; j++) {
        const b = resolved[j];
        const dimB = dimensions.get(b.id)!;
        if (nodesOverlap(a, b, margin, dimA, dimB)) {
          hasOverlap = true;
          // Move apart
          const dx = a.position.x - b.position.x;
          const dy = a.position.y - b.position.y;
          const angle = Math.atan2(dy, dx);
          const move = stepSize;
          const moveX = Math.cos(angle) * move;
          const moveY = Math.sin(angle) * move;
          a.position.x += moveX;
          a.position.y += moveY;
          b.position.x -= moveX;
          b.position.y -= moveY;
        }
      }
    }
    iter++;
  }

  // Final check
  let finalOverlap = false;
  for (let i = 0; i < resolved.length && !finalOverlap; i++) {
    const a = resolved[i];
    const dimA = dimensions.get(a.id)!;
    for (let j = i + 1; j < resolved.length; j++) {
      const b = resolved[j];
      const dimB = dimensions.get(b.id)!;
      if (nodesOverlap(a, b, margin, dimA, dimB)) {
        finalOverlap = true;
        break;
      }
    }
  }

  return { resolvedNodes: resolved, iterations: iter, overlapsRemaining: finalOverlap };
}
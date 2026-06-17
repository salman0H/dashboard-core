import { DashboardStats, SubstationSummary } from '@/pages/Home/types/dashboard.types';

export const fetchDashboardData = async () => {
  const [nodesRes, edgesRes, diagramRes] = await Promise.all([
    fetch('/api/flow/nodes'),
    fetch('/api/flow/edges'),
    fetch('/api/substation/diagram'),
  ]);
  const nodes = await nodesRes.json();
  const edges = await edgesRes.json();
  const diagram = await diagramRes.json();

  const stats: DashboardStats = {
    totalNodes: nodes.length,
    totalEdges: edges.length,
  };

  const substations: SubstationSummary[] = diagram.substations.map((sub: any) => ({
    id: sub.id,
    name: sub.name,
    location: sub.tooltipInfo?.Location || '—',
    componentCount: diagram.components.filter((c: any) => c.substationId === sub.id).length,
  }));

  return { stats, substations };
};
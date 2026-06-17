export interface DashboardStats {
  totalNodes: number;
  totalEdges: number;
}

export interface SubstationSummary {
  id: string;
  name: string;
  location: string;
  componentCount: number;
}
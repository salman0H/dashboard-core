import { useQuery } from "@tanstack/react-query";
import type { DiagramData } from "../type/diagram";

const fetchDiagram = async (): Promise<DiagramData> => {
  const response = await fetch("/api/substation/diagram");
  if (!response.ok) throw new Error("Failed to fetch diagram data");
  return response.json();
};

export const useDiagramData = (refetchIntervalMs: number = 3000) => {
  return useQuery({
    queryKey: ["diagram"],
    queryFn: fetchDiagram,
    refetchInterval: refetchIntervalMs,
    staleTime: 1000,
    retry: 2,
  });
};
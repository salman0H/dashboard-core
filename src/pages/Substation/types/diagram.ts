export interface TooltipInfo {
  [key: string]: string | number;
}

export interface Substation {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  tooltipInfo: TooltipInfo;
}

export type ComponentType =
  | "potential-transformer"
  | "current-transformer"
  | "circuit-breaker-closed"
  | "circuit-breaker-open"
  | "ground"
  | "fused-disconnector"
  | "inline-disconnector"
  | "relay-box"
  | "junction"
  | "text-block"
  | "diagram-title"
  | "earthing-switch"
  | "power-transformer"
  | "capacitor-bank"
  | "lightning-arrester"
  | "busbar-section"
  | "battery-bank"
  | "ansi-protection";

export interface Component {
  id: string;
  name: string;
  type: ComponentType;
  substationId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  tooltipInfo: TooltipInfo;
  extraData?: {
    lines?: string[];
    anchor?: "start" | "middle" | "end";
    fontSize?: number;
    bold?: boolean;
    label?: string;
  };
}

export type ConnectionStyle = "straight" | "orthogonal" | "busbar" | "fork";

export interface Connection {
  id: string;
  from: string;
  to: string;
  style: ConnectionStyle;
  color: string;
  dashed: boolean;
  endX?: number; // Manual override handles for structural ends
  endY?: number;
}

export interface DiagramData {
  substations: Substation[];
  components: Component[];
  connections: Connection[];
}

export interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  content: TooltipInfo;
  title: string;
}
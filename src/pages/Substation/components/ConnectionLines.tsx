import { memo, useMemo } from "react";
import type { Connection, Component } from "../types/diagram";

interface ConnectionLineProps {
  connection: Connection;
  components: Component[];
}

const BLUE = "#1a5fb4";
const SW = 1.8;

export const ConnectionLine = memo(({ connection, components }: ConnectionLineProps) => {
  const path = useMemo(() => {
    const fromComp = components.find((c) => c.id === connection.from);
    const toComp = components.find((c) => c.id === connection.to);

    let startX = fromComp ? fromComp.x : 340;
    let startY = fromComp ? fromComp.y : 50;
    let endX = toComp ? toComp.x : 340;
    let endY = toComp ? toComp.y : 455;

    // Custom override configurations mapping individual layouts
    if (connection.id === "incoming-left-vert") {
      return `M 245 50 L 245 88 L 282 88`;
    }
    if (connection.id === "ct-internal-line") {
      return `M 340 200 L 340 296`;
    }
    if (connection.id === "busbar-main-line") {
      return `M 0 455 L 858 455 M 852 450 L 868 460`;
    }
    if (connection.id === "busbar-bottom-fork") {
      return `M 340 455 L 340 510 M 328 504 L 352 518 M 336 504 L 360 518`;
    }

    if (connection.endX !== undefined) endX = connection.endX;
    if (connection.endY !== undefined) endY = connection.endY;

    if (connection.style === "orthogonal") {
      return `M ${startX} ${startY} L ${endX} ${startY} L ${endX} ${endY}`;
    }

    return `M ${startX} ${startY} L ${endX} ${endY}`;
  }, [connection, components]);

  // Adjust for visual artifacts
  const strokeWidth = connection.style === "busbar" ? 4 : connection.id === "ct-tap-3s" || connection.id === "ct-tap-2s" ? 1.2 : SW;

  return (
    <g>
      <path
        d={path}
        stroke={connection.color || BLUE}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={connection.dashed ? "5,4" : undefined}
      />
      {connection.id === "ct-internal-line" && (
        <rect x={308} y={200} width={64} height={115} fill="none" stroke={BLUE} strokeWidth={1.3} />
      )}
      {connection.id === "ct-internal-line" && (
        <>
          <text x={374} y={208} fontSize="8.5" fontFamily="monospace" fill={BLUE}>P2</text>
          <text x={374} y={314} fontSize="8.5" fontFamily="monospace" fill={BLUE}>P1</text>
        </>
      )}
      {connection.id === "ct-tap-1s-metering" && (
        <text x={545} y={300} fontSize="9" fontFamily="monospace" fill={BLUE}>METERING</text>
      )}
      {connection.id === "metering-right" && (
        <text x={545} y={120} fontSize="9" fontFamily="monospace" fill={BLUE}>METERING</text>
      )}
    </g>
  );
});

ConnectionLine.displayName = "ConnectionLine";
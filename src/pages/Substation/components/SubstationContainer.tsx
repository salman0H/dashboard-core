import { memo } from "react";
import type { Substation } from "../types/diagram";

interface SubstationContainerProps {
  substation: Substation;
  onMouseEnter: (e: React.MouseEvent, name: string, info: Record<string, string | number>) => void;
  onMouseLeave: () => void;
  onMouseMove: (e: React.MouseEvent) => void;
}

export const SubstationContainer = memo(
  ({ substation, onMouseEnter, onMouseLeave, onMouseMove }: SubstationContainerProps) => {
    const { x, y, width, height, name, tooltipInfo } = substation;

    return (
      <g
        onMouseEnter={(e) => onMouseEnter(e, name, tooltipInfo)}
        onMouseLeave={onMouseLeave}
        onMouseMove={onMouseMove}
        className="cursor-pointer"
      >
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill="#f8f9fa"
          stroke="#0066cc"
          strokeWidth="2"
          rx="4"
        />
        <text
          x={x + width / 2}
          y={y + 25}
          textAnchor="middle"
          fontSize="16"
          fontWeight="bold"
          fill="#0066cc"
          direction="rtl"
        >
          {name}
        </text>
      </g>
    );
  }
);

SubstationContainer.displayName = "SubstationContainer";

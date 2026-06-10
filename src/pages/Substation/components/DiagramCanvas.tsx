import { memo, useState, useCallback } from "react";
import type { DiagramData, TooltipState } from "../types/diagram";
import { ComponentSymbol } from "./ComponentSymbol";
import { ConnectionLine } from "./ConnectionLines";
import { SubstationContainer } from "./SubstationContainer";
import { Tooltip } from "./Tooltip";

interface DiagramCanvasProps {
  data: DiagramData;
  width?: number;
  height?: number;
}

export const DiagramCanvas = memo(({ data, width = 900, height = 540 }: DiagramCanvasProps) => {
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    content: {},
    title: "",
  });

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent, title: string, content: Record<string, string | number>) => {
      setTooltip({
        visible: true,
        x: e.clientX,
        y: e.clientY,
        content,
        title,
      });
    },
    []
  );

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setTooltip((prev) => ({
      ...prev,
      x: e.clientX,
      y: e.clientY,
    }));
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height}`}
        className="block bg-white"
        onMouseMove={handleMouseMove}
      >
        {/* Substation borders (drawn behind everything) */}
        {data.substations.map((substation) => (
          <SubstationContainer
            key={substation.id}
            substation={substation}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
          />
        ))}

        {/* Connections (lines) */}
        {data.connections.map((connection) => (
          <ConnectionLine
            key={connection.id}
            connection={connection}
            components={data.components}
          />
        ))}

        {/* Electrical components (symbols) */}
        {data.components.map((component) => (
          <ComponentSymbol
            key={component.id}
            component={component}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
          />
        ))}
      </svg>
      <Tooltip tooltip={tooltip} />
    </div>
  );
});

DiagramCanvas.displayName = "DiagramCanvas";
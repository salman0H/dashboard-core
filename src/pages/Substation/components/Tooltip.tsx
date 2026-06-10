import { memo } from "react";
import type { TooltipState } from "../types/diagram";

interface TooltipProps {
  tooltip: TooltipState;
}

export const Tooltip = memo(({ tooltip }: TooltipProps) => {
  if (!tooltip.visible) return null;

  const { x, y, title, content } = tooltip;
  const isNearRightEdge = x > window.innerWidth - 230;

  return (
    <div
      className="fixed pointer-events-none z-50"
      style={{
        left: `${x + 14}px`,
        top: `${y - 10}px`,
        transform: isNearRightEdge ? "translateX(-110%)" : undefined,
      }}
    >
      <div
        className="bg-[#1e3a5f] border border-blue-500 rounded-md px-3 py-2 min-w-[160px] shadow-lg font-mono text-[11px]"
      >
        <div className="text-blue-300 font-bold mb-1">{title}</div>
        {Object.entries(content).map(([key, value]) => (
          <div key={key} className="flex justify-between gap-2.5 mb-0.5">
            <span className="text-slate-400">{key}</span>
            <span className="text-slate-100 font-semibold">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
});

Tooltip.displayName = "Tooltip";
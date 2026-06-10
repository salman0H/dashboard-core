import { memo } from "react";
import type { Component } from "../types/diagram";

interface ComponentSymbolProps {
  component: Component;
  onMouseEnter: (e: React.MouseEvent, name: string, info: Record<string, string | number>) => void;
  onMouseLeave: () => void;
  onMouseMove: (e: React.MouseEvent) => void;
}

const BLUE = "#1a5fb4";
const SW = 1.8;

const T = ({ x, y, s = 9, anchor = "start", bold = false, children }: any) => (
  <text
    x={x} y={y} textAnchor={anchor} fontSize={s}
    fontFamily="'Courier New', monospace"
    fontWeight={bold ? "700" : "400"} fill={BLUE}
  >
    {children}
  </text>
);

export const ComponentSymbol = memo(({ component, onMouseEnter, onMouseLeave, onMouseMove }: ComponentSymbolProps) => {
  const { type, x, y, width, height, name, tooltipInfo, extraData } = component;

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (tooltipInfo && Object.keys(tooltipInfo).length > 0) {
      onMouseEnter(e, name, tooltipInfo);
    }
  };

  switch (type) {
    case "diagram-title":
      return (
        <T x={x} y={y} s={extraData?.fontSize} anchor={extraData?.anchor} bold={extraData?.bold}>
          {name}
        </T>
      );

    case "fused-disconnector":
      return (
        <g onMouseEnter={handleMouseEnter} onMouseLeave={onMouseLeave} onMouseMove={onMouseMove} style={{ cursor: "crosshair" }}>
          <line x1={x} y1={y} x2={x + 10} y2={y} stroke={BLUE} strokeWidth={SW} />
          <line x1={x + 10} y1={y - 6} x2={x + 10} y2={y + 6} stroke={BLUE} strokeWidth={SW} />
          <rect x={x + 12} y={y - 4} width={20} height={8} fill="white" stroke={BLUE} strokeWidth={1.4} />
          <line x1={x + 16} y1={y} x2={x + 24} y2={y} stroke={BLUE} strokeWidth={1.2} strokeDasharray="2,2" />
          <line x1={x + 32} y1={y - 6} x2={x + 32} y2={y + 6} stroke={BLUE} strokeWidth={SW} />
          <line x1={x + 32} y1={y} x2={x + 58} y2={y} stroke={BLUE} strokeWidth={SW} />
        </g>
      );

    case "inline-disconnector":
      return (
        <g onMouseEnter={handleMouseEnter} onMouseLeave={onMouseLeave} onMouseMove={onMouseMove} style={{ cursor: "crosshair" }}>
          <line x1={x} y1={y} x2={x + 8} y2={y} stroke={BLUE} strokeWidth={SW} />
          <line x1={x + 8} y1={y - 5} x2={x + 8} y2={y + 5} stroke={BLUE} strokeWidth={SW} />
          <line x1={x + 24} y1={y - 5} x2={x + 24} y2={y + 5} stroke={BLUE} strokeWidth={SW} />
          <line x1={x + 24} y1={y} x2={x + 62} y2={y} stroke={BLUE} strokeWidth={SW} />
        </g>
      );

    case "potential-transformer":
      const pr = 10;
      return (
        <g onMouseEnter={handleMouseEnter} onMouseLeave={onMouseLeave} onMouseMove={onMouseMove} style={{ cursor: "crosshair" }}>
          <circle cx={x} cy={y} r={pr} fill="white" stroke={BLUE} strokeWidth={SW} />
          <circle cx={x + pr * 1.3} cy={y} r={pr} fill="white" stroke={BLUE} strokeWidth={SW} />
        </g>
      );

    case "current-transformer":
      const cr = 9;
      return (
        <g onMouseEnter={handleMouseEnter} onMouseLeave={onMouseLeave} onMouseMove={onMouseMove} style={{ cursor: "crosshair" }}>
          <line x1={x} y1={y - cr - 5} x2={x} y2={y + cr + 5} stroke={BLUE} strokeWidth={SW} />
          <circle cx={x} cy={y} r={cr} fill="white" stroke={BLUE} strokeWidth={SW} />
          {extraData?.label && <T x={x - 30} y={y + 4} s={8}>{extraData.label}</T>}
        </g>
      );

    case "circuit-breaker-open":
      const sz = width || 26;
      return (
        <g onMouseEnter={handleMouseEnter} onMouseLeave={onMouseLeave} onMouseMove={onMouseMove} style={{ cursor: "crosshair" }}>
          <line x1={x} y1={y - sz / 2 - 6} x2={x} y2={y - sz / 2} stroke={BLUE} strokeWidth={SW} />
          <rect x={x - sz / 2} y={y - sz / 2} width={sz} height={sz} fill="white" stroke={BLUE} strokeWidth={SW} />
          <line x1={x - sz / 2 + 3} y1={y + sz / 2 - 3} x2={x + sz / 2 - 3} y2={y - sz / 2 + 3} stroke={BLUE} strokeWidth={SW} />
          <line x1={x} y1={y + sz / 2} x2={x} y2={y + sz / 2 + 6} stroke={BLUE} strokeWidth={SW} />
        </g>
      );

    case "relay-box":
      return (
        <g onMouseEnter={handleMouseEnter} onMouseLeave={onMouseLeave} onMouseMove={onMouseMove} style={{ cursor: "crosshair" }}>
          <rect x={x} y={y} width={width} height={height} fill="white" stroke={BLUE} strokeWidth={1.3} />
          {extraData?.lines?.map((line: string, i: number) => (
            <T key={i} x={x + width / 2} y={y + 11 + i * 10} s={7.5} anchor="middle" bold={i === 0}>{line}</T>
          ))}
        </g>
      );

    case "text-block":
      return (
        <g>
          {extraData?.lines?.map((line: string, i: number) => (
            <T key={i} x={x} y={y + i * (i === 0 ? 11 : 12)} s={i === 0 ? 8 : 7.5} bold={i === 0}>
              {line}
            </T>
          ))}
        </g>
      );

    case "earthing-switch":
      return (
        <g onMouseEnter={handleMouseEnter} onMouseLeave={onMouseLeave} onMouseMove={onMouseMove} style={{ cursor: "crosshair" }}>
          {/* Vertical line down from connection point */}
          <line x1={x} y1={y - 8} x2={x} y2={y + 6} stroke={BLUE} strokeWidth={SW} />
          {/* Triangle-like earth symbol */}
          <polygon points={`${x-4},${y+2} ${x+4},${y+2} ${x},${y+8}`} fill="white" stroke={BLUE} strokeWidth={1.2} />
          {/* Horizontal ground plate */}
          <line x1={x-6} y1={y+10} x2={x+6} y2={y+10} stroke={BLUE} strokeWidth={SW} />
        </g>
      );
    
      case "power-transformer":
      const w = width || 50;
      const h = height || 50;
      return (
        <g onMouseEnter={handleMouseEnter} onMouseLeave={onMouseLeave} onMouseMove={onMouseMove} style={{ cursor: "crosshair" }}>
          <rect x={x - w/2} y={y - h/2} width={w} height={h} fill="white" stroke={BLUE} strokeWidth={SW} rx={4} />
          {/* Primary winding (left) */}
          <circle cx={x - w/4} cy={y} r={8} fill="none" stroke={BLUE} strokeWidth={1.2} />
          {/* Secondary winding (right) */}
          <circle cx={x + w/4} cy={y} r={8} fill="none" stroke={BLUE} strokeWidth={1.2} />
          {/* Core / mutual coupling line */}
          <line x1={x - w/4 - 2} y1={y} x2={x + w/4 + 2} y2={y} stroke={BLUE} strokeWidth={1} strokeDasharray="2,2" />
          {/* Label (e.g., 66/11kV) from extraData */}
          {extraData?.label && <T x={x} y={y + h/3} s={8} anchor="middle">{extraData.label}</T>}
        </g>
      );

    case "capacitor-bank":
      return (
        <g onMouseEnter={handleMouseEnter} onMouseLeave={onMouseLeave} onMouseMove={onMouseMove} style={{ cursor: "crosshair" }}>
          <line x1={x - 12} y1={y} x2={x - 6} y2={y} stroke={BLUE} strokeWidth={SW} />
          {/* Two parallel lines representing capacitor plates */}
          <line x1={x - 6} y1={y - 8} x2={x - 6} y2={y + 8} stroke={BLUE} strokeWidth={1.5} />
          <line x1={x + 6} y1={y - 8} x2={x + 6} y2={y + 8} stroke={BLUE} strokeWidth={1.5} />
          <line x1={x + 6} y1={y} x2={x + 12} y2={y} stroke={BLUE} strokeWidth={SW} />
          {/* Optional label: kVAr */}
          {extraData?.label && <T x={x} y={y - 12} s={7} anchor="middle">{extraData.label}</T>}
        </g>
      );

    case "lightning-arrester":
      return (
        <g onMouseEnter={handleMouseEnter} onMouseLeave={onMouseLeave} onMouseMove={onMouseMove} style={{ cursor: "crosshair" }}>
          <line x1={x} y1={y - 12} x2={x} y2={y + 12} stroke={BLUE} strokeWidth={SW} />
          <path d={`M ${x-6} ${y-4} L ${x+6} ${y-4} L ${x} ${y+4} Z`} fill="white" stroke={BLUE} strokeWidth={1.2} />
          <line x1={x} y1={y + 8} x2={x} y2={y + 18} stroke={BLUE} strokeWidth={SW} />
          <polygon points={`${x-4},${y+18} ${x+4},${y+18} ${x},${y+24}`} fill="white" stroke={BLUE} strokeWidth={1.2} />
        </g>
      );

    case "busbar-section":
      const len = width || 60;
      return (
        <g onMouseEnter={handleMouseEnter} onMouseLeave={onMouseLeave} onMouseMove={onMouseMove} style={{ cursor: "crosshair" }}>
          <line x1={x - len/2} y1={y} x2={x + len/2} y2={y} stroke={BLUE} strokeWidth={4} />
          {/* Small tick marks for bus sections */}
          {extraData?.showTicks && (
            <>
              <line x1={x - len/2 + 10} y1={y - 3} x2={x - len/2 + 10} y2={y + 3} stroke={BLUE} strokeWidth={1.5} />
              <line x1={x + len/2 - 10} y1={y - 3} x2={x + len/2 - 10} y2={y + 3} stroke={BLUE} strokeWidth={1.5} />
            </>
          )}
        </g>
      );

    case "battery-bank":
      return (
        <g onMouseEnter={handleMouseEnter} onMouseLeave={onMouseLeave} onMouseMove={onMouseMove} style={{ cursor: "crosshair" }}>
          <rect x={x - 15} y={y - 10} width={30} height={20} fill="white" stroke={BLUE} strokeWidth={1.2} rx={2} />
          {/* Positive (+) terminal */}
          <line x1={x - 8} y1={y - 5} x2={x - 2} y2={y - 5} stroke={BLUE} strokeWidth={1.5} />
          <line x1={x - 5} y1={y - 8} x2={x - 5} y2={y - 2} stroke={BLUE} strokeWidth={1.5} />
          {/* Negative (-) terminal */}
          <line x1={x + 2} y1={y - 5} x2={x + 8} y2={y - 5} stroke={BLUE} strokeWidth={1.5} />
          {/* Label */}
          {extraData?.label && <T x={x} y={y + 14} s={7} anchor="middle">{extraData.label}</T>}
        </g>
      );

    case "ansi-protection":
      return (
        <g onMouseEnter={handleMouseEnter} onMouseLeave={onMouseLeave} onMouseMove={onMouseMove} style={{ cursor: "crosshair" }}>
          <rect x={x - 20} y={y - 10} width={40} height={20} fill="#eef2ff" stroke={BLUE} strokeWidth={1} rx={3} />
          <T x={x} y={y + 3} s={8} anchor="middle" bold={true}>{extraData?.label || "ANSI"}</T>
        </g>
      );
    case "junction":
      return <circle cx={x} cy={y} r={3.5} fill={BLUE} />;

    default:
      return null;
  }
});

ComponentSymbol.displayName = "ComponentSymbol";
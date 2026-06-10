// src/utility/computeSubstationBounds.ts
import type { Component, Substation } from "../types/diagram";

export interface SubstationBounds {
  id: string;
  name: string;
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  tooltipInfo: string;
}

export function computeSubstationBounds(
  substations: Substation[],
  components: Component[]
): SubstationBounds[] {
  return substations.map((sub) => {
    const subComps = components.filter((c) => c.substationId === sub.id);
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    let hasValidComp = false;

    subComps.forEach((comp) => {
      // Use either the component's x,y or its bounding box if it has width/height
      let left = comp.x;
      let right = comp.x;
      let top = comp.y;
      let bottom = comp.y;
      if (comp.width && comp.height) {
        left = comp.x;
        right = comp.x + comp.width;
        top = comp.y;
        bottom = comp.y + comp.height;
      }
      // Skip if coordinates are invalid
      if (isNaN(left) || isNaN(top) || isNaN(right) || isNaN(bottom)) return;
      hasValidComp = true;
      minX = Math.min(minX, left, right);
      minY = Math.min(minY, top, bottom);
      maxX = Math.max(maxX, left, right);
      maxY = Math.max(maxY, top, bottom);
    });

    if (!hasValidComp) {
      // Fallback bounds if no valid component
      return {
        id: sub.id,
        name: sub.name,
        minX: 0,
        minY: 0,
        maxX: 100,
        maxY: 100,
        tooltipInfo: sub.tooltipInfo ? JSON.stringify(sub.tooltipInfo) : sub.name,
      };
    }

    // Add padding
    const padding = 20;
    return {
      id: sub.id,
      name: sub.name,
      minX: minX - padding,
      minY: minY - padding,
      maxX: maxX + padding,
      maxY: maxY + padding,
      tooltipInfo: sub.tooltipInfo ? JSON.stringify(sub.tooltipInfo) : sub.name,
    };
  });
}
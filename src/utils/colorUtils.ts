import { MARKER_COLORS } from "../lib/markerColors";
import type { PointOfInterestDTO } from "../types/api";

export function getNextAvailableColor(
  existingPoints: PointOfInterestDTO[]
): string {
  const usedColors = new Set(
    existingPoints.map((poi) => poi.color).filter(Boolean)
  );

  for (const color of MARKER_COLORS) {
    if (!usedColors.has(color)) {
      return color;
    }
  }

  return MARKER_COLORS[existingPoints.length % MARKER_COLORS.length];
}

export function ensureColorsAssigned(
  points: PointOfInterestDTO[]
): PointOfInterestDTO[] {
  const usedColors = new Set<string>();

  points.forEach((poi) => {
    if (poi.color) {
      usedColors.add(poi.color);
    }
  });

  let colorIndex = 0;
  return points.map((poi) => {
    if (poi.color) {
      return poi;
    }

    let color = MARKER_COLORS[colorIndex % MARKER_COLORS.length];
    while (usedColors.has(color)) {
      colorIndex++;
      color = MARKER_COLORS[colorIndex % MARKER_COLORS.length];
    }

    usedColors.add(color);
    colorIndex++;

    return { ...poi, color };
  });
}

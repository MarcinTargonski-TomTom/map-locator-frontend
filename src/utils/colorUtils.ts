import { MARKER_COLORS } from "../lib/markerColors";
import type { PointOfInterestDTO } from "../types/api";

/**
 * Gets the next available color for a new point of interest
 * @param existingPoints - Array of existing points of interest
 * @returns A color string from MARKER_COLORS that's not already in use, or cycles back to the beginning
 */
export function getNextAvailableColor(
  existingPoints: PointOfInterestDTO[]
): string {
  const usedColors = new Set(
    existingPoints.map((poi) => poi.color).filter(Boolean)
  );

  // Find the first unused color
  for (const color of MARKER_COLORS) {
    if (!usedColors.has(color)) {
      return color;
    }
  }

  // If all colors are used, return the color based on the number of existing points
  return MARKER_COLORS[existingPoints.length % MARKER_COLORS.length];
}

/**
 * Assigns colors to points of interest that don't have one assigned
 * This is useful for handling existing data that might not have colors
 * @param points - Array of points of interest to process
 * @returns Array with colors assigned to all points
 */
export function ensureColorsAssigned(
  points: PointOfInterestDTO[]
): PointOfInterestDTO[] {
  const usedColors = new Set<string>();

  // First pass: collect already assigned colors
  points.forEach((poi) => {
    if (poi.color) {
      usedColors.add(poi.color);
    }
  });

  // Second pass: assign colors to points that don't have them
  let colorIndex = 0;
  return points.map((poi) => {
    if (poi.color) {
      return poi;
    }

    // Find next available color
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

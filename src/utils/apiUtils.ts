import type { ApiResponse } from "../types/api";
import { ensureColorsAssigned } from "./colorUtils";

/**
 * Processes API responses to ensure all points of interest have colors assigned
 * @param responses - Array of API responses
 * @returns Array of API responses with colors assigned to all points of interest
 */
export function processApiResponses(responses: ApiResponse[]): ApiResponse[] {
  return responses.map((response) => {
    const pointsWithColors = ensureColorsAssigned(
      response.requestRegions.map((rr) => rr.pointOfInterest)
    );

    return {
      ...response,
      requestRegions: response.requestRegions.map((rr, index) => ({
        ...rr,
        pointOfInterest: pointsWithColors[index] || rr.pointOfInterest,
      })),
    };
  });
}

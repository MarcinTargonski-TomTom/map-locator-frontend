import type { ApiResponse } from "../types/api";
import { ensureColorsAssigned } from "./colorUtils";

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

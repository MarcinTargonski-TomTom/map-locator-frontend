import { createContext } from "react";
import type { ApiResponse, PointOfInterestDTO } from "../types/api";

export type MapContextType = {
  pointsOfInterest: PointOfInterestDTO[];
  setPointsOfInterest: (pois: PointOfInterestDTO[]) => void;
  regions: ApiResponse[] | null;
  setRegions: (regions: ApiResponse[] | null) => void;
  responseIndex: number;
  setResponseIndex: (index: number) => void;
  reset: () => void;
  removePhrases: () => void;
};

export const MapContext = createContext<MapContextType>({
  regions: null,
  setRegions: () => {},
  pointsOfInterest: [],
  setPointsOfInterest: () => {},
  responseIndex: 0,
  setResponseIndex: () => {},
  reset: () => {},
  removePhrases: () => {},
});

import { createContext } from "react";
import type {
  ApiResponse,
  PointOfInterestDTO,
  PolygonPoint,
  MortonTileData,
} from "../types/api";

export type MapContextType = {
  pointsOfInterest: PointOfInterestDTO[];
  setPointsOfInterest: (pois: PointOfInterestDTO[]) => void;
  regions: ApiResponse[] | null;
  setRegions: (regions: ApiResponse[] | null) => void;
  responseIndex: number;
  setResponseIndex: (index: number) => void;
  reset: () => void;
  removePhrases: () => void;
  polygonPoints: PolygonPoint[];
  setPolygonPoints: (points: PolygonPoint[]) => void;
  selectedLayer: number | null;
  setSelectedLayer: (layer: number | null) => void;
  mortonTiles: MortonTileData[];
  setMortonTiles: (tiles: MortonTileData[]) => void;
  isPolygonMode: boolean;
  setIsPolygonMode: (mode: boolean) => void;
  resetPolygon: () => void;
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
  polygonPoints: [],
  setPolygonPoints: () => {},
  selectedLayer: null,
  setSelectedLayer: () => {},
  mortonTiles: [],
  setMortonTiles: () => {},
  isPolygonMode: false,
  setIsPolygonMode: () => {},
  resetPolygon: () => {},
});

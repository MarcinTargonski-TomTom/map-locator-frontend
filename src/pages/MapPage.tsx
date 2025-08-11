import { useEffect, useState } from "react";
import Map from "../components/Map";
import type {
  PointOfInterestDTO,
  ApiResponse,
  PolygonPoint,
  MortonTileData,
} from "../types/api";
import { MapContext } from "../context/mapContext";
import { useToasts } from "tombac";

export default function MapPage() {
  const [pointsOfInterest, setPointsOfInterest] = useState<
    PointOfInterestDTO[]
  >([]);
  const [regions, setRegions] = useState<ApiResponse[] | null>(null);
  const [responseIndex, setResponseIndex] = useState<number>(0);

  const [polygonPoints, setPolygonPoints] = useState<PolygonPoint[]>([]);
  const [selectedLayer, setSelectedLayer] = useState<number | null>(null);
  const [mortonTiles, setMortonTiles] = useState<MortonTileData[]>([]);
  const [isPolygonMode, setIsPolygonMode] = useState<boolean>(false);

  useEffect(() => {
    if (!regions) return;

    const { requestRegions } = regions[responseIndex];
    setPointsOfInterest(requestRegions.map((region) => region.pointOfInterest));
  }, [responseIndex, regions]);

  const { addToast } = useToasts();

  const resetPolygon = () => {
    setPolygonPoints([]);
    setMortonTiles([]);
    addToast("Polygon has been cleared", "info");
  };
  return (
    <div className="min-h-screen flex flex-col relative">
      <MapContext.Provider
        value={{
          pointsOfInterest,
          setPointsOfInterest,
          regions,
          setRegions,
          responseIndex,
          setResponseIndex,
          reset: () => {
            setPointsOfInterest([]);
            setRegions(null);
            setResponseIndex(0);
            resetPolygon();
            addToast("All points and phrases have been cleared", "info");
          },
          removePhrases: () => {
            setPointsOfInterest(
              pointsOfInterest.filter((poi) => poi.center !== null)
            );
            addToast("All phrases have been cleared", "info");
          },
          polygonPoints,
          setPolygonPoints,
          selectedLayer,
          setSelectedLayer,
          mortonTiles,
          setMortonTiles,
          isPolygonMode,
          setIsPolygonMode,
          resetPolygon,
        }}
      >
        <Map />
      </MapContext.Provider>
    </div>
  );
}

import { useEffect, useState } from "react";
import Map from "../components/Map";
import type { PointOfInterestDTO, ApiResponse } from "../types/api";
import { MapContext } from "../context/mapContext";

export default function MapPage() {
  const [pointsOfInterest, setPointsOfInterest] = useState<
    PointOfInterestDTO[]
  >([]);
  const [regions, setRegions] = useState<ApiResponse[] | null>(null);
  const [responseIndex, setResponseIndex] = useState<number>(0);
  useEffect(() => {
    if (!regions) return;

    const { requestRegions } = regions[responseIndex];
    setPointsOfInterest(requestRegions.map((region) => region.pointOfInterest));
  }, [responseIndex, regions]);

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
          },
          removePhrases: () => {
            setPointsOfInterest(
              pointsOfInterest.filter((poi) => poi.center !== null)
            );
          },
        }}
      >
        <Map />
      </MapContext.Provider>
    </div>
  );
}

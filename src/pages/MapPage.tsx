import { useState } from "react";
import Map from "../components/Map";
import type { PointOfInterestDTO, ApiResponse } from "../types/api";
import { MapContext } from "../context/mapContext";
import { useToasts } from "tombac";

export default function MapPage() {
  const [pointsOfInterest, setPointsOfInterest] = useState<
    PointOfInterestDTO[]
  >([]);
  const [regions, setRegions] = useState<ApiResponse[] | null>(null);
  const [responseIndex, setResponseIndex] = useState<number>(0);
  const { addToast } = useToasts();
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
            addToast("All points and phrases have been cleared", "info");
          },
        }}
      >
        <Map />
      </MapContext.Provider>
    </div>
  );
}

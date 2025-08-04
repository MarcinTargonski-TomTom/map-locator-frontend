import type { Region as RegionType } from "../types/api";
import Polygon from "./Polygon";

export interface RegionProps {
  region: RegionType;
  regionId: string;
  color?: string;
  fillOpacity?: number;
  strokeWidth?: number;
  zIndex?: number;
}

export const Region = ({
  region,
  regionId,
  color = "#ff6b35",
  fillOpacity = 0.15,
  strokeWidth = 2,
}: RegionProps) => {
  return (
    <div key={regionId}>
      <Polygon
        vertices={region.boundary}
        color={color}
        opacity={fillOpacity}
        strokeWidth={strokeWidth}
        sourceId={regionId}
      />
      {/* <Marker lng={region.center.longitude} lat={region.center.latitude} /> */}
    </div>
  );
};

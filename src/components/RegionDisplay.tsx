import { useState, useEffect, useRef, memo } from "react";
import { withMap } from "legoland-shared";
import type { ApiResponse } from "../types/api";
import { Region } from "./Region";
import type { MapMouseEvent } from "mapbox-gl";
import MyTooltip from "./Tooltip";

interface HybridRegionsDisplayProps {
  apiResponse: ApiResponse;
  map?: any;
}

const MyRegionDisplay = memo(function HybridRegionsDisplay({
  apiResponse: { requestRegions, responseRegion },
  map,
}: HybridRegionsDisplayProps) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const lastHovered = useRef<string | null>(null);

  function getHoveredRegionId(e: MapMouseEvent): string | null {
    const features = map.queryRenderedFeatures(e.point, {
      layers: [
        ...requestRegions.map((_, index) => `request-region-${index}-fill`),
        "response-region-fill",
      ],
    });

    return features[0] ? features[0].layer.id.replace("-fill", "") : null;
  }

  function setStylesOnHoveredRegion(regionId: string | null) {
    const fillId = `${regionId}-fill`;
    const outlineId = `${regionId}-outline`;

    if (map.getLayer(fillId)) {
      const hoverOpacity = 0.7;
      const hoverWidth = 4;

      map.setPaintProperty(fillId, "fill-opacity", hoverOpacity);
      map.setPaintProperty(outlineId, "line-width", hoverWidth);
    }
  }

  function setDefaultStylesOnRegion(regionId: string | null) {
    const prevFillId = `${regionId}-fill`;
    const prevOutlineId = `${regionId}-outline`;

    const defaultOpacity = 0.2;
    const defaultWidth = 3;

    map.setPaintProperty(prevFillId, "fill-opacity", defaultOpacity);
    map.setPaintProperty(prevOutlineId, "line-width", defaultWidth);
  }

  useEffect(() => {
    const handleMapMouseMove = (e: MapMouseEvent) => {
      setMousePosition({ x: e.point.x, y: e.point.y });

      const newHovered = getHoveredRegionId(e);
      if (newHovered !== lastHovered.current) {
        setDefaultStylesOnRegion(lastHovered.current);
        if (newHovered) {
          setStylesOnHoveredRegion(newHovered);

          map.getCanvas().style.cursor = "pointer";
        } else {
          map.getCanvas().style.cursor = "";
        }

        lastHovered.current = newHovered;
        setHoveredRegion(newHovered);
      }
    };

    map.on("mousemove", handleMapMouseMove);
    return () => {
      map.off("mousemove", handleMapMouseMove);
    };
  }, [map, requestRegions.length]);

  return (
    <>
      {requestRegions.map(({ region }, index) => {
        return (
          <Region
            key={`request-region-${index}`}
            region={region}
            regionId={`request-region-${index}`}
          />
        );
      })}

      <Region
        region={responseRegion}
        regionId="response-region"
        color="#4caf50"
      ></Region>

      <MyTooltip
        isVisible={!!hoveredRegion}
        position={mousePosition}
        text={
          hoveredRegion === "response-region"
            ? "Response Region"
            : hoveredRegion
            ? requestRegions[parseInt(hoveredRegion.split("-")[2], 10)]
                .pointOfInterest.name || "Unnamed Region"
            : ""
        }
      />
    </>
  );
});

export default withMap(MyRegionDisplay as any);

import React, { useState, useEffect, useRef, useContext } from "react";
import { withMap } from "legoland-shared";
import { Region } from "./Region";
import type { MapMouseEvent, Map } from "mapbox-gl";
import MyTooltip from "./Tooltip";
import { MARKER_COLORS } from "../lib/markerColors";
import { MapContext } from "../context/mapContext";

interface RegionDisplayProps {
  map?: Map;
}

const RegionDisplay = function RegionDisplay({ map }: RegionDisplayProps) {
  const { regions, responseIndex } = useContext(MapContext);

  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const lastHovered = useRef<string | null>(null);

  useEffect(() => {
    if (!map || !regions || regions.length === 0) return;

    const { requestRegions, responseRegion } = regions[responseIndex];

    function getHoveredRegionId(e: MapMouseEvent): string | null {
      if (!map) return null;

      const features = map.queryRenderedFeatures(e.point, {
        layers: [
          ...requestRegions.map((_, index) => `request-region-${index}-fill`),
          ...(responseRegion.center !== null ? ["response-region-fill"] : []),
        ],
      });

      return features[0] ? features[0].layer.id.replace("-fill", "") : null;
    }

    function setStylesOnHoveredRegion(regionId: string | null) {
      if (regionId === null || !map) return;
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
      if (regionId === null || !map) return;
      const prevFillId = `${regionId}-fill`;
      const prevOutlineId = `${regionId}-outline`;
      const defaultOpacity = 0.2;
      const defaultWidth = 3;

      map.setPaintProperty(prevFillId, "fill-opacity", defaultOpacity);
      map.setPaintProperty(prevOutlineId, "line-width", defaultWidth);
    }

    const handleMapMouseMove = (e: MapMouseEvent) => {
      setMousePosition({ x: e.point.x, y: e.point.y });

      const newHovered = getHoveredRegionId(e);
      if (newHovered !== lastHovered.current) {
        if (newHovered) {
          setStylesOnHoveredRegion(newHovered);

          map.getCanvas().style.cursor = "pointer";
        } else {
          map.getCanvas().style.cursor = "";
        }
        setDefaultStylesOnRegion(lastHovered.current);

        lastHovered.current = newHovered;
        setHoveredRegion(newHovered);
      }
    };

    map.on("mousemove", handleMapMouseMove);

    return () => {
      map.off("mousemove", handleMapMouseMove);
    };
  }, [map, regions, responseIndex]);

  if (!map || !regions || regions.length === 0) return;

  const { requestRegions, responseRegion } = regions[responseIndex];

  return (
    <>
      {requestRegions.map(({ region }, index) => {
        return (
          <Region
            color={MARKER_COLORS[index % MARKER_COLORS.length]}
            key={`request-region-${index}`}
            region={region}
            regionId={`request-region-${index}`}
          />
        );
      })}

      {responseRegion.center && (
        <Region
          region={responseRegion}
          regionId="response-region"
          color="#de1c12"
        ></Region>
      )}

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
};

const RegionDisplayWithMap = withMap(
  RegionDisplay as React.ComponentType<unknown>
);
export default RegionDisplayWithMap;

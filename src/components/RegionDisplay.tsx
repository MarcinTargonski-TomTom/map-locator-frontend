import React, { useState, useEffect, useRef, useContext } from "react";
import { withMap } from "legoland-shared";
import { Region } from "./Region";
import type { MapMouseEvent, Map } from "mapbox-gl";
import MyTooltip from "./Tooltip";
import { MapContext } from "../context/mapContext";

interface RegionDisplayProps {
  map?: Map;
}

const RegionDisplay = function RegionDisplay({ map }: RegionDisplayProps) {
  const { regions, responseIndex, pointsOfInterest } = useContext(MapContext);

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
          ...requestRegions
            .map((region, index) =>
              region.pointOfInterest.isDisplayed
                ? `request-region-${index}-fill`
                : null
            )
            .filter((layerId): layerId is string => layerId !== null),
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
        if (lastHovered.current) {
          setDefaultStylesOnRegion(lastHovered.current);
        }

        if (newHovered) {
          const regionIndex = newHovered.startsWith("request-region-")
            ? parseInt(newHovered.split("-")[2], 10)
            : -1;

          const isDisplayed =
            regionIndex === -1 ||
            (requestRegions[regionIndex] &&
              requestRegions[regionIndex].pointOfInterest.isDisplayed);

          if (isDisplayed) {
            setStylesOnHoveredRegion(newHovered);
            map.getCanvas().style.cursor = "pointer";
          } else {
            map.getCanvas().style.cursor = "";
          }
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
  }, [map, responseIndex, regions]);

  useEffect(() => {
    if (!regions || regions.length < 1) {
      return;
    }
    const { requestRegions, responseRegion } = regions[responseIndex];

    const displayedRegions = requestRegions
      .map((reqRegion, originalIndex) => {
        if (!reqRegion.pointOfInterest.isDisplayed) return null;
        return {
          ...reqRegion,
          originalIndex,
        };
      })
      .filter((e) => e !== null);

    if (displayedRegions.length < 1) return;

    displayedRegions
      .sort((a, b) => b.pointOfInterest.order - a.pointOfInterest.order)
      .filter(
        (
          item
        ): item is (typeof requestRegions)[0] & { originalIndex: number } =>
          item !== null
      )
      .forEach(({ originalIndex }) => {
        map?.moveLayer(`request-region-${originalIndex}-fill`);
        map?.moveLayer(`request-region-${originalIndex}-outline`);
      });
    if (responseRegion.center) {
      map?.moveLayer("response-region-fill");
      map?.moveLayer("response-region-outline");
    }
  }, [map, regions, pointsOfInterest]);

  if (!map || !regions || regions.length === 0) return null;

  const { requestRegions, responseRegion } = regions[responseIndex];
  return (
    <>
      {requestRegions
        .map((reqRegion, originalIndex) => {
          if (!reqRegion.pointOfInterest.isDisplayed) return null;
          return {
            ...reqRegion,
            originalIndex,
          };
        })
        .filter(
          (
            item
          ): item is (typeof requestRegions)[0] & { originalIndex: number } =>
            item !== null
        )
        .sort((a, b) => b.pointOfInterest.order - a.pointOfInterest.order)
        .map(({ region, originalIndex, pointOfInterest }) => {
          return (
            <Region
              color={pointOfInterest.color}
              key={`request-region-${originalIndex}`}
              region={region}
              regionId={`request-region-${originalIndex}`}
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

import { useMap } from "legoland-shared";
import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import type { PolygonApiResponse } from "../types/api";

interface HeatmapMortonTileHoverHandlerProps {
  mortonTiles: PolygonApiResponse;
}

function HeatmapMortonTileHoverHandler({
  mortonTiles,
}: HeatmapMortonTileHoverHandlerProps) {
  const { map } = useMap();
  const popupRef = useRef<mapboxgl.Popup | null>(null);

  useEffect(() => {
    if (!map || mortonTiles.length === 0) return;

    const handleMortonTileHover = (e: mapboxgl.MapMouseEvent) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: ["morton-tiles"],
      });

      if (features.length > 0) {
        const feature = features[0];
        const { mortonCode, occurrences } = feature.properties!;

        if (popupRef.current) {
          popupRef.current.remove();
        }

        const popupContent = `
          <div style="font-family: Arial, sans-serif; padding: 8px; font-size: 12px;">
            <div style="font-weight: bold; margin-bottom: 4px;">Morton Tile</div>
            <div><strong>Code:</strong> ${mortonCode}</div>
            <div><strong>Occurrences:</strong> ${occurrences}</div>
          </div>
        `;

        popupRef.current = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false,
          offset: 10,
        })
          .setLngLat(e.lngLat)
          .setHTML(popupContent)
          .addTo(map);
      }
    };

    const handleMortonTileLeave = () => {
      if (popupRef.current) {
        popupRef.current.remove();
        popupRef.current = null;
      }
    };

    map.on("mousemove", "morton-tiles", handleMortonTileHover);
    map.on("mouseleave", "morton-tiles", handleMortonTileLeave);

    return () => {
      if (popupRef.current) {
        popupRef.current.remove();
      }
      map.off("mousemove", "morton-tiles", handleMortonTileHover);
      map.off("mouseleave", "morton-tiles", handleMortonTileLeave);
    };
  }, [map, mortonTiles]);

  return null;
}

export default HeatmapMortonTileHoverHandler;

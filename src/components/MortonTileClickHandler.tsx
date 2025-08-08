import { useMap } from "legoland-shared";
import { useContext, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { MapContext } from "../context/mapContext";

function MortonTileHoverHandler() {
  const { mortonTiles, isPolygonMode } = useContext(MapContext);
  const { map } = useMap();
  const popupRef = useRef<mapboxgl.Popup | null>(null);

  useEffect(() => {
    if (!map || !isPolygonMode || mortonTiles.length === 0) return;

    const handleMortonTileHover = (e: mapboxgl.MapMouseEvent) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: ["morton-tiles-fill"],
      });

      if (features.length > 0) {
        const feature = features[0];
        const { mortonCode, occurrences } = feature.properties!;

        if (popupRef.current) {
          popupRef.current.remove();
        }

        const popupContent = `
          <div style="font-family: Arial, sans-serif; padding: 8px; font-size: 12px;">
            <strong style="color: #333;">Morton Tile</strong><br/>
            <div style="margin: 4px 0;">
              <strong>Code:</strong> ${mortonCode}<br/>
              <strong>Occurrences:</strong> ${occurrences}
            </div>
          </div>
        `;

        popupRef.current = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false,
          className: "morton-tile-hover-popup",
          offset: [0, -10],
        })
          .setLngLat(e.lngLat)
          .setHTML(popupContent)
          .addTo(map);
      }
    };

    const handleMouseLeave = () => {
      map.getCanvas().style.cursor = "";

      if (popupRef.current) {
        popupRef.current.remove();
        popupRef.current = null;
      }
    };

    const handleMouseEnter = () => {
      map.getCanvas().style.cursor = "pointer";
    };

    map.on("mousemove", "morton-tiles-fill", handleMortonTileHover);
    map.on("mouseenter", "morton-tiles-fill", handleMouseEnter);
    map.on("mouseleave", "morton-tiles-fill", handleMouseLeave);

    return () => {
      if (popupRef.current) {
        popupRef.current.remove();
      }
      map.off("mousemove", "morton-tiles-fill", handleMortonTileHover);
      map.off("mouseenter", "morton-tiles-fill", handleMouseEnter);
      map.off("mouseleave", "morton-tiles-fill", handleMouseLeave);
    };
  }, [map, mortonTiles, isPolygonMode]);

  return null;
}

export default MortonTileHoverHandler;

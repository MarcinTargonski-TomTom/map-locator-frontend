import { useMap } from "legoland-shared";
import { useContext, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import { MapContext } from "../context/mapContext";
import type { PointOfInterestDTO } from "../types/api";
import { MARKER_COLORS } from "../lib/markerColors";

function MapClickHandler({
  onAddMapPoint,
  onShowPointDetails,
}: {
  onAddMapPoint: (lng: number, lat: number, tempId: string) => void;
  onShowPointDetails: (poi: PointOfInterestDTO, index: number) => void;
}) {
  const { pointsOfInterest } = useContext(MapContext);
  const { map } = useMap();
  const mapPoints = pointsOfInterest.filter(
    (poi: PointOfInterestDTO) => poi.center !== null
  );

  useEffect(() => {
    if (!map) return;

    const handleMapClick = (e: mapboxgl.MapMouseEvent) => {
      const { lng, lat } = e.lngLat;
      const tempId = `temp-${Date.now()}`;
      onAddMapPoint(lng, lat, tempId);
    };

    map.on("click", handleMapClick);

    return () => {
      map.off("click", handleMapClick);
    };
  }, [map, onAddMapPoint]);

  useEffect(() => {
    if (!map) return;

    const existingMarkers = document.querySelectorAll(".custom-marker");
    existingMarkers.forEach((marker) => marker.remove());

    mapPoints.forEach((poi, index) => {
      if (!poi.center) return;

      const el = document.createElement("div");
      el.className = "custom-marker";
      el.style.cursor = "pointer";
      el.title = `${
        poi.name
      } - Kliknij aby zobaczyć szczegóły (${poi.center.longitude.toFixed(
        4
      )}, ${poi.center.latitude.toFixed(4)})`;

      const color = MARKER_COLORS[index % MARKER_COLORS.length];

      el.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" 
                fill="${color}" 
                stroke="#ffffff" 
                stroke-width="0.5"/>
        </svg>
      `;
      el.style.filter = "drop-shadow(0 2px 4px rgba(0,0,0,0.3))";

      el.addEventListener("click", (e) => {
        e.stopPropagation();
        const poiIndex = pointsOfInterest.indexOf(poi);
        onShowPointDetails(poi, poiIndex);
      });

      new mapboxgl.Marker(el)
        .setLngLat([poi.center.longitude, poi.center.latitude])
        .addTo(map);
    });

    return () => {
      const markers = document.querySelectorAll(".custom-marker");
      markers.forEach((marker) => marker.remove());
    };
  }, [map, mapPoints, onShowPointDetails, MARKER_COLORS, pointsOfInterest]);

  return null;
}

export default MapClickHandler;

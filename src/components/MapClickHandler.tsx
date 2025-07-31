import { useMap } from "legoland-shared";
import { useEffect } from "react";
import type { PointOfInterest } from "../types/point";
import mapboxgl from "mapbox-gl";

function MapClickHandler({
  pointsOfInterest,
  mapPoints,
  onAddMapPoint,
  onShowPointDetails,
  markerColors,
}: {
  pointsOfInterest: PointOfInterest[];
  mapPoints: PointOfInterest[];
  onAddMapPoint: (lng: number, lat: number, tempId: string) => void;
  onShowPointDetails: (poi: PointOfInterest, index: number) => void;
  markerColors: string[];
}) {
  const { map } = useMap();

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
      if (!poi.point) return;

      const el = document.createElement("div");
      el.className = "custom-marker";
      el.style.cursor = "pointer";
      el.title = `${
        poi.name
      } - Kliknij aby zobaczyć szczegóły (${poi.point.longitude.toFixed(
        4
      )}, ${poi.point.latitude.toFixed(4)})`;

      const color = markerColors[index % markerColors.length];

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
        .setLngLat([poi.point.longitude, poi.point.latitude])
        .addTo(map);
    });

    return () => {
      const markers = document.querySelectorAll(".custom-marker");
      markers.forEach((marker) => marker.remove());
    };
  }, [map, mapPoints, onShowPointDetails, markerColors, pointsOfInterest]);

  return null;
}

export default MapClickHandler;

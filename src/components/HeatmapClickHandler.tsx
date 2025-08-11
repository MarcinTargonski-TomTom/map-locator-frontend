import { useMap } from "legoland-shared";
import { useEffect } from "react";
import mapboxgl from "mapbox-gl";

interface HeatmapClickHandlerProps {
  heatmapData: {
    polygonPoints: Array<{ latitude: number; longitude: number }>;
    isPolygonMode: boolean;
    isPolygonClosed: boolean;
    isPolygonVisible: boolean;
    addPolygonPoint: (point: { latitude: number; longitude: number }) => void;
    closePolygon: () => void;
  };
}

function HeatmapClickHandler({ heatmapData }: HeatmapClickHandlerProps) {
  const {
    polygonPoints,
    isPolygonMode,
    isPolygonClosed,
    isPolygonVisible,
    addPolygonPoint,
    closePolygon,
  } = heatmapData;
  const { map } = useMap();

  useEffect(() => {
    if (!map) return;

    const handleMapClick = (e: mapboxgl.MapMouseEvent) => {
      const { lng, lat } = e.lngLat;

      if (isPolygonMode && !isPolygonClosed) {
        const newPoint = { latitude: lat, longitude: lng };

        if (polygonPoints.length >= 3) {
          const firstPoint = polygonPoints[0];
          const distance = Math.sqrt(
            Math.pow(lat - firstPoint.latitude, 2) +
              Math.pow(lng - firstPoint.longitude, 2)
          );

          if (distance < 0.005) {
            closePolygon();
            return;
          }
        }

        addPolygonPoint(newPoint);
      }
    };

    map.on("click", handleMapClick);

    return () => {
      map.off("click", handleMapClick);
    };
  }, [
    map,
    isPolygonMode,
    isPolygonClosed,
    polygonPoints,
    addPolygonPoint,
    closePolygon,
  ]);

  useEffect(() => {
    if (!map) return;

    if (!map.getSource("polygon-points")) {
      map.addSource("polygon-points", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });
    }

    if (!map.getSource("polygon-line")) {
      map.addSource("polygon-line", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });
    }

    if (!map.getSource("closed-polygon")) {
      map.addSource("closed-polygon", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });
    }

    if (!map.getLayer("polygon-points")) {
      map.addLayer({
        id: "polygon-points",
        type: "circle",
        source: "polygon-points",
        paint: {
          "circle-radius": 6,
          "circle-color": [
            "case",
            ["==", ["get", "index"], 0],
            "#ff0000",
            "#0066cc",
          ],
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff",
        },
      });
    }

    if (!map.getLayer("polygon-line")) {
      map.addLayer({
        id: "polygon-line",
        type: "line",
        source: "polygon-line",
        paint: {
          "line-color": "#0066cc",
          "line-width": 2,
          "line-opacity": 0.8,
        },
      });
    }

    if (!map.getLayer("closed-polygon")) {
      map.addLayer({
        id: "closed-polygon",
        type: "fill",
        source: "closed-polygon",
        paint: {
          "fill-color": "#0066cc",
          "fill-opacity": 0.2,
        },
      });

      map.addLayer({
        id: "closed-polygon-outline",
        type: "line",
        source: "closed-polygon",
        paint: {
          "line-color": "#0066cc",
          "line-width": 2,
          "line-opacity": 0.8,
        },
      });
    }

    const pointFeatures = polygonPoints.map((point, index) => ({
      type: "Feature" as const,
      geometry: {
        type: "Point" as const,
        coordinates: [point.longitude, point.latitude],
      },
      properties: {
        index,
      },
    }));

    const lineFeatures = [];
    const closedPolygonFeatures = [];

    if (polygonPoints.length > 1) {
      const coordinates = polygonPoints.map((p) => [p.longitude, p.latitude]);

      if (isPolygonClosed && polygonPoints.length >= 3) {
        const closedCoordinates = [...coordinates, coordinates[0]];
        closedPolygonFeatures.push({
          type: "Feature" as const,
          geometry: {
            type: "Polygon" as const,
            coordinates: [closedCoordinates],
          },
          properties: {},
        });
      } else {
        lineFeatures.push({
          type: "Feature" as const,
          geometry: {
            type: "LineString" as const,
            coordinates,
          },
          properties: {},
        });
      }
    }

    (map.getSource("polygon-points") as mapboxgl.GeoJSONSource).setData({
      type: "FeatureCollection",
      features: isPolygonVisible ? pointFeatures : [],
    });

    (map.getSource("polygon-line") as mapboxgl.GeoJSONSource).setData({
      type: "FeatureCollection",
      features: isPolygonVisible ? lineFeatures : [],
    });

    (map.getSource("closed-polygon") as mapboxgl.GeoJSONSource).setData({
      type: "FeatureCollection",
      features: isPolygonVisible ? closedPolygonFeatures : [],
    });

    return () => {
      if (map.getLayer("polygon-points")) {
        map.removeLayer("polygon-points");
      }
      if (map.getLayer("polygon-line")) {
        map.removeLayer("polygon-line");
      }
      if (map.getLayer("closed-polygon-outline")) {
        map.removeLayer("closed-polygon-outline");
      }
      if (map.getLayer("closed-polygon")) {
        map.removeLayer("closed-polygon");
      }
      if (map.getSource("polygon-points")) {
        map.removeSource("polygon-points");
      }
      if (map.getSource("polygon-line")) {
        map.removeSource("polygon-line");
      }
      if (map.getSource("closed-polygon")) {
        map.removeSource("closed-polygon");
      }
    };
  }, [map, polygonPoints, isPolygonClosed, isPolygonVisible]);

  return null;
}

export default HeatmapClickHandler;

import { useState, useCallback } from "react";
import type { PolygonBounds, PolygonApiResponse } from "../types/api";

interface PolygonPoint {
  latitude: number;
  longitude: number;
}

export function useHeatmap() {
  const [polygonPoints, setPolygonPoints] = useState<PolygonPoint[]>([]);
  const [selectedLayer, setSelectedLayer] = useState<number | null>(null);
  const [mortonTiles, setMortonTiles] = useState<PolygonApiResponse>([]);
  const [isPolygonMode, setIsPolygonMode] = useState(false);
  const [isPolygonClosed, setIsPolygonClosed] = useState(false);
  const [isPolygonVisible, setIsPolygonVisible] = useState(true);

  const getAuthToken = (): string | null => {
    try {
      const token =
        localStorage.getItem("auth_token") ||
        localStorage.getItem("token") ||
        sessionStorage.getItem("auth_token") ||
        sessionStorage.getItem("token");

      if (!token) return null;

      if (token.startsWith('"') && token.endsWith('"')) {
        try {
          return JSON.parse(token);
        } catch {
          return token;
        }
      }
      return token;
    } catch {
      return null;
    }
  };

  const addPolygonPoint = useCallback((point: PolygonPoint) => {
    setPolygonPoints((prev) => [...prev, point]);
  }, []);

  const resetPolygon = useCallback(() => {
    setPolygonPoints([]);
    setMortonTiles([]);
    setIsPolygonClosed(false);
  }, []);

  const sendPolygonRequest = useCallback(
    async (layer: number) => {
      if (polygonPoints.length < 3) {
        return;
      }

      if (!layer) {
        return;
      }

      try {
        const token = getAuthToken();

        const requestData: PolygonBounds = {
          bounds: polygonPoints,
          layer,
        };

        if (token) {
          try {
            const API_BASE_URL = import.meta.env.VITE_API_ROOT;
            const fullUrl = `${API_BASE_URL}/locations/v1/stats`;

            const response = await fetch(fullUrl, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(requestData),
            });

            if (response.ok) {
              const data: PolygonApiResponse = await response.json();
              setMortonTiles(data);
            } else {
              console.error(
                "API request failed:",
                response.status,
                response.statusText
              );
            }
          } catch (error: Error | unknown) {
            console.error("Error fetching polygon data:", error);
          }
        }
      } catch (error) {
        console.error("Request error:", error);
      }
    },
    [polygonPoints]
  );

  const closePolygon = useCallback(() => {
    if (polygonPoints.length >= 3) {
      setIsPolygonClosed(true);
      if (selectedLayer) {
        sendPolygonRequest(selectedLayer);
      }
    }
  }, [polygonPoints, selectedLayer, sendPolygonRequest]);

  const togglePolygonVisibility = useCallback(() => {
    setIsPolygonVisible(!isPolygonVisible);
  }, [isPolygonVisible]);

  return {
    polygonPoints,
    selectedLayer,
    setSelectedLayer,
    mortonTiles,
    setMortonTiles,
    isPolygonMode,
    setIsPolygonMode,
    isPolygonClosed,
    isPolygonVisible,
    addPolygonPoint,
    resetPolygon,
    closePolygon,
    sendPolygonRequest,
    togglePolygonVisibility,
  };
}

import { useContext, useCallback, useEffect } from "react";
import { Button } from "tombac";
import styled from "styled-components";
import { MapContext } from "../context/mapContext";
import type { PolygonBounds, PolygonApiResponse } from "../types/api";

function PolygonTab() {
  const {
    polygonPoints,
    selectedLayer,
    setSelectedLayer,
    mortonTiles,
    setMortonTiles,
    isPolygonMode,
    setIsPolygonMode,
    resetPolygon,
  } = useContext(MapContext);

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

  useEffect(() => {
    const originalFetch = window.fetch;
    window.fetch = function (...args) {
      return originalFetch.apply(this, args);
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  const layerOptions = Array.from({ length: 17 }, (_, i) => ({
    value: i + 1,
    label: `Warstwa ${i + 1}`,
  }));

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
    [polygonPoints, setMortonTiles]
  );

  const handleLayerChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const value = event.target.value;

      if (value === "") {
        setSelectedLayer(null);
        return;
      }

      const layer = parseInt(value, 10);

      setSelectedLayer(layer);

      if (polygonPoints.length >= 3) {
        sendPolygonRequest(layer);
      }
    },
    [polygonPoints, setSelectedLayer, sendPolygonRequest]
  );

  const handleTogglePolygonMode = () => {
    setIsPolygonMode(!isPolygonMode);
    if (isPolygonMode) {
      resetPolygon();
    }
  };

  const isPolygonComplete = polygonPoints.length >= 3;
  const canSendRequest = isPolygonComplete && selectedLayer !== null;

  return (
    <Container>
      <Section>
        <SectionTitle>Polygon Mode</SectionTitle>

        <Button
          onClick={handleTogglePolygonMode}
          variant={isPolygonMode ? "secondary" : "primary"}
        >
          {isPolygonMode ? "Exit Polygon Mode" : "Enter Polygon Mode"}
        </Button>
      </Section>

      {isPolygonMode && (
        <>
          <Section>
            <Label>Points: {polygonPoints.length}</Label>
            {polygonPoints.length > 0 && (
              <PointsList>
                {polygonPoints.map((point, index) => (
                  <div
                    key={index}
                    style={{
                      fontSize: "12px",
                      marginBottom: "4px",
                      color: "#666",
                    }}
                  >
                    {index + 1}. Lat: {point.latitude.toFixed(5)}, Lng:{" "}
                    {point.longitude.toFixed(5)}
                  </div>
                ))}
              </PointsList>
            )}
            {polygonPoints.length >= 3 && (
              <CompleteMessage>
                Click on the first point to close the polygon
              </CompleteMessage>
            )}
          </Section>

          <Section>
            <label
              htmlFor="layer-select"
              style={{
                fontWeight: 500,
                marginBottom: "8px",
                color: "#555",
                display: "block",
              }}
            >
              Layer Selection{" "}
              {polygonPoints.length < 3 && (
                <span style={{ color: "#999" }}>(requires 3+ points)</span>
              )}
            </label>
            <SelectWrapper>
              <select
                id="layer-select"
                value={selectedLayer || ""}
                onChange={handleLayerChange}
                disabled={polygonPoints.length < 3}
              >
                <option value="">Select layer...</option>
                {layerOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </SelectWrapper>
          </Section>

          <Section>
            <Button
              onClick={() => selectedLayer && sendPolygonRequest(selectedLayer)}
              disabled={!canSendRequest || !selectedLayer}
              variant="primary"
            >
              Send Request
            </Button>
          </Section>

          <Section>
            <Button onClick={resetPolygon} variant="secondary">
              Clear Polygon
            </Button>
          </Section>

          {mortonTiles.length > 0 && (
            <Section>
              <Label>Results: {mortonTiles.length} morton tiles</Label>
              <ResultSummary>
                <div>
                  Total occurrences:{" "}
                  {mortonTiles.reduce((sum, tile) => sum + tile.occurrences, 0)}
                </div>
                <div>
                  Max occurrences:{" "}
                  {Math.max(...mortonTiles.map((tile) => tile.occurrences))}
                </div>
              </ResultSummary>
            </Section>
          )}
        </>
      )}
    </Container>
  );
}

export default PolygonTab;

const Container = styled.div`
  max-height: 500px;
  overflow-y: auto;
  padding: 16px;
`;

const SectionTitle = styled.h3`
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
`;

const Section = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.div`
  font-weight: 500;
  margin-bottom: 8px;
  color: #555;
`;

const PointsList = styled.div`
  background: #f5f5f5;
  border-radius: 4px;
  padding: 8px;
  max-height: 120px;
  overflow-y: auto;
`;

const CompleteMessage = styled.div`
  font-size: 12px;
  color: #007acc;
  margin-top: 8px;
  font-style: italic;
`;

const SelectWrapper = styled.div`
  select {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
    background: white;

    &:focus {
      outline: none;
      border-color: #007acc;
    }

    &:disabled {
      background: #f5f5f5;
      color: #999;
      cursor: not-allowed;
      border-color: #ddd;
    }
  }
`;

const ResultSummary = styled.div`
  background: #f0f8ff;
  border-radius: 4px;
  padding: 8px;
  font-size: 12px;
  color: #333;

  div {
    margin-bottom: 4px;

    &:last-child {
      margin-bottom: 0;
    }
  }
`;

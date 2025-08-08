import { useCallback } from "react";
import { Button, Heading, Label, tombac } from "tombac";
import styled from "styled-components";
import type { PolygonApiResponse } from "../types/api";
import { HideIcon, ShowIcon } from "tombac-icons";

interface HeatmapPanelProps {
  heatmapData: {
    polygonPoints: Array<{ latitude: number; longitude: number }>;
    selectedLayer: number | null;
    setSelectedLayer: (layer: number | null) => void;
    mortonTiles: PolygonApiResponse;
    setMortonTiles: (tiles: PolygonApiResponse) => void;
    isPolygonMode: boolean;
    setIsPolygonMode: (mode: boolean) => void;
    isPolygonClosed: boolean;
    isPolygonVisible: boolean;
    addPolygonPoint: (point: { latitude: number; longitude: number }) => void;
    resetPolygon: () => void;
    sendPolygonRequest: (layer: number) => Promise<void>;
    togglePolygonVisibility: () => void;
  };
  onToggleVisibility: () => void;
}

function HeatmapPanel({ heatmapData, onToggleVisibility }: HeatmapPanelProps) {
  const {
    polygonPoints,
    selectedLayer,
    setSelectedLayer,
    mortonTiles,
    isPolygonClosed,
    isPolygonVisible,
    resetPolygon,
    sendPolygonRequest,
    togglePolygonVisibility,
  } = heatmapData;

  const layerOptions = Array.from({ length: 17 }, (_, i) => ({
    value: i + 1,
    label: `Warstwa ${i + 1}`,
  }));

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

  const isPolygonComplete = polygonPoints.length >= 3;
  const canSendRequest = isPolygonComplete && selectedLayer !== null;

  return (
    <PanelContainer>
      <PanelHeader>
        <Heading level={2}>Heatmap</Heading>
        <Button
          variant="flat"
          onClick={onToggleVisibility}
          $height="32px"
          $display="flex"
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#f0f0f0";
            e.currentTarget.style.color = "#333";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "none";
            e.currentTarget.style.color = "#666";
          }}
        >
          ×
        </Button>
      </PanelHeader>

      <PanelContent>
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
          {polygonPoints.length >= 3 && !isPolygonClosed && (
            <CompleteMessage>
              Click on the first point to close the polygon
            </CompleteMessage>
          )}
          {isPolygonClosed && (
            <CompleteMessage as="div" style={{ color: "#00aa00" }}>
              ✓ Polygon is closed and ready for heatmap generation
            </CompleteMessage>
          )}
          {polygonPoints.length === 0 && (
            <CompleteMessage>
              Click on the map to start creating a polygon
            </CompleteMessage>
          )}
        </Section>

        <Section>
          <StyledLabel>
            Layer Selection{" "}
            {polygonPoints.length < 3 && (
              <span style={{ color: "#999" }}>(requires 3+ points)</span>
            )}
          </StyledLabel>
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
            Generate Heatmap
          </Button>
        </Section>

        <Section>
          <Button onClick={resetPolygon} variant="secondary">
            Clear Polygon
          </Button>

          {polygonPoints.length > 0 && (
            <Button
              onClick={togglePolygonVisibility}
              variant="secondary"
              style={{ marginLeft: "8px" }}
            >
              {isPolygonVisible ? <ShowIcon /> : <HideIcon />}
            </Button>
          )}
        </Section>

        {mortonTiles.length > 0 && (
          <Section>
            <StyledLabel>
              Results: {mortonTiles.length} morton tiles
            </StyledLabel>
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
      </PanelContent>
    </PanelContainer>
  );
}

export default HeatmapPanel;

const PanelContainer = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  width: 320px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
`;

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
`;

const PanelContent = styled.div`
  max-height: 500px;
  overflow-y: auto;
  padding: 16px;
`;

const Section = styled.div`
  margin-bottom: 16px;
`;

const StyledLabel = styled(Label)`
  font-weight: 500;
  margin-bottom: ${tombac.space(1)};
  color: ${tombac.color("neutral", 700)};
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

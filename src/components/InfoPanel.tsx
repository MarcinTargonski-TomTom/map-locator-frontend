import { Box, Button } from "tombac";
import type { PointOfInterest } from "../types/point";
import { MARKER_COLORS } from "../lib/markerColors";
import styled from "styled-components";

interface InfoPanelProps {
  pointsOfInterest: PointOfInterest[];
  mapPoints: PointOfInterest[];
  searchPhrases: PointOfInterest[];
  clearAllPoints: () => void;
}

function InfoPanel({
  pointsOfInterest,
  mapPoints,
  searchPhrases,
  clearAllPoints,
}: InfoPanelProps) {
  return (
    <Box as={Panel}>
      <div>
        <strong>Punkty zainteresowania: {pointsOfInterest.length}</strong>
      </div>
      <div style={{ fontSize: "11px", color: "#666", marginTop: "4px" }}>
        Punkty na mapie: {mapPoints.length} | Frazy: {searchPhrases.length}
      </div>
      {pointsOfInterest.length > 0 && (
        <>
          <Button variant="primary" $margin="1sp" onClick={clearAllPoints}>
            Wyczyść wszystko
          </Button>
        </>
      )}
      <div style={{ fontSize: "12px", marginTop: "8px", color: "#666" }}>
        <p>Kliknij na mapę aby dodać punkt</p>
        <p>Kliknij na punkt aby go usunąć</p>
        <span style={{ fontSize: "11px", fontStyle: "italic" }}>
          Każdy punkt ma automatycznie przypisany unikalny kolor
        </span>
      </div>

      {mapPoints.length > 0 && (
        <div style={{ marginTop: "12px", fontSize: "11px" }}>
          <strong>Kolory punktów na mapie:</strong>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "4px",
              marginTop: "4px",
            }}
          >
            {mapPoints.map((poi, index) => {
              const color = MARKER_COLORS[index % MARKER_COLORS.length];
              return (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "10px",
                  }}
                >
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      backgroundColor: color,
                      borderRadius: "50%",
                      marginRight: "4px",
                      border: "1px solid #ccc",
                    }}
                  ></div>
                  {poi.name}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Box>
  );
}

export default InfoPanel;

const Panel = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-width: 300px;
  font-size: 14px;
`;

import { useContext } from "react";
import { Button, tombac } from "tombac";
import styled from "styled-components";
import { MapContext } from "../context/mapContext";
import SearchForm from "./SearchForm";
import type { BudgetType, TravelMode, PointOfInterestDTO } from "../types/api";
import { TRAVEL_MODE_OPTIONS, BUDGET_OPTIONS } from "../types/api";
import { getNextAvailableColor } from "../utils/colorUtils";

function SearchTab() {
  const {
    pointsOfInterest,
    reset: clearAllPoints,
    setPointsOfInterest,
    removePhrases,
  } = useContext(MapContext);

  const mapPoints = pointsOfInterest.filter((poi) => poi.center !== null);
  const searchPhrases = pointsOfInterest.filter((poi) => poi.center === null);

  const removePointOfInterest = (index: number) => {
    setPointsOfInterest(pointsOfInterest.filter((_, i) => i !== index));
  };

  const addSearchPhrase = (
    text: string,
    budget: number,
    budgetType: BudgetType,
    travelMode: TravelMode
  ) => {
    const newPoi: PointOfInterestDTO = {
      isDisplayed: false,
      order: pointsOfInterest.length + 1,
      name: text,
      center: null,
      value: budget,
      budgetType,
      travelMode,
      color: getNextAvailableColor(pointsOfInterest),
    };
    setPointsOfInterest([...pointsOfInterest, newPoi]);
  };

  return (
    <>
      {/* Info Panel Content */}
      <Section>
        <div>
          <strong>Punkty zainteresowania: {pointsOfInterest.length}</strong>
        </div>
        <div style={{ fontSize: "11px", color: "#666", marginTop: "4px" }}>
          Punkty na mapie: {mapPoints.length} | Frazy: {searchPhrases.length}
        </div>
        {pointsOfInterest.length > 0 && (
          <Button variant="primary" $margin="1sp" onClick={clearAllPoints}>
            Wyczyść wszystko
          </Button>
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
                const color = poi.color;
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
      </Section>

      <Section>
        <div>
          <strong>Wyszukiwanie miejsca</strong>
        </div>
        <SearchForm
          onAddPhrase={addSearchPhrase}
          budgetOptions={BUDGET_OPTIONS}
          travelModeOptions={TRAVEL_MODE_OPTIONS}
        />

        {searchPhrases.length > 0 && (
          <div style={{ marginTop: "15px" }}>
            <div
              style={{
                fontSize: "12px",
                fontWeight: "bold",
                marginBottom: "8px",
              }}
            >
              Frazy do wyszukania ({searchPhrases.length}):
            </div>
            {searchPhrases.map((poi, index) => (
              <div
                key={index}
                style={{
                  fontSize: "11px",
                  padding: "6px 8px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "4px",
                  marginBottom: "4px",
                  backgroundColor: "#f8f9fa",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontWeight: "bold" }}>{poi.name}</div>
                  <div style={{ color: "#666", fontSize: "10px" }}>
                    {
                      BUDGET_OPTIONS.find((opt) => opt.value === poi.budgetType)
                        ?.label
                    }
                    : {poi.value} |{" "}
                    {
                      TRAVEL_MODE_OPTIONS.find(
                        (opt) => opt.value === poi.travelMode
                      )?.label
                    }
                  </div>
                </div>
                <Button
                  variant="primary"
                  $border="none"
                  $borderRadius="3u"
                  $padding="2u 6u"
                  onClick={() =>
                    removePointOfInterest(pointsOfInterest.indexOf(poi))
                  }
                >
                  ✕
                </Button>
              </div>
            ))}
            <StyledButton onClick={removePhrases} variant="secondary">
              Wyczyść wszystkie frazy
            </StyledButton>
          </div>
        )}
      </Section>
    </>
  );
}

export default SearchTab;

const Section = styled.div`
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const StyledButton = styled(Button)`
  border: none;
  border-radius: ${tombac.unit(4)};
  padding: ${tombac.unit(6)} ${tombac.unit(10)};
  margin: ${tombac.unit(4)};
  width: 100%;
`;

import { Button, tombac } from "tombac";
import SearchForm from "./SearchForm";
import type { BudgetType, TravelMode } from "../types/api";
import styled from "styled-components";
import { MapContext } from "../context/mapContext";
import { useContext } from "react";
import { TRAVEL_MODE_OPTIONS, type PointOfInterestDTO } from "../types/api";
import { BUDGET_OPTIONS } from "../types/api";

function SearchPanel() {
  const { setPointsOfInterest, pointsOfInterest, removePhrases } =
    useContext(MapContext);
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
      name: text,
      center: null,
      value: budget,
      budgetType,
      travelMode,
    };
    setPointsOfInterest([...pointsOfInterest, newPoi]);
  };

  return (
    <Panel>
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
    </Panel>
  );
}

export default SearchPanel;

const Panel = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  width: 320px;
  max-height: 60vh;
  overflow-y: auto;
  font-size: 14px;
`;

const StyledButton = styled(Button)`
  border: none;
  border-radius: ${tombac.unit(4)};
  padding: ${tombac.unit(6)} ${tombac.unit(10)};
  margin: ${tombac.unit(4)};
  width: 100%;
`;

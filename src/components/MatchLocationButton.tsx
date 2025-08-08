import { Button, tombac, useToasts, Select } from "tombac";
import styled from "styled-components";
import { useLocationMatcher } from "../hooks/useLocationMatcher";
import { useContext, useState } from "react";
import { MapContext } from "../context/mapContext";
import { processApiResponses } from "../utils/apiUtils";

interface MatchLocationButtonProps {
  disabled?: boolean;
}

function MatchLocationButton({ disabled = false }: MatchLocationButtonProps) {
  const { pointsOfInterest, setRegions, setResponseIndex } =
    useContext(MapContext);
  const { isLoading, error, matchLocations } = useLocationMatcher();
  const { addToast } = useToasts();

  const smoothingOptions = [
    { value: "CONVEX_HULL", label: "Wypukła otoczka" },
    { value: "NONE", label: "Brak wygładzania" },
    { value: "ENVELOPE", label: "Prostokątna koperta" },
  ];

  const [smoothingMethod, setSmoothingMethod] = useState(smoothingOptions[0]);

  const handleMatch = async () => {
    if (pointsOfInterest.length === 0) {
      addToast(
        "Dodaj przynajmniej jeden punkt lub frazę wyszukiwania",
        "alert"
      );
      return;
    }

    try {
      const newData = await matchLocations(
        pointsOfInterest,
        smoothingMethod.value as "NONE" | "CONVEX_HULL" | "ENVELOPE"
      );
      if (!newData || newData.length == 0) {
        addToast("Brak danych do wyświetlenia", "danger");
        return;
      } else {
        addToast("Dopasowanie lokalizacji zakończone pomyślnie!", "success");

        const processedData = processApiResponses(newData);
        setRegions(
          processedData.map((region) => ({
            ...region,
            requestRegions: region.requestRegions.map((reqRegion, index) => ({
              ...reqRegion,
              pointOfInterest: {
                ...reqRegion.pointOfInterest,
                isDisplayed: true,
                order: index,
              },
            })),
          }))
        );
        setResponseIndex(0);
      }
    } catch (err) {
      // Error już jest obsłużony w hooku
      console.error("Błąd podczas dopasowywania lokalizacji:", err);
    }
  };

  return (
    <ButtonContainer>
      <ButtonWithSelect>
        <StyledSelect
          name="smoothingMethod"
          value={smoothingMethod}
          onChange={(selectedOption) => {
            if (selectedOption && !Array.isArray(selectedOption)) {
              setSmoothingMethod(
                selectedOption as { value: string; label: string }
              );
            }
          }}
          options={smoothingOptions}
          placeholder="Metoda"
          menuPlacement="top"
          isSearchable={false}
        />

        <StyledButton
          variant="primary"
          onClick={handleMatch}
          disabled={disabled || isLoading || pointsOfInterest.length === 0}
          $loading={isLoading}
        >
          {isLoading ? "Dopasowywanie..." : "Dopasuj lokalizacje"}
        </StyledButton>
      </ButtonWithSelect>

      {error && <ErrorMessage>Błąd: {error}</ErrorMessage>}
    </ButtonContainer>
  );
}

export default MatchLocationButton;

const ButtonContainer = styled.div`
  position: absolute;
  bottom: ${tombac.unit(20)};
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${tombac.unit(8)};
`;

const ButtonWithSelect = styled.div`
  display: flex;
  background-color: ${tombac.color("primary", 600)};
  border-radius: ${tombac.unit(8)};
  box-shadow: 0 ${tombac.unit(4)} ${tombac.unit(12)} rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 ${tombac.unit(6)} ${tombac.unit(16)} rgba(0, 0, 0, 0.2);
  }
`;

const StyledSelect = styled(Select)`
  min-width: ${tombac.unit(200)};
  border-radius: ${tombac.unit(8)} 0 0 ${tombac.unit(8)};
  z-index: 1001;

  & > div {
    border: none;
    border-radius: ${tombac.unit(8)} 0 0 ${tombac.unit(8)};
    color: white;
    font-size: ${tombac.unit(14)};
    font-weight: bold;
  }

  /* Ensure dropdown menu has proper z-index */
  .react-select__menu {
    z-index: 1002 !important;
  }
`;

const StyledButton = styled(Button)<{ $loading?: boolean }>`
  padding: ${tombac.space(1.5)} ${tombac.space(3)};
  border-radius: 0 ${tombac.unit(8)} ${tombac.unit(8)} 0;
  font-size: ${tombac.unit(14)};
  font-weight: bold;
  border: none;
  transition: all 0.2s ease;
  min-width: ${tombac.unit(200)};

  &:hover:not(:disabled) {
    background-color: ${tombac.color("primary", 800)};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  ${(props) =>
    props.$loading &&
    `
    cursor: wait;
  `}
`;

const ErrorMessage = styled.div`
  background-color: ${tombac.color("neutral", 100)};
  color: ${tombac.color("danger", 600)};
  padding: ${tombac.space(1)} ${tombac.space(2)};
  border-radius: ${tombac.unit(4)};
  font-size: ${tombac.unit(12)};
  max-width: ${tombac.unit(300)};
  text-align: center;
  border: 1px solid ${tombac.color("danger", 300)};
`;

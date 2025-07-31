import { Button, tombac } from "tombac";
import styled from "styled-components";
import { useLocationMatcher } from "../hooks/useLocationMatcher";
import type { PointOfInterest } from "../types/point";

interface MatchLocationButtonProps {
  pointsOfInterest: PointOfInterest[];
  disabled?: boolean;
}

function MatchLocationButton({
  pointsOfInterest,
  disabled = false,
}: MatchLocationButtonProps) {
  const { isLoading, error, data, matchLocations } = useLocationMatcher();

  const handleMatch = async () => {
    if (pointsOfInterest.length === 0) {
      alert("Dodaj przynajmniej jeden punkt lub frazę wyszukiwania");
      return;
    }

    try {
      await matchLocations(pointsOfInterest);
      if (data) {
        alert("Dopasowanie lokalizacji zakończone pomyślnie!");
      }
    } catch (err) {
      // Error już jest obsłużony w hooku
      console.error("Błąd podczas dopasowywania lokalizacji:", err);
    }
  };

  return (
    <ButtonContainer>
      <StyledButton
        variant="primary"
        onClick={handleMatch}
        disabled={disabled || isLoading || pointsOfInterest.length === 0}
        $loading={isLoading}
      >
        {isLoading ? "Dopasowywanie..." : "Dopasuj lokalizacje"}
      </StyledButton>

      {error && <ErrorMessage>Błąd: {error}</ErrorMessage>}

      {data && !error && (
        <SuccessMessage>
          Dopasowanie zakończone pomyślnie! Sprawdź konsolę dla szczegółów.
        </SuccessMessage>
      )}
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

const StyledButton = styled(Button)<{ $loading?: boolean }>`
  padding: ${tombac.space(1.5)} ${tombac.space(3)};
  border-radius: ${tombac.unit(8)};
  font-size: ${tombac.unit(14)};
  font-weight: bold;
  box-shadow: 0 ${tombac.unit(4)} ${tombac.unit(12)} rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
  min-width: ${tombac.unit(200)};

  &:hover:not(:disabled) {
    transform: translateY(-${tombac.unit(2)});
    box-shadow: 0 ${tombac.unit(6)} ${tombac.unit(16)} rgba(0, 0, 0, 0.2);
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

const SuccessMessage = styled.div`
  background-color: ${tombac.color("neutral", 100)};
  color: ${tombac.color("success", 600)};
  padding: ${tombac.space(1)} ${tombac.space(2)};
  border-radius: ${tombac.unit(4)};
  font-size: ${tombac.unit(12)};
  max-width: ${tombac.unit(300)};
  text-align: center;
  border: 1px solid ${tombac.color("success", 300)};
`;

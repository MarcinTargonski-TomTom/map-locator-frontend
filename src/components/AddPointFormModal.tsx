import { useContext, useState } from "react";
import type { BudgetType, TravelMode } from "../types/api";
import {
  Button,
  Heading,
  Input,
  Label,
  Modal,
  ModalHeader,
  ModalLayout,
  Select,
  tombac,
} from "tombac";
import styled from "styled-components";
import { BUDGET_OPTIONS } from "../types/api";
import { TRAVEL_MODE_OPTIONS, type PointOfInterestDTO } from "../types/api";
import { MapContext } from "../context/mapContext";

function AddPointFormModal({
  longitude,
  latitude,
  onClose,
}: {
  longitude: number;
  latitude: number;
  onClose: () => void;
}) {
  const { pointsOfInterest, setPointsOfInterest } = useContext(MapContext);
  const [name, setName] = useState("");
  const [value, setValue] = useState<number>(0);
  const [budgetType, setBudgetType] = useState(BUDGET_OPTIONS[0]);
  const [travelMode, setTravelMode] = useState(TRAVEL_MODE_OPTIONS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && value > 0) {
      addMapPoint(name.trim(), value, budgetType.value, travelMode.value);
    }
  };

  const addMapPoint = (
    name: string,
    value: number,
    budgetType: BudgetType,
    travelMode: TravelMode
  ) => {
    const newPoi: PointOfInterestDTO = {
      name,
      center: {
        longitude: longitude,
        latitude: latitude,
      },
      value,
      budgetType,
      travelMode,
    };
    setPointsOfInterest([...pointsOfInterest, newPoi]);
    onClose();
  };

  return (
    <Modal isOpen={true}>
      <ModalHeader>
        <Heading level={3}>Dodaj punkt na mapie</Heading>
      </ModalHeader>
      <ModalLayout $margin="2sp">
        <div style={{ fontSize: "12px", color: "#666", marginBottom: "15px" }}>
          Współrzędne: {longitude.toFixed(4)}, {latitude.toFixed(4)}
        </div>
        <form onSubmit={handleSubmit}>
          <FieldContainer>
            <StyledLabel>Nazwa punktu:</StyledLabel>
            <StyledInput
              type="text"
              placeholder="Wprowadź nazwę punktu"
              value={name}
              onChange={(e) => setName(e.target.value)}
              $marginBottom="12u"
            />
          </FieldContainer>

          <FieldContainer>
            <StyledLabel>Wartość:</StyledLabel>
            <StyledInput
              type="number"
              placeholder="Wprowadź wartość"
              value={value || ""}
              onChange={(e) => setValue(Number(e.target.value))}
              min="0"
              step="0.1"
            />
          </FieldContainer>

          <FieldContainer>
            <StyledLabel>Typ budżetu:</StyledLabel>
            <Select
              value={budgetType}
              options={BUDGET_OPTIONS}
              onChange={(selectedOption) => {
                if (selectedOption && !Array.isArray(selectedOption)) {
                  setBudgetType(
                    selectedOption as { value: BudgetType; label: string }
                  );
                }
              }}
              $width="100%"
            />
          </FieldContainer>

          <FieldContainer>
            <StyledLabel>Tryb podróży:</StyledLabel>
            <Select
              value={travelMode}
              options={TRAVEL_MODE_OPTIONS}
              onChange={(selectedOption) => {
                if (selectedOption && !Array.isArray(selectedOption)) {
                  setTravelMode(
                    selectedOption as { value: TravelMode; label: string }
                  );
                }
              }}
              $width="100%"
            />
          </FieldContainer>

          <div style={{ display: "flex", gap: "10px" }}>
            <StyledButton variant="secondary" onClick={onClose}>
              Anuluj
            </StyledButton>
            <StyledButton
              variant="primary"
              disabled={!name.trim() || value <= 0}
            >
              Dodaj punkt
            </StyledButton>
          </div>
        </form>
      </ModalLayout>
    </Modal>
  );
}

export default AddPointFormModal;

const StyledLabel = styled(Label)`
  display: block;
  margin-bottom: ${tombac.unit(4)};
  font-size: 12px;
  font-weight: bold;
`;

const StyledButton = styled(Button)`
  margin: ${tombac.space(1)};
  border-radius: ${tombac.unit(1)};
  flex: 1;
`;

const StyledInput = styled(Input)`
  width: 100%;
  padding: ${tombac.space(1)};
  border-color: ${tombac.color("neutral", 500)};
  border-radius: ${tombac.unit(4)};
  box-sizing: border-box;
  font-size: ${tombac.unit(14)};
`;

const FieldContainer = styled.div`
  margin-bottom: ${tombac.unit(12)};
`;

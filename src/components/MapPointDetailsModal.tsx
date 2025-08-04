import { Button, Heading, Label, Modal, ModalLayout, tombac } from "tombac";
import styled from "styled-components";
import { TRAVEL_MODE_OPTIONS } from "../types/api";
import { BUDGET_OPTIONS } from "../types/api";
import { useContext } from "react";
import { MapContext } from "../context/mapContext";

function PointDetailsModal({
  index,
  onClose,
}: {
  index: number;
  onClose: () => void;
}) {
  const { setPointsOfInterest, pointsOfInterest } = useContext(MapContext);
  const poi = pointsOfInterest[index];
  const budgetLabel =
    BUDGET_OPTIONS.find((opt) => opt.value === poi.budgetType)?.label ||
    poi.budgetType;
  const travelLabel =
    TRAVEL_MODE_OPTIONS.find((opt) => opt.value === poi.travelMode)?.label ||
    poi.travelMode;

  const deletePoint = () => {
    removePointOfInterest(index);
    onClose();
  };

  const removePointOfInterest = (index: number) => {
    setPointsOfInterest(pointsOfInterest.filter((_, i) => i !== index));
  };

  return (
    <Modal isOpen={true}>
      <ModalLayout $margin="1sp">
        <Heading level={3} $margin="1sp">
          Szczegóły punktu
        </Heading>

        <StyledLabel>Nazwa:</StyledLabel>
        <ContentDiv>
          <strong>{poi.name}</strong>
        </ContentDiv>

        <StyledLabel>Współrzędne:</StyledLabel>
        {poi.center && (
          <ContentDiv>
            {poi.center.longitude.toFixed(4)}, {poi.center.latitude.toFixed(4)}
          </ContentDiv>
        )}

        <StyledLabel>Wartość:</StyledLabel>
        <ContentDiv>{poi.value}</ContentDiv>

        <StyledLabel>Typ budżetu:</StyledLabel>
        <ContentDiv>{budgetLabel}</ContentDiv>

        <StyledLabel>Tryb podróży:</StyledLabel>
        <ContentDiv>{travelLabel}</ContentDiv>

        <div style={{ display: "flex", gap: "10px" }}>
          <Button
            variant="secondary"
            $margin="1sp"
            $borderRadius="1u"
            $flex="1"
            onClick={onClose}
          >
            Zamknij
          </Button>
          <Button
            variant="primary"
            $margin="1sp"
            $borderRadius="1u"
            $flex="1"
            onClick={deletePoint}
          >
            Usuń punkt
          </Button>
        </div>
      </ModalLayout>
    </Modal>
  );
}

export default PointDetailsModal;

const StyledLabel = styled(Label)`
  display: block;
  margin-top: ${tombac.space(1)};
  color: ${tombac.color("neutral", 700)};
`;

const ContentDiv = styled.div`
  font-size: 14px;
`;

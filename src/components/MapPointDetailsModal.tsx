import { Button, Heading, Label, Modal, ModalLayout, tombac } from "tombac";
import type { BudgetType, PointOfInterest, TravelMode } from "../types/point";
import styled from "styled-components";

function PointDetailsModal({
  poi,
  onClose,
  onDelete,
  budgetOptions,
  travelModeOptions,
}: {
  poi: PointOfInterest;
  onClose: () => void;
  onDelete: () => void;
  budgetOptions: Array<{ value: BudgetType; label: string }>;
  travelModeOptions: Array<{ value: TravelMode; label: string }>;
}) {
  const budgetLabel =
    budgetOptions.find((opt) => opt.value === poi.budgetType)?.label ||
    poi.budgetType;
  const travelLabel =
    travelModeOptions.find((opt) => opt.value === poi.travelMode)?.label ||
    poi.travelMode;

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
        {poi.point && (
          <ContentDiv>
            {poi.point.longitude.toFixed(4)}, {poi.point.latitude.toFixed(4)}
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
            onClick={onDelete}
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

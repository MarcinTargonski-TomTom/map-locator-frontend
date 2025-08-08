import { Button, Heading, Label, Modal, ModalLayout, tombac } from "tombac";
import styled from "styled-components";

interface ExtendSessionModalProps {
  onSuccess: () => void;
  onClose: () => void;
}
function ExtendSessionModal({ onClose, onSuccess }: ExtendSessionModalProps) {
  return (
    <Modal isOpen={true}>
      <ModalLayout $margin="1sp">
        <Heading level={3} $margin="1sp">
          Extend Session
        </Heading>

        <StyledLabel>
          Your session is about to expire, do you want to extend it?
        </StyledLabel>

        <div style={{ display: "flex", gap: "10px" }}>
          <Button
            variant="secondary"
            $margin="1sp"
            $borderRadius="1u"
            $flex="1"
            onClick={onClose}
          >
            No
          </Button>
          <Button
            variant="primary"
            $margin="1sp"
            $borderRadius="1u"
            $flex="1"
            onClick={onSuccess}
          >
            Extend
          </Button>
        </div>
      </ModalLayout>
    </Modal>
  );
}

export default ExtendSessionModal;

const StyledLabel = styled(Label)`
  display: block;
  margin-top: ${tombac.space(1)};
  color: ${tombac.color("neutral", 700)};
`;

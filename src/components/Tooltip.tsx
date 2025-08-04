import styled from "styled-components";
import { tombac } from "tombac";

interface TooltipProps {
  isVisible: boolean;
  position: Position;
  text: string;
}

interface Position {
  x: number;
  y: number;
}

function Tooltip({ isVisible, position, text }: TooltipProps) {
  if (!isVisible) return null;

  return <StyledTooltip position={position}>{text}</StyledTooltip>;
}

const StyledTooltip = styled.div<{
  position: Position;
  children?: React.ReactNode;
}>`
  position: fixed;
  left: ${({ position }) => position.x + 10}px;
  top: ${({ position }) => position.y - 20}px;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  font-size: 12px;
  pointer-events: none;
  z-index: 1000;
  max-width: 200px;
  word-wrap: break-word;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);

  border: none;
  border-radius: ${tombac.unit(4)};
  padding: ${tombac.unit(6)} ${tombac.unit(10)};
  margin: ${tombac.unit(4)};
`;

export default Tooltip;

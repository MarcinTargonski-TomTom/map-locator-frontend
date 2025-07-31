interface TooltipProps {
  isVisible: boolean;
  position: { x: number; y: number };
  text: string;
}

function Tooltip({ isVisible, position, text }: TooltipProps) {
  if (!isVisible) return null;

  return (
    <div
      style={{
        position: "fixed",
        left: position.x + 10,
        top: position.y - 20,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        color: "white",
        padding: "8px 12px",
        borderRadius: "4px",
        fontSize: "12px",
        pointerEvents: "none",
        zIndex: 1000,
        maxWidth: "200px",
        wordWrap: "break-word",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
      }}
    >
      <div>{text}</div>
    </div>
  );
}

export default Tooltip;

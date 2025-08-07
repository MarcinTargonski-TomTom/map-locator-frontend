import { useContext, useState } from "react";
import { MapContext } from "../context/mapContext";
import { HideIcon, ShowIcon } from "tombac-icons";

function LayersTab() {
  const { regions, responseIndex, setRegions } = useContext(MapContext);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const region = regions ? regions[responseIndex] : null;

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    e.dataTransfer.setData("text/plain", index.toString());
    setDraggedIndex(index);
    const target = e.currentTarget as HTMLDivElement;
    target.style.opacity = "0.4";
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    const target = e.currentTarget as HTMLDivElement;
    target.style.opacity = "1";
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const sourceIndex = parseInt(e.dataTransfer.getData("text/plain"));
    setDraggedIndex(null);
    setDragOverIndex(null);

    if (sourceIndex === targetIndex || !regions) return;

    setRegions(
      regions.map((r, i) => {
        if (i !== responseIndex) return r;

        const newRequestRegions = [...r.requestRegions];
        const [movedRegion] = newRequestRegions.splice(sourceIndex, 1);
        newRequestRegions.splice(targetIndex, 0, movedRegion);

        const updatedRegions = newRequestRegions.map((rr, idx) => ({
          ...rr,
          pointOfInterest: {
            ...rr.pointOfInterest,
            order: idx,
          },
        }));

        return {
          ...r,
          requestRegions: updatedRegions,
        };
      })
    );
  };

  return (
    <>
      {regions &&
        region?.requestRegions
          .sort((a, b) => a.pointOfInterest.order - b.pointOfInterest.order)
          .map((reqRegion, index) => (
            <div
              key={index}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              style={{
                backgroundColor: reqRegion.pointOfInterest.isDisplayed
                  ? reqRegion.pointOfInterest.color
                  : "#ffffff",
                color: reqRegion.pointOfInterest.isDisplayed
                  ? "#ffffff"
                  : "#000000",
                padding: "8px",
                margin: "4px 0",
                border:
                  dragOverIndex === index
                    ? "2px dashed #000"
                    : `1px solid ${reqRegion.pointOfInterest.color}`,
                borderRadius: "4px",
                cursor: "move",
                transform: dragOverIndex === index ? "scale(1.02)" : "scale(1)",
                transition: "all 0.2s ease",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                opacity: draggedIndex === index ? 0.4 : 0.8,
              }}
            >
              {dragOverIndex === index && (
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: -2,
                    height: "2px",
                    backgroundColor: "#666",
                    transform: "scaleX(0.98)",
                  }}
                />
              )}
              <h3 style={{ margin: "0 0 8px 0" }}>
                {reqRegion.pointOfInterest.name}
              </h3>
              <button
                onClick={() =>
                  setRegions(
                    regions.map((r, i) =>
                      i === responseIndex
                        ? {
                            ...r,
                            requestRegions: r.requestRegions.map((rr, j) =>
                              j === index
                                ? {
                                    ...rr,
                                    pointOfInterest: {
                                      ...rr.pointOfInterest,
                                      isDisplayed:
                                        !rr.pointOfInterest.isDisplayed,
                                    },
                                  }
                                : rr
                            ),
                          }
                        : r
                    )
                  )
                }
                style={{
                  // padding: "4px 12px",
                  // borderRadius: "4px",
                  cursor: "pointer",
                  border: "none",
                  backgroundColor: "transparent",
                }}
              >
                {reqRegion.pointOfInterest.isDisplayed ? (
                  <ShowIcon />
                ) : (
                  <HideIcon />
                )}
              </button>
            </div>
          ))}
    </>
  );
}

export default LayersTab;

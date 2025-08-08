import { useMemo } from "react";
import { Layers } from "legoland-shared";

interface MortonTileRectangleProps {
  bounds: {
    west: number;
    east: number;
    south: number;
    north: number;
  };
  mortonCode: number;
  occurrences: number;
  color: string;
  opacity: number;
  strokeWidth?: number;
  sourceId: string;
}

function MortonTileRectangle({
  bounds,
  mortonCode,
  occurrences,
  opacity,
  color,
  strokeWidth = 1,
  sourceId,
}: MortonTileRectangleProps) {
  const rectangleFeature = useMemo(
    () => ({
      type: "Feature" as const,
      geometry: {
        type: "Polygon" as const,
        coordinates: [
          [
            [bounds.west, bounds.south],
            [bounds.east, bounds.south],
            [bounds.east, bounds.north],
            [bounds.west, bounds.north],
            [bounds.west, bounds.south],
          ],
        ],
      },
      properties: {
        mortonCode,
        occurrences,
      },
    }),
    [bounds, mortonCode, occurrences]
  );

  const rectangleLayers = useMemo(
    () => [
      {
        id: `${sourceId}-fill`,
        type: "fill" as const,
        paint: {
          "fill-color": color,
          "fill-opacity": opacity,
        },
      },
      {
        id: `${sourceId}-outline`,
        type: "line" as const,
        paint: {
          "line-color": color,
          "line-width": strokeWidth,
        },
      },
    ],
    [sourceId, color, opacity, strokeWidth]
  );

  return (
    <Layers
      sourceId={sourceId}
      layers={rectangleLayers}
      data={rectangleFeature}
    />
  );
}

export default MortonTileRectangle;

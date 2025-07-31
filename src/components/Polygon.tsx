import { useMemo } from "react";
import { Layers } from "legoland-shared";

interface PolygonProps {
  vertices: Array<{ latitude: number; longitude: number }>;
  color: string;
  opacity: number;
  strokeWidth?: number;
  sourceId: string;
}

function Polygon({
  vertices,
  opacity,
  color,
  strokeWidth = 2,
  sourceId,
}: PolygonProps) {
  const polygonFeature = useMemo(
    () => ({
      type: "Feature" as const,
      geometry: {
        type: "Polygon" as const,
        coordinates: [
          [
            ...vertices.map((vertex) => [vertex.longitude, vertex.latitude]),
            [vertices[0].longitude, vertices[0].latitude],
          ],
        ],
      },
      properties: {},
    }),
    [vertices]
  );

  const polygonLayers = useMemo(
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
    <Layers sourceId={sourceId} layers={polygonLayers} data={polygonFeature} />
  );
}

export default Polygon;

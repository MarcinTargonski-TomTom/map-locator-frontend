import { useMemo } from "react";
import { Layers } from "legoland-shared";
import { getBoundsFromMortonTile } from "../utils/mortonUtils";
import type { PolygonApiResponse } from "../types/api";

interface HeatmapMortonTileDisplayProps {
  mortonTiles: PolygonApiResponse;
  selectedLayer: number | null;
}

function HeatmapMortonTileDisplay({
  mortonTiles,
  selectedLayer,
}: HeatmapMortonTileDisplayProps) {
  const mortonFeatures = useMemo(() => {
    if (mortonTiles.length === 0) {
      return null;
    }

    const features = mortonTiles.map((tile) => {
      const layerToUse = selectedLayer || 10;
      const bounds = getBoundsFromMortonTile(tile.mortonCode, layerToUse);

      return {
        type: "Feature" as const,
        properties: {
          mortonCode: tile.mortonCode,
          occurrences: tile.occurrences,
          label: tile.occurrences.toString(),
        },
        geometry: {
          type: "Polygon" as const,
          coordinates: [
            [
              [bounds.west, bounds.north],
              [bounds.east, bounds.north],
              [bounds.east, bounds.south],
              [bounds.west, bounds.south],
              [bounds.west, bounds.north],
            ],
          ],
        },
      };
    });

    return {
      type: "FeatureCollection" as const,
      features,
    };
  }, [mortonTiles, selectedLayer]);

  const mortonLayers = useMemo(() => {
    if (!mortonFeatures || mortonTiles.length === 0) {
      return [];
    }

    const maxOccurrences = Math.max(
      ...mortonTiles.map((tile) => tile.occurrences)
    );

    return [
      {
        id: "morton-tiles",
        type: "fill" as const,
        paint: {
          "fill-color": [
            "case",
            [">=", ["get", "occurrences"], maxOccurrences * 0.9],
            "#7f0301",
            [">=", ["get", "occurrences"], maxOccurrences * 0.8],
            "#a3120f",
            [">=", ["get", "occurrences"], maxOccurrences * 0.7],
            "#c11310",
            [">=", ["get", "occurrences"], maxOccurrences * 0.6],
            "#de1c12",
            [">=", ["get", "occurrences"], maxOccurrences * 0.5],
            "#de1c12",
            [">=", ["get", "occurrences"], maxOccurrences * 0.4],
            "#fc8d59",
            [">=", ["get", "occurrences"], maxOccurrences * 0.3],
            "#fee08b",
            [">=", ["get", "occurrences"], maxOccurrences * 0.2],
            "#d9ef8b",
            "#91bfdb",
          ],
          "fill-opacity": 0.5,
        },
      },
      {
        id: "morton-tiles-border",
        type: "line" as const,
        paint: {
          "line-color": "#333",
          "line-width": 0,
          "line-opacity": 0,
        },
      },
    ];
  }, [mortonFeatures, mortonTiles]);

  if (!mortonFeatures || mortonLayers.length === 0) {
    return null;
  }

  return (
    <Layers
      sourceId="morton-tiles"
      layers={mortonLayers}
      data={mortonFeatures}
    />
  );
}

export default HeatmapMortonTileDisplay;

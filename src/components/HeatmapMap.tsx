import { useState, useEffect } from "react";
import {
  GlMap,
  MapMenuToggle,
  type MapModel,
  type MapStyleSettingsState,
} from "legoland-shared";
import "mapbox-gl/dist/mapbox-gl.css";
import "tombac-icons/react/style.css";
import styled from "styled-components";
import HeatmapPanel from "./HeatmapPanel";
import HeatmapClickHandler from "./HeatmapClickHandler";
import HeatmapMortonTileDisplay from "./HeatmapMortonTileDisplay";
import HeatmapMortonTileHoverHandler from "./HeatmapMortonTileHoverHandler";
import { useHeatmap } from "../hooks/useHeatmap";
import { Button } from "tombac";

function HeatmapMap() {
  const apiKey = import.meta.env.VITE_TOMTOM_API_KEY;
  const heatmapData = useHeatmap();

  const [showPanel, setShowPanel] = useState(true);

  useEffect(() => {
    heatmapData.setIsPolygonMode(true);
  }, [heatmapData]);

  const [mapModel, setMapModel] = useState<MapModel>("Genesis");
  const [mapStyleSettings, setMapStyleSettings] =
    useState<MapStyleSettingsState>({
      style: "Street dark",
      languageGenesis: "ngt",
      languageOrbis: "ngt",
      latin: true,
      basicPOI: true,
      buildings3D: false,
      driving: true,
    });

  return (
    <MapDiv>
      {showPanel && (
        <HeatmapPanel
          heatmapData={heatmapData}
          onToggleVisibility={() => setShowPanel(false)}
        />
      )}

      {!showPanel && (
        <Button
          variant="secondary"
          onClick={() => setShowPanel(true)}
          title="Show heatmap panel"
          $position="absolute"
          $top="20u"
          $left="20u"
          $borderRadius="4u"
          $margin="4u"
          $padding="1sp"
          $display="flex"
          $zIndex="1001"
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#f0f0f0";
            e.currentTarget.style.color = "#007acc";
            e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "white";
            e.currentTarget.style.color = "#666";
            e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
          }}
        >
          ▶
        </Button>
      )}

      <GlMap
        mapStyleSettings={mapStyleSettings}
        onMapStyleSettingsChange={(styles) =>
          setMapStyleSettings((prev) => ({ ...prev, ...styles }))
        }
        mapModel={mapModel}
        apiKey={apiKey}
        createMapOptions={{
          center: [19.51898192980059, 51.7373403170032],
          zoom: 10,
        }}
        hideNavigationControls={false}
        controlLocation="top-right"
        mapControlsProps={{
          shouldCloseOnInteractOutside: () => {
            return true;
          },
          mapLayersMenuContent: (
            <>
              <MapMenuToggle
                label="Orbis"
                checked={mapModel === "Orbis"}
                onChange={() => {
                  setMapModel((prev) =>
                    prev === "Genesis" ? "Orbis" : "Genesis"
                  );
                }}
              />
            </>
          ),
          styleOptions: [
            "Street light",
            "Street dark",
            "Mono light",
            "Mono dark",
            "Satellite",
          ],
        }}
      >
        <HeatmapClickHandler heatmapData={heatmapData} />
        <HeatmapMortonTileDisplay
          mortonTiles={heatmapData.mortonTiles}
          selectedLayer={heatmapData.selectedLayer}
        />
        <HeatmapMortonTileHoverHandler mortonTiles={heatmapData.mortonTiles} />
      </GlMap>
    </MapDiv>
  );
}

export default HeatmapMap;

const MapDiv = styled.div`
  height: 100vh;
  width: 100vw;
  position: relative;
  z-index: 0;
`;

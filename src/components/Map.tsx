import { useState } from "react";
import {
  GlMap,
  MapMenuToggle,
  type MapModel,
  type MapStyleSettingsState,
} from "legoland-shared";
import "mapbox-gl/dist/mapbox-gl.css";
import "tombac-icons/react/style.css";
import styled from "styled-components";
import TabbedPanel from "./TabbedPanel";
import PointDetailsModal from "./MapPointDetailsModal";
import AddPointFormModal from "./AddPointFormModal";
import MapClickHandler from "./MapClickHandler";
import MatchLocationButton from "./MatchLocationButton";
import { type PointOfInterestDTO } from "../types/api";
import RegionDisplay from "./RegionDisplay";

function Map() {
  const apiKey = import.meta.env.VITE_TOMTOM_API_KEY;

  const [showTabbedPanel, setShowTabbedPanel] = useState(true);

  const [showPointForm, setShowPointForm] = useState<{
    isVisible: boolean;
    longitude: number;
    latitude: number;
    tempId: string;
  } | null>(null);

  const [showPointDetails, setShowPointDetails] = useState<{
    poi: PointOfInterestDTO;
    index: number;
  } | null>(null);

  const addMapPoint = (longitude: number, latitude: number, tempId: string) => {
    setShowPointForm({
      isVisible: true,
      longitude,
      latitude,
      tempId,
    });
  };

  const showPointDetailsModal = (poi: PointOfInterestDTO, index: number) => {
    setShowPointDetails({ poi, index });
  };

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
    <>
      <MapDiv>
        {showTabbedPanel && (
          <TabbedPanel onToggleVisibility={() => setShowTabbedPanel(false)} />
        )}

        {!showTabbedPanel && (
          <button
            onClick={() => setShowTabbedPanel(true)}
            style={{
              position: "absolute",
              top: "20px",
              left: "20px",
              background: "white",
              border: "1px solid #e0e0e0",
              borderRadius: "4px",
              width: "32px",
              height: "32px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
              color: "#666",
              zIndex: 1001,
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              transition: "all 0.2s ease",
            }}
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
            title="Show panel"
          >
            ▶
          </button>
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
          <MapClickHandler
            onAddMapPoint={addMapPoint}
            onShowPointDetails={showPointDetailsModal}
          />

          <RegionDisplay />
        </GlMap>

        <SelectResponseForm />

        <MatchLocationButton />

        {showPointForm && (
          <AddPointFormModal
            longitude={showPointForm.longitude}
            latitude={showPointForm.latitude}
            onClose={() => setShowPointForm(null)}
          />
        )}

        {showPointDetails && (
          <PointDetailsModal
            index={showPointDetails.index}
            onClose={() => setShowPointDetails(null)}
          />
        )}
      </MapDiv>
    </>
  );
}
export default Map;

const MapDiv = styled.div`
  height: 90vh;
  width: 95vw;
  margin: 0 auto;
  position: relative;
  z-index: 0;
`;

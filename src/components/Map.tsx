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
import SelectResponseForm from "./SelectResponseForm";
import RegionDisplay from "./RegionDisplay";

function Map() {
  const apiKey = import.meta.env.VITE_TOMTOM_API_KEY;

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
        <TabbedPanel />

        <GlMap
          mapStyleSettings={mapStyleSettings}
          onMapStyleSettingsChange={(styles) =>
            setMapStyleSettings((prev) => ({ ...prev, ...styles }))
          }
          mapModel={mapModel}
          apiKey={apiKey}
          //centered at lodz
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

        {/* Przycisk dopasowywania lokalizacji */}
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

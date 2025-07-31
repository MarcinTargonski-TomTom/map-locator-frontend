import { useState } from "react";
import {
  GlMap,
  MapMenuToggle,
  type MapModel,
  type MapStyleSettingsState,
} from "legoland-shared";
import styled from "styled-components";
import MyRegionDisplay from "./RegionDisplay";
import sampleApiResponse from "../../sampleApiResponse.json";

function Map() {
  const apiKey = import.meta.env.VITE_TOMTOM_API_KEY;

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
      <GlMap
        mapStyleSettings={mapStyleSettings}
        onMapStyleSettingsChange={(styles) =>
          setMapStyleSettings((prev) => ({ ...prev, ...styles }))
        }
        mapModel={mapModel}
        apiKey={apiKey}
        createMapOptions={{ center: [19.458, 51.77], zoom: 13 }}
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
        <MyRegionDisplay apiResponse={sampleApiResponse} />
      </GlMap>
    </MapDiv>
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

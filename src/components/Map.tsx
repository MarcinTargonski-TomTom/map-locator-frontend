import { useState } from "react";
import {
  GlMap,
  MapMenuToggle,
  type MapModel,
  type MapStyleSettingsState,
} from "legoland-shared";

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
    <>
      <div style={{ height: "600px", width: "900px" }}>
        <GlMap
          mapStyleSettings={mapStyleSettings}
          onMapStyleSettingsChange={(styles) =>
            setMapStyleSettings((prev) => ({ ...prev, ...styles }))
          }
          mapModel={mapModel}
          apiKey={apiKey}
          createMapOptions={{ center: [0, 0], zoom: 1 }}
          hideNavigationControls={false}
          controlLocation="top-right"
          mapControlsProps={{
            shouldCloseOnInteractOutside: (_) => {
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
        ></GlMap>
      </div>
    </>
  );
}

export default Map;

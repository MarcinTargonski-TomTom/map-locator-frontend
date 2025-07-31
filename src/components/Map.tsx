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
import { MARKER_COLORS } from "../lib/markerColors";
import { BUDGET_OPTIONS } from "../lib/budgetOptions";
import type { BudgetType, TravelMode, PointOfInterest } from "../types/point";
import InfoPanel from "./InfoPanel";
import SearchPanel from "./SearchPanel";
import PointDetailsModal from "./MapPointDetailsModal";
import AddPointFormModal from "./AddPointFormModal";
import MapClickHandler from "./MapClickHandler";
import MatchLocationButton from "./MatchLocationButton";

const TRAVEL_MODE_OPTIONS = [
  { value: "CAR" as TravelMode, label: "Samochód" },
  { value: "PEDESTRIAN" as TravelMode, label: "Pieszy" },
  { value: "BUS" as TravelMode, label: "Autobus" },
];
import MyRegionDisplay from "./RegionDisplay";
import sampleApiResponse from "../../sampleApiResponse.json";
import type { ApiResponse } from "../types/api";
import { Button } from "tombac";

function Map() {
  const apiKey = import.meta.env.VITE_TOMTOM_API_KEY;

  const [pointsOfInterest, setPointsOfInterest] = useState<PointOfInterest[]>(
    []
  );
  const [regions, setRegions] = useState<ApiResponse[] | null>(null);
  const [responseIndex, setResponseIndex] = useState<number>(0);
  const [showPointForm, setShowPointForm] = useState<{
    isVisible: boolean;
    longitude: number;
    latitude: number;
    tempId: string;
  } | null>(null);

  const [showPointDetails, setShowPointDetails] = useState<{
    poi: PointOfInterest;
    index: number;
  } | null>(null);

  const addPointOfInterest = (poi: PointOfInterest) => {
    setPointsOfInterest((prev) => [...prev, poi]);
  };

  const addSearchPhrase = (
    text: string,
    budget: number,
    budgetType: BudgetType,
    travelMode: TravelMode
  ) => {
    const newPoi: PointOfInterest = {
      name: text,
      point: null,
      value: budget,
      budgetType,
      travelMode,
    };
    addPointOfInterest(newPoi);
  };

  const addMapPoint = (longitude: number, latitude: number, tempId: string) => {
    setShowPointForm({
      isVisible: true,
      longitude,
      latitude,
      tempId,
    });
  };

  const confirmMapPoint = (
    name: string,
    value: number,
    budgetType: BudgetType,
    travelMode: TravelMode
  ) => {
    if (!showPointForm) return;

    const newPoi: PointOfInterest = {
      name,
      point: {
        longitude: showPointForm.longitude,
        latitude: showPointForm.latitude,
      },
      value,
      budgetType,
      travelMode,
    };

    addPointOfInterest(newPoi);
    setShowPointForm(null);
  };

  const cancelMapPoint = () => {
    setShowPointForm(null);
  };

  const showPointDetailsModal = (poi: PointOfInterest, index: number) => {
    setShowPointDetails({ poi, index });
  };

  const closePointDetails = () => {
    setShowPointDetails(null);
  };

  const deletePointFromDetails = () => {
    if (showPointDetails) {
      removePointOfInterest(showPointDetails.index);
      setShowPointDetails(null);
    }
  };

  const removePointOfInterest = (index: number) => {
    setPointsOfInterest((prev) => prev.filter((_, i) => i !== index));
  };

  const clearAllPoints = () => {
    setRegions(null);
    setPointsOfInterest([]);
    setShowPointForm(null);
  };

  const exportData = () => {
    console.log("Dane do wysłania do API:", pointsOfInterest);
    return pointsOfInterest;
  };

  const mapPoints = pointsOfInterest.filter((poi) => poi.point !== null);
  const searchPhrases = pointsOfInterest.filter((poi) => poi.point === null);

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
        <InfoPanel
          pointsOfInterest={pointsOfInterest}
          mapPoints={mapPoints}
          searchPhrases={searchPhrases}
          clearAllPoints={clearAllPoints}
        />
        <SearchPanel
          addSearchPhrase={addSearchPhrase}
          removePointOfInterest={removePointOfInterest}
          clearAllPoints={clearAllPoints}
          exportData={exportData}
          searchPhrases={searchPhrases}
          pointsOfInterest={pointsOfInterest}
          budgetOptions={BUDGET_OPTIONS}
          travelModeOptions={TRAVEL_MODE_OPTIONS}
        />

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
            pointsOfInterest={pointsOfInterest}
            mapPoints={mapPoints}
            onAddMapPoint={addMapPoint}
            onShowPointDetails={showPointDetailsModal}
            markerColors={MARKER_COLORS}
          />

          {regions != null && (
            <MyRegionDisplay apiResponse={regions[responseIndex]} />
          )}
        </GlMap>

        {regions && regions.length > 0 && (
          <>
            <Button
              onClick={() => {
                if (responseIndex < regions.length - 1) {
                  setResponseIndex((prev) => prev + 1);
                }
              }}
            >
              Next Region
            </Button>
            <Button
              onClick={() => {
                if (responseIndex > 0) {
                  setResponseIndex((prev) => prev - 1);
                }
              }}
            >
              Previous Region
            </Button>
          </>
        )}

        {/* Przycisk dopasowywania lokalizacji */}
        <MatchLocationButton
          pointsOfInterest={pointsOfInterest}
          setRegions={setRegions}
        />

        {showPointForm && (
          <AddPointFormModal
            longitude={showPointForm.longitude}
            latitude={showPointForm.latitude}
            onConfirm={confirmMapPoint}
            onCancel={cancelMapPoint}
            budgetOptions={BUDGET_OPTIONS}
            travelModeOptions={TRAVEL_MODE_OPTIONS}
          />
        )}

        {showPointDetails && (
          <PointDetailsModal
            poi={showPointDetails.poi}
            onClose={closePointDetails}
            onDelete={deletePointFromDetails}
            budgetOptions={BUDGET_OPTIONS}
            travelModeOptions={TRAVEL_MODE_OPTIONS}
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

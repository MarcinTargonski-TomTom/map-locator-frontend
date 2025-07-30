import { useState, useEffect } from "react";
import React from "react";
import {
  GlMap,
  MapMenuToggle,
  useMap,
  type MapModel,
  type MapStyleSettingsState,
} from "legoland-shared";
import styled from "styled-components";
import mapboxgl from "mapbox-gl";
import { Button, Input } from "tombac";
import { MARKER_COLORS } from "../lib/markerColors";
import { BUDGET_OPTIONS } from "../lib/budgetOptions";

type BudgetType =
  | "distanceBudgetInMeters"
  | "timeBudgetInSec"
  | "energyBudgetInkWh"
  | "fuelBudgetInLiters";

interface MapPoint {
  id: string;
  longitude: number;
  latitude: number;
}

interface SearchPhrase {
  id: string;
  text: string;
  budget: number;
  budgetType: BudgetType;
}

function Map() {
  const apiKey = import.meta.env.VITE_TOMTOM_API_KEY;

  const [points, setPoints] = useState<MapPoint[]>([]);
  const [searchPhrases, setSearchPhrases] = useState<SearchPhrase[]>([]);
  const addPoint = (longitude: number, latitude: number) => {
    const newPoint: MapPoint = {
      id: `point-${Date.now()}`,
      longitude,
      latitude,
    };
    setPoints((prev) => [...prev, newPoint]);
  };

  const removePoint = (pointId: string) => {
    setPoints((prev) => prev.filter((point) => point.id !== pointId));
  };

  const clearAllPoints = () => {
    setPoints([]);
  };

  const addSearchPhrase = (
    text: string,
    budget: number,
    budgetType: BudgetType
  ) => {
    const newPhrase: SearchPhrase = {
      id: `phrase-${Date.now()}`,
      text,
      budget,
      budgetType,
    };
    setSearchPhrases((prev) => [...prev, newPhrase]);
  };

  const removeSearchPhrase = (phraseId: string) => {
    setSearchPhrases((prev) => prev.filter((phrase) => phrase.id !== phraseId));
  };

  const clearAllPhrases = () => {
    setSearchPhrases([]);
  };

  const exportPoints = () => {
    const pointsData = points.map((point) => ({
      longitude: point.longitude,
      latitude: point.latitude,
    }));

    console.log("Punkty do wysłania do API:", pointsData);

    return pointsData;
  };

  const exportSearchData = () => {
    const searchData = {
      points: points.map((point) => ({
        longitude: point.longitude,
        latitude: point.latitude,
      })),
      searchPhrases: searchPhrases.map((phrase) => ({
        text: phrase.text,
        budget: phrase.budget,
        budgetType: phrase.budgetType,
      })),
    };

    console.log("Dane wyszukiwania do wysłania do API:", searchData);

    return searchData;
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
        <InfoPanel>
          <div>
            <strong>Zaznaczone punkty: {points.length}</strong>
          </div>
          {points.length > 0 && (
            <>
              <Button variant="success" $margin="1sp" onClick={exportPoints}>
                Eksportuj punkty
              </Button>
              <Button variant="primary" $margin="1sp" onClick={clearAllPoints}>
                Wyczyść wszystkie punkty
              </Button>
            </>
          )}
          <div style={{ fontSize: "12px", marginTop: "8px", color: "#666" }}>
            Kliknij na mapę aby dodać punkt
            <br />
            Kliknij na punkt aby go usunąć
            <br />
            <span style={{ fontSize: "11px", fontStyle: "italic" }}>
              Każdy punkt ma automatycznie przypisany unikalny kolor
            </span>
          </div>

          {points.length > 0 && (
            <div style={{ marginTop: "12px", fontSize: "11px" }}>
              <strong>Kolory punktów:</strong>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "4px",
                  marginTop: "4px",
                }}
              >
                {points.map((point, index) => {
                  const color = MARKER_COLORS[index % MARKER_COLORS.length];
                  return (
                    <div
                      key={point.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        fontSize: "10px",
                      }}
                    >
                      <div
                        style={{
                          width: "12px",
                          height: "12px",
                          backgroundColor: color,
                          borderRadius: "50%",
                          marginRight: "4px",
                          border: "1px solid #ccc",
                        }}
                      ></div>
                      {index + 1}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </InfoPanel>

        {/* Panel wyszukiwania */}
        <SearchPanel>
          <div>
            <strong>Wyszukiwanie miejsca</strong>
          </div>
          <SearchForm
            onAddPhrase={addSearchPhrase}
            budgetOptions={BUDGET_OPTIONS}
          />

          {searchPhrases.length > 0 && (
            <div style={{ marginTop: "15px" }}>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  marginBottom: "8px",
                }}
              >
                Frazy do wyszukania ({searchPhrases.length}):
              </div>
              {searchPhrases.map((phrase) => (
                <div
                  key={phrase.id}
                  style={{
                    fontSize: "11px",
                    padding: "6px 8px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "4px",
                    marginBottom: "4px",
                    backgroundColor: "#f8f9fa",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: "bold" }}>{phrase.text}</div>
                    <div style={{ color: "#666", fontSize: "10px" }}>
                      {
                        BUDGET_OPTIONS.find(
                          (opt) => opt.value === phrase.budgetType
                        )?.label
                      }
                      : {phrase.budget}
                    </div>
                  </div>
                  <Button
                    onClick={() => removeSearchPhrase(phrase.id)}
                    style={{
                      backgroundColor: "#ef4444",
                      color: "white",
                      border: "none",
                      borderRadius: "3px",
                      padding: "2px 6px",
                      cursor: "pointer",
                      fontSize: "10px",
                    }}
                  >
                    ✕
                  </Button>
                </div>
              ))}
              <Button
                onClick={clearAllPhrases}
                style={{
                  backgroundColor: "#6b7280",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  padding: "6px 10px",
                  cursor: "pointer",
                  fontSize: "11px",
                  marginTop: "8px",
                  marginRight: "8px",
                }}
              >
                Wyczyść wszystkie frazy
              </Button>
              <Button
                onClick={exportSearchData}
                style={{
                  backgroundColor: "#3b82f6",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  padding: "6px 10px",
                  cursor: "pointer",
                  fontSize: "11px",
                  marginTop: "8px",
                }}
              >
                Eksportuj do API
              </Button>
            </div>
          )}
        </SearchPanel>

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
            points={points}
            onAddPoint={addPoint}
            onRemovePoint={removePoint}
            markerColors={MARKER_COLORS}
          />
        </GlMap>
      </MapDiv>
    </>
  );
}

function MapClickHandler({
  points,
  onAddPoint,
  onRemovePoint,
  markerColors,
}: {
  points: MapPoint[];
  onAddPoint: (lng: number, lat: number) => void;
  onRemovePoint: (pointId: string) => void;
  markerColors: string[];
}) {
  const { map } = useMap();

  useEffect(() => {
    if (!map) return;

    const handleMapClick = (e: mapboxgl.MapMouseEvent) => {
      const { lng, lat } = e.lngLat;
      onAddPoint(lng, lat);
    };

    map.on("click", handleMapClick);

    return () => {
      map.off("click", handleMapClick);
    };
  }, [map, onAddPoint]);

  useEffect(() => {
    if (!map) return;

    const existingMarkers = document.querySelectorAll(".custom-marker");
    existingMarkers.forEach((marker) => marker.remove());

    points.forEach((point, index) => {
      const el = document.createElement("div");
      el.className = "custom-marker";
      el.style.cursor = "pointer";
      el.title = `Kliknij aby usunąć punkt (${point.longitude.toFixed(
        4
      )}, ${point.latitude.toFixed(4)})`;

      const color = MARKER_COLORS[index % MARKER_COLORS.length];

      el.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" 
                fill="${color}" 
                stroke="#ffffff" 
                stroke-width="0.5"/>
        </svg>
      `;
      el.style.filter = "drop-shadow(0 2px 4px rgba(0,0,0,0.3))";

      el.addEventListener("click", (e) => {
        e.stopPropagation();
        onRemovePoint(point.id);
      });

      new mapboxgl.Marker(el)
        .setLngLat([point.longitude, point.latitude])
        .addTo(map);
    });

    return () => {
      const markers = document.querySelectorAll(".custom-marker");
      markers.forEach((marker) => marker.remove());
    };
  }, [map, points, onRemovePoint, markerColors]);

  return null;
}

function SearchForm({
  onAddPhrase,
  budgetOptions,
}: {
  onAddPhrase: (text: string, budget: number, budgetType: BudgetType) => void;
  budgetOptions: Array<{ value: BudgetType; label: string }>;
}) {
  const [text, setText] = useState("");
  const [budget, setBudget] = useState<number>(0);
  const [budgetType, setBudgetType] = useState<BudgetType>(
    "distanceBudgetInMeters"
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && budget > 0) {
      onAddPhrase(text.trim(), budget, budgetType);
      setText("");
      setBudget(0);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "10px" }}>
      <div style={{ marginBottom: "8px" }}>
        <Input
          type="text"
          placeholder="Wpisz frazę do wyszukania (np. 'restauracja')"
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{
            width: "100%",
            padding: "6px 8px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "12px",
            boxSizing: "border-box",
          }}
        />
      </div>

      <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
        <Input
          type="number"
          placeholder="Budżet"
          value={budget || ""}
          onChange={(e) => setBudget(Number(e.target.value))}
          min="0"
          step="0.1"
          style={{
            flex: 1,
            padding: "6px 8px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "12px",
          }}
        />
        <select
          value={budgetType}
          onChange={(e) => setBudgetType(e.target.value as BudgetType)}
          style={{
            flex: 1,
            padding: "6px 8px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "12px",
          }}
        >
          {budgetOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <Button
        type="submit"
        disabled={!text.trim() || budget <= 0}
        style={{
          backgroundColor: text.trim() && budget > 0 ? "#22c55e" : "#ccc",
          color: "white",
          border: "none",
          borderRadius: "4px",
          padding: "8px 12px",
          cursor: text.trim() && budget > 0 ? "pointer" : "not-allowed",
          fontSize: "12px",
          width: "100%",
        }}
      >
        Dodaj frazę
      </Button>
    </form>
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

const InfoPanel = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-width: 300px;
  font-size: 14px;
`;

const SearchPanel = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  width: 320px;
  max-height: 60vh;
  overflow-y: auto;
  font-size: 14px;
`;

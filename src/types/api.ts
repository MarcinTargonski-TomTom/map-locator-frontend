export interface PointDTO {
  latitude: number;
  longitude: number;
}

export interface Region {
  center: PointDTO;
  boundary: PointDTO[];
}

export interface PointOfInterestDTO {
  isDisplayed: boolean;
  order: number;
  name: string | null;
  center: PointDTO | null;
  value: number;
  budgetType: BudgetType;
  travelMode: TravelMode;
  color: string;
}

export interface ApiResponse {
  requestRegions: { pointOfInterest: PointOfInterestDTO; region: Region }[];
  responseRegion: Region;
}

export type TravelMode = "CAR" | "PEDESTRIAN" | "BUS";
export const TRAVEL_MODE_OPTIONS = [
  { value: "CAR" as TravelMode, label: "Samochód" },
  { value: "BUS" as TravelMode, label: "Autobus" },
];

export type BudgetType =
  | "distanceBudgetInMeters"
  | "timeBudgetInSec"
  | "energyBudgetInkWh"
  | "fuelBudgetInLiters";

export const BUDGET_OPTIONS = [
  { value: "distanceBudgetInMeters" as BudgetType, label: "Dystans (metry)" },
  { value: "timeBudgetInSec" as BudgetType, label: "Czas (sekundy)" },
  { value: "energyBudgetInkWh" as BudgetType, label: "Energia (kWh)" },
  { value: "fuelBudgetInLiters" as BudgetType, label: "Paliwo (litry)" },
];

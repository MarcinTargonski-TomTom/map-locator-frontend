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
  name: string;
  requestRegions: {
    pointOfInterest: PointOfInterestDTO;
    region: Region;
  }[];
  responseRegion: Region;
}

export type TravelMode = "CAR" | "PEDESTRIAN" | "BUS";
export const TRAVEL_MODE_OPTIONS = [
  { value: "CAR" as TravelMode, label: "Car" },
  { value: "BUS" as TravelMode, label: "Bus" },
];

export type BudgetType =
  | "distanceBudgetInMeters"
  | "timeBudgetInSec"
  | "energyBudgetInkWh"
  | "fuelBudgetInLiters";

export const BUDGET_OPTIONS = [
  { value: "distanceBudgetInMeters" as BudgetType, label: "Distance (meters)" },
  { value: "timeBudgetInSec" as BudgetType, label: "Time (seconds)" },
  { value: "energyBudgetInkWh" as BudgetType, label: "Energy (kWh)" },
  { value: "fuelBudgetInLiters" as BudgetType, label: "Fuel (liters)" },
];

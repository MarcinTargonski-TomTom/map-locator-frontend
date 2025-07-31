export type BudgetType =
  | "distanceBudgetInMeters"
  | "timeBudgetInSec"
  | "energyBudgetInkWh"
  | "fuelBudgetInLiters";

export type TravelMode = "CAR" | "PEDESTRIAN" | "BUS";

export interface Point {
  latitude: number;
  longitude: number;
}

export interface PointOfInterest {
  name: string;
  point: Point | null;
  value: number;
  budgetType: BudgetType;
  travelMode: TravelMode;
}

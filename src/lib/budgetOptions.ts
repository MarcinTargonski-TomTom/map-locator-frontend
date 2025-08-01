import type { BudgetType } from "../types/point";

export const BUDGET_OPTIONS = [
  { value: "distanceBudgetInMeters" as BudgetType, label: "Dystans (metry)" },
  { value: "timeBudgetInSec" as BudgetType, label: "Czas (sekundy)" },
  { value: "energyBudgetInkWh" as BudgetType, label: "Energia (kWh)" },
  { value: "fuelBudgetInLiters" as BudgetType, label: "Paliwo (litry)" },
];

import { useState } from "react";
import type { BudgetType, TravelMode } from "../types/api";
import type { ApiResponse, PointOfInterestDTO } from "../types/api";
import { useToken } from "./useToken";
import { TokenType } from "../types/token";

interface LocationMatchRequest {
  center?: {
    latitude: number;
    longitude: number;
  };
  value: number;
  budgetType: string;
  travelMode: string;
  name: string | null;
}

interface UseLocationMatcherResult {
  isLoading: boolean;
  error: string | null;
  matchLocations: (
    pointsOfInterest: PointOfInterestDTO[],
    matchingSmootherType: "NONE" | "CONVEX_HULL" | "ENVELOPE"
  ) => Promise<ApiResponse[] | void>;
}

const mapBudgetType = (budgetType: BudgetType): string => {
  const mapping: Record<BudgetType, string> = {
    distanceBudgetInMeters: "DISTANCE",
    timeBudgetInSec: "TIME",
    energyBudgetInkWh: "ENERGY",
    fuelBudgetInLiters: "FUEL",
  };
  return mapping[budgetType] || budgetType;
};

const mapTravelMode = (travelMode: TravelMode): string => {
  return travelMode;
};

export const useLocationMatcher = (): UseLocationMatcherResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [getStoredToken] = useToken();

  const getAuthToken = (): string | null => {
    try {
      const token = getStoredToken(TokenType.AUTH);

      if (!token) return null;

      // If token starts and ends with quotes, it's a JSON string
      if (token.startsWith('"') && token.endsWith('"')) {
        try {
          return JSON.parse(token);
        } catch {
          return token;
        }
      }
      // Otherwise return as is
      return token;
    } catch {
      return null;
    }
  };

  const matchLocations = async (
    pointsOfInterest: PointOfInterestDTO[],
    matchingSmootherType: "NONE" | "CONVEX_HULL" | "ENVELOPE"
  ): Promise<ApiResponse[] | void> => {
    setIsLoading(true);
    setError(null);

    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Missing authentication token. Please log in again.");
      }

      const requestData: LocationMatchRequest[] = pointsOfInterest.map(
        (poi) => {
          const baseRequest: LocationMatchRequest = {
            name: poi.name,
            value: poi.value,
            budgetType: mapBudgetType(poi.budgetType),
            travelMode: mapTravelMode(poi.travelMode),
          };

          if (poi.center) {
            baseRequest.center = {
              latitude: poi.center.latitude,
              longitude: poi.center.longitude,
            };
          }

          return baseRequest;
        }
      );

      console.log("Sending data to API:", requestData);

      const response = await fetch(
        "http://localhost:8080/locations/v1/matchLocation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            pois: requestData,
            matchingSmootherType: matchingSmootherType,
          }),
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error(
            "Unauthorized access. Please check your authentication token."
          );
        }
        if (response.status === 403) {
          throw new Error(
            "Insufficient permissions to perform this operation."
          );
        }
        throw new Error(
          `HTTP Error: ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();
      return result as ApiResponse[];
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      console.error("Error while sending data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    matchLocations,
  };
};

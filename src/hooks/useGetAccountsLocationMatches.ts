import type { ApiResponse } from "../types/api";
import { TokenType } from "../types/token";
import { useToken } from "./useToken";

export type GetAccountsLocationMatchesResponse = {
  getAccountsLocationMatches: () => Promise<ApiResponse[] | undefined>;
};

const API_ROOT = import.meta.env.VITE_API_ROOT;

export function useGetAccountsLocationMatches(): GetAccountsLocationMatchesResponse {
  const [getStoredToken] = useToken();

  const getAccountsLocationMatches = async () => {
    try {
      const authToken = getStoredToken(TokenType.AUTH);

      if (!authToken) {
        console.warn(
          "No tokens found, skipping account location matches fetch"
        );
        return;
      }
      const response = await fetch(
        `${API_ROOT}/locations/v1/accountLocations`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(
          data.message || "Couldn't get account location matches"
        );
      }

      const data: ApiResponse[] = await response.json();
      return data;
    } catch (err: Error | unknown) {
      console.error("Get account location matches error:", err);
      throw err;
    }
  };

  return { getAccountsLocationMatches };
}

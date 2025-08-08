import type { Tokens } from "../types/signIn";

export type SignInResult = {
  extendSession: (tokens: Tokens) => Promise<Tokens>;
};

const API_ROOT = import.meta.env.VITE_API_ROOT;

export function useExtendSession(): SignInResult {
  const extendSession = async (tokens: Tokens) => {
    try {
      const response = await fetch(
        `${API_ROOT}/auth/extend/${tokens.refresh}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokens.auth}`,
          },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Couldn't extend session");
      }

      const data: Tokens = await response.json();
      return data;
    } catch (err: Error | unknown) {
      console.error("Extend session error:", err);
      throw err;
    }
  };

  return { extendSession };
}

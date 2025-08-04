import type { Credentials, Tokens } from "../types/signIn";

export type SignInResult = {
  signIn: (credentials: Credentials) => Promise<Tokens>;
};

const API_ROOT = import.meta.env.VITE_API_ROOT;

export function useSignIn(): SignInResult {
  const signIn = async (credentials: Credentials) => {
    try {
      const response = await fetch(`${API_ROOT}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Sign in failed");
      }

      const data: Tokens = await response.json();
      return data;
    } catch (err: Error | unknown) {
      console.error("Sign in error:", err);
      throw err;
    }
  };

  return { signIn };
}

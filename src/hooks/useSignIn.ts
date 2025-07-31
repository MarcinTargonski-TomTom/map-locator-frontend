import { useState } from "react";

export type Tokens = {
  auth: string;
};

export type SignInResult = {
  loading: boolean;
  error: string | null;
  tokens: Tokens | null;
  signIn: (login: string, password: string) => Promise<Tokens>;
};

const API_ROOT = import.meta.env.VITE_API_ROOT;

export function useSignIn(): SignInResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokens, setTokens] = useState<Tokens | null>(null);

  const signIn = async (login: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_ROOT}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ login, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Sign in failed");
      }

      const data: Tokens = await response.json();
      setTokens(data);
      return data;
    } catch (err: any) {
      setError(err.message || "Unknown error");
      setTokens(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, tokens, signIn };
}

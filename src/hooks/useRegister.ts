import { useState } from "react";

export type RegisterResult = {
  loading: boolean;
  error: string | null;
  success: boolean;
  register: (login: string, email: string, password: string) => Promise<void>;
};

const API_ROOT = import.meta.env.VITE_API_ROOT;

export function useRegister(): RegisterResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const register = async (login: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const response = await fetch(`${API_ROOT}/accounts/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ login, email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Registration failed");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Unknown error");
      setSuccess(false);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, success, register };
}

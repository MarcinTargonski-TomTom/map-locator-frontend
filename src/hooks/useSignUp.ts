import type { SignUpData } from "../types/signUp";

export type SignUpResult = {
  signUp: (data: SignUpData) => Promise<void>;
};

const API_ROOT = import.meta.env.VITE_API_ROOT;

export function useSignUp(): SignUpResult {
  const signUp = async (data: SignUpData) => {
    try {
      const response = await fetch(`${API_ROOT}/accounts/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Registration failed");
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      throw err;
    }
  };

  return { signUp };
}

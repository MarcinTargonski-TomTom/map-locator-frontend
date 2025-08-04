import type { Tokens } from "../types/signIn";

const TOKEN_KEY = "auth_token";

export function useToken(initialValue: Tokens | null = null) {
  const getStoredToken = (): string | null => {
    try {
      const item = window.localStorage.getItem(TOKEN_KEY);
      if (!item) return initialValue?.auth || null;

      // Jeśli wartość zaczyna się i kończy cudzysłowami, to jest JSON string
      if (item.startsWith('"') && item.endsWith('"')) {
        return JSON.parse(item);
      }
      // W przeciwnym razie zwróć surową wartość
      return item;
    } catch {
      return initialValue?.auth || null;
    }
  };

  const setToken = (value: string | null) => {
    try {
      if (value === null) {
        window.localStorage.removeItem(TOKEN_KEY);
      } else {
        // Zapisuj token bezpośrednio bez JSON.stringify
        window.localStorage.setItem(TOKEN_KEY, value);
      }
    } catch (error) {
      console.error("Error setting token:", error);
    }
  };

  const removeToken = () => {
    try {
      window.localStorage.removeItem(TOKEN_KEY);
    } catch (error) {
      console.error("Error removing token:", error);
    }
  };

  return [getStoredToken(), setToken, removeToken] as const;
}

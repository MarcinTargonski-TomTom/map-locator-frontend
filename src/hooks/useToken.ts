import { useCallback } from "react";
import type { Tokens } from "../types/signIn";
import type { TokenData, TokenType } from "../types/token";
import { jwtDecode } from "jwt-decode";

export function useToken(initialValue: Tokens | null = null) {
  const getStoredToken = useCallback(
    (tokenKey: TokenType): string | null => {
      try {
        const item = window.localStorage.getItem(tokenKey);
        if (!item) return initialValue?.auth || null;

        if (item.startsWith('"') && item.endsWith('"')) {
          return JSON.parse(item);
        }
        return item;
      } catch {
        return initialValue?.auth || null;
      }
    },
    [initialValue?.auth]
  );

  const setToken = useCallback((value: string | null, tokenKey: TokenType) => {
    try {
      if (value === null) {
        window.localStorage.removeItem(tokenKey);
      } else {
        window.localStorage.setItem(tokenKey, value);
      }
    } catch (error) {
      console.error("Error setting token:", error);
    }
  }, []);

  const removeToken = useCallback((tokenKey: TokenType) => {
    try {
      window.localStorage.removeItem(tokenKey);
    } catch (error) {
      console.error("Error removing token:", error);
    }
  }, []);

  const decodeJwtToken = useCallback(
    (token: string | null): TokenData | null => {
      if (!token) return null;
      try {
        const decodedJwtToken: TokenData = jwtDecode(token);
        return {
          sub: decodedJwtToken.sub,
          accountRoles: decodedJwtToken.accountRoles,
          exp: decodedJwtToken.exp,
          lang: decodedJwtToken.lang,
        };
      } catch {
        return null;
      }
    },
    []
  );

  const getExpirationTime = useCallback(
    (token: string | null): number | null => {
      return decodeJwtToken(token)?.exp ?? null;
    },
    [decodeJwtToken]
  );

  return [
    getStoredToken,
    setToken,
    removeToken,
    decodeJwtToken,
    getExpirationTime,
  ] as const;
}

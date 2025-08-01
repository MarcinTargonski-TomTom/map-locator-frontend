import type { Tokens } from "../types/signIn";
import { useLocalStorage } from "./useLocalStorage";

const TOKEN_KEY = "auth_token";

export function useToken(initialValue: Tokens | null = null) {
  return useLocalStorage<Tokens | null>(TOKEN_KEY, initialValue);
}

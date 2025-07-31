import { useLocalStorage } from "./useLocalStorage";
import type { Tokens } from "./useSignIn";

const TOKEN_KEY = "auth_token";

export function useToken(initialValue: Tokens | null = null) {
  return useLocalStorage<Tokens | null>(TOKEN_KEY, initialValue);
}

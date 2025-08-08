import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { TokenType, type Role, type TokenData } from "../types/token";
import { useNavigate } from "react-router-dom";
import { useToken } from "../hooks/useToken";
import { SIGN_IN_PATH } from "../const/routes";
import { useToasts } from "tombac";

type SessionContextProps = {
  role: Role | null;
  signIn: (token: string) => void;
  logOut: () => void;
};

const SessionContext = createContext<SessionContextProps>({
  role: null,
  signIn: () => {},
  logOut: () => {},
});

type SessionProviderProps = {
  children: ReactNode;
};

export const SessionProvider = ({ children }: SessionProviderProps) => {
  const [role, setRole] = useState<Role | null>(null);
  const [getStoredToken, setToken, removeToken, decodeJwtToken] = useToken();
  const navigate = useNavigate();
  const { addToast } = useToasts();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const logOut = useCallback(() => {
    console.log("Logging out");

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
      console.log("Timer cleared on logout");
    }

    removeToken(TokenType.AUTH);
    setRole(null);
    navigate(SIGN_IN_PATH);
    addToast("You have been logged out", "info");
  }, [removeToken, navigate]);

  const logoutAfterTimeout = useCallback((decodedToken: TokenData) => {
    if (!timerRef.current) {
      const currentTime = Date.now() / 1000;
      const timeUntilExpiration = (decodedToken.exp - currentTime) * 1000;
      console.log(
        `Creating auto-logout timer for ${Math.round(
          timeUntilExpiration / 1000
        )} seconds`
      );

      timerRef.current = setTimeout(() => {
        console.log("Auto-logout triggered");
        addToast("Your session has expired", "alert");
        logOut();
      }, timeUntilExpiration);
    }
  }, []);

  const signIn = useCallback((token: string) => {
    setRole(decodeJwtToken(token)?.accountRoles[0] || null);
    setToken(token, TokenType.AUTH);
    const decodedToken = decodeJwtToken(token);
    if (decodedToken) logoutAfterTimeout(decodedToken);
  }, []);

  useEffect(() => {
    const token: string | null = getStoredToken(TokenType.AUTH);
    const currentTime = Date.now() / 1000;

    const checkToken = (token: string | null): TokenData | undefined => {
      try {
        if (!token) {
          setRole(null);
          console.log("No token found, setting role to null");
          return;
        }

        const decodedToken = decodeJwtToken(token);
        if (!decodedToken) throw new Error("Invalid token");

        if (decodedToken.exp < currentTime) {
          console.log("Token expired");
          addToast("Your session expired", "info");
          logOut();
          return;
        }

        const accountRole = decodedToken.accountRoles[0];
        console.log("Setting role from token:", accountRole);
        setRole(accountRole);
      } catch (error) {
        console.error("Error decoding token:", error);
        logOut();
        return;
      }
    };

    checkToken(token);
  }, [navigate]);

  return (
    <SessionContext.Provider value={{ role, signIn, logOut }}>
      {children}
    </SessionContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSessionContext = () => useContext(SessionContext);

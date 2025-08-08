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
import type { Tokens } from "../types/signIn";
import { useExtendSession } from "../hooks/useExtendSession";

type SessionContextProps = {
  role: Role | null;
  signIn: (tokens: Tokens) => void;
  logOut: () => void;
  showExtendSessionModal: boolean;
  handleExtendSession: () => void;
  handleCloseModal: () => void;
};

const SessionContext = createContext<SessionContextProps>({
  role: null,
  signIn: () => {},
  logOut: () => {},
  showExtendSessionModal: false,
  handleExtendSession: () => {},
  handleCloseModal: () => {},
});

type SessionProviderProps = {
  children: ReactNode;
};

export const SessionProvider = ({ children }: SessionProviderProps) => {
  const [role, setRole] = useState<Role | null>(null);
  const [showExtendSessionModal, setShowExtendSessionModal] = useState(false);
  const [getStoredToken, setToken, removeToken, decodeJwtToken] = useToken();
  const { extendSession } = useExtendSession();
  const navigate = useNavigate();
  const { addToast } = useToasts();
  const sessionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const extendSessionTimerRef = useRef<NodeJS.Timeout | null>(null);

  const logOut = useCallback(() => {
    console.log("Logging out");

    if (sessionTimerRef.current) {
      clearTimeout(sessionTimerRef.current);
      sessionTimerRef.current = null;
      console.log("Timer cleared on logout");
    }

    if (extendSessionTimerRef.current) {
      clearTimeout(extendSessionTimerRef.current);
      extendSessionTimerRef.current = null;
      console.log("Extend session timer cleared on logout");
      setShowExtendSessionModal(false);
    }

    removeToken(TokenType.AUTH);
    removeToken(TokenType.REFRESH);
    setRole(null);
    navigate(SIGN_IN_PATH);
    addToast("You have been logged out", "info");
  }, [removeToken, navigate]);

  const logoutAfterTimeout = useCallback((decodedToken: TokenData) => {
    if (!sessionTimerRef.current) {
      const currentTime = Date.now() / 1000;
      const timeUntilExpiration = (decodedToken.exp - currentTime) * 1000;
      console.log(
        `Creating auto-logout timer for ${Math.round(
          timeUntilExpiration / 1000
        )} seconds`
      );

      sessionTimerRef.current = setTimeout(() => {
        console.log("Auto-logout triggered");
        addToast("Your session has expired", "alert");
        logOut();
      }, timeUntilExpiration);
    }
  }, []);

  const handleExtendSession = useCallback(async () => {
    setShowExtendSessionModal(false);

    const refreshToken = getStoredToken(TokenType.REFRESH);
    const authToken = getStoredToken(TokenType.AUTH);
    if (refreshToken && authToken) {
      try {
        const newTokens: Tokens = await extendSession({
          auth: authToken,
          refresh: refreshToken,
        });

        if (sessionTimerRef.current) {
          clearTimeout(sessionTimerRef.current);
          sessionTimerRef.current = null;
        }

        if (extendSessionTimerRef.current) {
          clearTimeout(extendSessionTimerRef.current);
          extendSessionTimerRef.current = null;
        }

        signIn(newTokens);
        addToast("Session extended successfully", "success");
      } catch (error) {
        console.error("Error extending session:", error);
        addToast("Failed to extend session", "danger");
      }
    }
  }, [addToast]);

  const handleCloseModal = useCallback(() => {
    addToast("Your session will not be extended", "alert");
    setShowExtendSessionModal(false);
  }, []);

  const showExtendSessionModalAfterTimeout = useCallback(
    (decodedAuthtoken: TokenData) => {
      if (extendSessionTimerRef.current) {
        clearTimeout(extendSessionTimerRef.current);
        extendSessionTimerRef.current = null;
      }
      const currentTime = Date.now() / 1000;
      const timeUntilExpiration =
        (decodedAuthtoken.exp - currentTime) * 1000 * 0.7;
      extendSessionTimerRef.current = setTimeout(() => {
        console.log("Showing extend session modal");
        setShowExtendSessionModal(true);
      }, timeUntilExpiration);
    },
    []
  );

  const signIn = useCallback((tokens: Tokens) => {
    const authToken = tokens.auth;
    setRole(decodeJwtToken(authToken)?.accountRoles[0] || null);
    setToken(authToken, TokenType.AUTH);
    setToken(tokens.refresh, TokenType.REFRESH);
    const decodedAuthtoken = decodeJwtToken(authToken);
    if (decodedAuthtoken) {
      logoutAfterTimeout(decodedAuthtoken);
      const decodedRefreshToken = decodeJwtToken(tokens.refresh);

      if (decodedRefreshToken) {
        showExtendSessionModalAfterTimeout(decodedAuthtoken);
      }
    }
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
  }, [navigate, setRole]);

  return (
    <SessionContext.Provider
      value={{
        role,
        signIn,
        logOut,
        showExtendSessionModal,
        handleExtendSession,
        handleCloseModal,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSessionContext = () => useContext(SessionContext);

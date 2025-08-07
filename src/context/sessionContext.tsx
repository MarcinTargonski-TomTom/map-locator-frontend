import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { TokenType, type Role, type TokenData } from "../types/token";
import { useNavigate } from "react-router-dom";
import { SIGN_IN_PATH } from "../components/Navbar";
import { useToken } from "../hooks/useToken";

type SessionContextProps = {
  role: Role | null;
  logOut: () => void;
};

const SessionContext = createContext<SessionContextProps>({
  role: null,
  logOut: () => {},
});

type SessionProviderProps = {
  children: ReactNode;
};

export const SessionProvider = ({ children }: SessionProviderProps) => {
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);
  const [getStoredToken, , removeToken, decodeJwtToken, getExpirationTime] =
    useToken();
  const navigate = useNavigate();
  console.log("init");

  const logOut = useCallback(() => {
    removeToken(TokenType.AUTH);
    setRole(null);
    navigate(SIGN_IN_PATH);
  }, [removeToken, navigate]);

  useEffect(() => {
    const checkToken = () => {
      const token = getStoredToken(TokenType.AUTH);
      console.log("Checking token:", token);
      if (!token) {
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        const decodedToken: TokenData | null = decodeJwtToken(token);
        console.log("Decoded token:", decodedToken);
        const currentTime = Date.now() / 1000;
        const expirationTime = getExpirationTime(token) ?? 0;
        console.log(
          "Token expiration time:",
          expirationTime,
          "Current time:",
          currentTime
        );
        if (expirationTime < currentTime) {
          console.log("Token expired, logging out");
          logOut();
        } else {
          console.log("Token is valid, setting role");
          setRole(
            decodedToken?.accountRoles ? decodedToken.accountRoles[0] : null
          );
        }
      } catch {
        console.error("Error decoding token, logging out");
        logOut();
      } finally {
        setLoading(false);
      }
    };
    checkToken();
    console.log("Acocunt role: ", role);
  }, [getStoredToken, logOut]);

  if (loading) {
    return null;
  }

  return (
    <SessionContext.Provider value={{ role, logOut }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSessionContext = () => useContext(SessionContext);

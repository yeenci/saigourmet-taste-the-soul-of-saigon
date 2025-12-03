/* eslint-disable react-hooks/exhaustive-deps */
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { User } from "../lib/types";
import { apiRequest } from "../lib/utils";
import { AuthContext } from "./AuthContext";

// Helper to decode JWT (Internal to this file)
const parseJwt = (token: string) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.log(e);
    return;
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const logoutTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = undefined;
    }
  }, []);

  const calculateRemainTime = (token: string) => {
    const decoded = parseJwt(token);
    if (!decoded || !decoded.exp) return 0;
    const adjExpirationTime = decoded.exp * 1000;
    const remainingDuration = adjExpirationTime - Date.now();
    return remainingDuration;
  };

  // fetch user profile using apiRequest helper
  const fetchUser = async (authToken: string) => {
    try {
      const response = await apiRequest("/user/me", {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (response.ok) {
        const user = await response.json();
        const userData = user.data;

        setUser({
          id: userData.id,
          email: userData.email,
          phone_number: userData.phoneNumber || userData.phone_number,
          address: userData.address,
          isAdmin: userData.isAdmin || false,
        });
      } else {
        logout();
      }
    } catch (e) {
      console.error("Error fetching user: ", e);
    } finally {
      setIsLoading(false);
    }
  };

  // Login
  const login = async (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);

    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);

    const remainingTime = calculateRemainTime(newToken);
    logoutTimerRef.current = setTimeout(logout, remainingTime);

    await fetchUser(newToken);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      const remainingTime = calculateRemainTime(storedToken);

      if (remainingTime <= 6000) {
        logout();
        setIsLoading(false);
      } else {
        setToken(storedToken);

        if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);

        logoutTimerRef.current = setTimeout(logout, remainingTime);
        fetchUser(storedToken);
      }
    } else {
      setIsLoading(false);
    }

    return () => {
      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated: !!user, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

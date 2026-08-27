import {useEffect,useMemo,useState,} from "react";
import { AuthContext } from "./AuthContextValue";
import { authApi,refreshAccessToken,} from "../services/api";

import {setAccessToken,clearAccessToken} from "../services/tokenStore";


export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore login session when the app starts
  useEffect(() => {
    let active = true;

    const restoreSession = async () => {
      try {
        // Get a new access token using
        // the HttpOnly refresh-token cookie
        const token = await refreshAccessToken();

        if (!token) {
          throw new Error("Session expired");
        }

        // Get the currently logged-in user
        const { data } = await authApi.me();

        if (!active) return;

        const nextUser = {
          id: data.id,
          username: data.username,
          email: data.email,
          role: data.role,
          isVerified: data.isVerified,
        };

        setAccessToken(token);
        setUser(nextUser);
      } catch {
        if (!active) return;

        clearAccessToken();
        setUser(null);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    restoreSession();

    return () => {
      active = false;
    };
  }, []);

  // Login
  const login = async (payload) => {
    const { data } = await authApi.login(payload);

    // Access token → memory only
    setAccessToken(data.accessToken);

    // User information
    setUser(data.user);

    return data;
  };

  // Register
  const register = async (payload) => {
    const { data } = await authApi.register(payload);

    return data;
  };

  // Logout
  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      clearAccessToken();
      setUser(null);
    }
  };

  // Logout from all devices
  const logoutAll = async () => {
    try {
      await authApi.logoutAll();
    } finally {
      clearAccessToken();
      setUser(null);
    }
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === "admin",

      login,
      register,
      logout,
      logoutAll,
    }),
    [user, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

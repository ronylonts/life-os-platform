"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { authApi } from "@/lib/api/services";
import { ApiClientError } from "@/lib/api/client";
import { clearToken, getToken, setToken } from "@/lib/auth/storage";
import type { LoginPayload, RegisterPayload, User } from "@/types/api";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function redirectToDashboard() {
  if (typeof window !== "undefined") {
    window.location.href = "/dashboard";
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const profile = await authApi.me();
      setUser(profile);
    } catch {
      clearToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const completeAuth = useCallback(async (token: string, profile?: User) => {
    setToken(token);

    if (profile?.id) {
      setUser(profile);
      redirectToDashboard();
      return;
    }

    try {
      const me = await authApi.me();
      setUser(me);
      redirectToDashboard();
    } catch {
      clearToken();
      setUser(null);
      throw new ApiClientError(
        "Connexion réussie mais impossible de charger le profil",
        500,
      );
    }
  }, []);

  const login = useCallback(
    async (payload: LoginPayload) => {
      const response = await authApi.login(payload);
      await completeAuth(response.token, response.user);
    },
    [completeAuth],
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      const response = await authApi.register(payload);
      await completeAuth(response.token, response.user);
    },
    [completeAuth],
  );

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, register, logout }),
    [user, loading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

export function getAuthErrorMessage(error: unknown): string {
  if (error instanceof ApiClientError) {
    return error.message;
  }
  return "Une erreur inattendue est survenue";
}

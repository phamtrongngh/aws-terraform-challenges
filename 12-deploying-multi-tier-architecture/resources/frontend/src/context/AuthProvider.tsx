import React, { createContext, useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";

import { apiClient } from "@/lib/api";

interface User {
  name: string;
  username: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  login(username: string, password: string): Promise<void>;
  register(name: string, username: string, password: string): Promise<void>;
  logout(): void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("accessToken"));
  const [isLoading, setIsLoading] = useState(true);

  const authApi = useMemo(() => apiClient.createAuthClient(null), []);
  const usersApi = useMemo(() => apiClient.createUsersClient(token), [token]);

  const register = async (name: string, username: string, password: string) => {
    const { accessToken } = await authApi.authControllerRegister({
      registerDto: {
        name, username, password
      }
    })
    localStorage.setItem("accessToken", accessToken);
    setToken(accessToken)
    navigate("/");
  }

  const login = async (username: string, password: string) => {
    const { accessToken } = await authApi.authControllerLogin({ loginDto: { username, password } })
    localStorage.setItem("accessToken", accessToken);
    setToken(accessToken)
    navigate("/");
  }

  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
    setToken(null);
    navigate("/");
  }

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        if (token) {
          const user = await usersApi.usersControllerFind()
          setUser(user)
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [token, usersApi]);

  return (
    <AuthContext.Provider value={{
      user, logout, isLoading, token, login, register
    }}>
      {children}
    </AuthContext.Provider>
  );
}

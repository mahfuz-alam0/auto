// src/contexts/AuthContext.tsx
import React, { useState, createContext, useContext, ReactNode } from "react";
import { IUser } from "../types/user.types";
import { getLocalStorageItem, setLocalStorageItem, removeLocalStorageItem } from "../utils/localStorage";

interface AuthContextType {
  user: IUser | null;
  login: (userData: IUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(() => {
    return getLocalStorageItem<IUser | null>("user", null);
  });

  const login = (userData: IUser) => {
    setUser(userData);
    setLocalStorageItem("user", userData);
  };

  const logout = () => {
    setUser(null);
    removeLocalStorageItem("user");
  };

  const returnValue: AuthContextType = {
    user,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={returnValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthProvider;
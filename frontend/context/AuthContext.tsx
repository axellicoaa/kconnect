"use client";
import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import api from "../lib/api";
import { useRouter } from "next/navigation";

interface AuthContextProps {
  user: any;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  // 🔹 Cargar usuario desde token en refresh
  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser({
          email: payload.sub,
          role: payload.role,
          name: payload.name,
          id: payload.id,
        });
      } catch (err) {
        console.error("Error decodificando token:", err);
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });
    Cookies.set("token", res.data.token);
    const payload = JSON.parse(atob(res.data.token.split(".")[1]));
    setUser({ email: payload.sub, role: payload.role, name: payload.name });
  };

  const logout = () => {
    Cookies.remove("token");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
};

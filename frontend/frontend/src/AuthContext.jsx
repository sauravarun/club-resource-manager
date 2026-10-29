import { createContext, useContext, useEffect, useState } from "react";
import { api } from "./api";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("token")) return setLoading(false);
    api("/auth/me")
      .then(setUser)
      .catch(() => localStorage.removeItem("token"))
      .finally(() => setLoading(false));
  }, []);

  async function login(username, password) {
    const data = await api("/auth/login", { method: "POST", form: { username, password } });
    localStorage.setItem("token", data.access_token);
    setUser(await api("/auth/me"));
  }

  async function register(username, password) {
    await api("/auth/register", { method: "POST", body: { username, password } });
    await login(username, password);
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
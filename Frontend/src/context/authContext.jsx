import { createContext, useContext, useState, useEffect } from "react";
import api from "../../services/api.js";
const AuthContext = createContext(null);
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth should be used in AuthProvider only");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({})
  useEffect(() => {
    const restoreUser = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          return;
        }
        const res = await api.get("/auth/me");
        const details = res.data
        setUser(details);
      } catch (error) {
        console.log("Server Error!")
      }
    }
    restoreUser()
  }, [])
  const register = async (name, email, password) => {
    const res = await api.post("/auth/register", {
      name,
      email,
      password,
    });
    return res;
  }
  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password })
    const { token, user } = res.data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user))
    setUser(user)
    return res;
  }
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };
  const value = {
    register, login, user, logout
  }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

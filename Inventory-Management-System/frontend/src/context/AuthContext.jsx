import { createContext, useContext, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem("user");
        return stored ? JSON.parse(stored) : null;
    });
    const [token, setToken] = useState(() => localStorage.getItem("token"));

    const login = async (email, password) => {
        const response = await api.post("/auth/login", { email, password });
        const { token, user } = response.data;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setToken(token);
        setUser(user);

        return user;
    };

    const register = async (name, email, password) => {
        const response = await api.post("/auth/register", { name, email, password });
        return response.data;
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
    };

    const value = {
        user,
        token,
        isAuthenticated: !!token,
        login,
        register,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}
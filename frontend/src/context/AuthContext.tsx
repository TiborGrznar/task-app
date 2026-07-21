import api from "../api/axios";
import { useState } from "react";
import { AuthContext } from "./AuthContextInstance";

/**
 * Provides authentication state (token, email) and auth actions (login,
 * register, logout) to the whole app. Wraps the app in main.tsx so any
 * component can access it via useAuth().
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {

    // Initialize from localStorage so a page refresh doesn't log the user out
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
    const [email, setEmail] = useState<string | null>(localStorage.getItem("email"));

    // Authenticates against the backend and persists the token/email so the
    // user stays logged in across page reloads
    const login = async (email: string, password: string) => {
        const res = await api.post("/auth/login", { email, password });

        setToken(res.data.token);
        setEmail(res.data.email);

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("email", res.data.email);
    };

    // Just creates the account — doesn't log the user in automatically
    const register = async (email: string, password: string, name: string) => {
        await api.post("/auth/register", { email, password, name });
    };

    const logout = () => {
        setToken(null);
        setEmail(null);

        localStorage.removeItem("token");
        localStorage.removeItem("email");
    };

    return (
        <AuthContext.Provider value={{ token, email, login, register, logout, }}>
            {children}
        </AuthContext.Provider>
    );
}
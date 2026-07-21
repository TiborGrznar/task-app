import { createContext } from "react";

interface AuthContextType {
    token: string | null;
    email: string | null;

    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, name: string) => Promise<void>;
    logout: () => void;
};


export const AuthContext = createContext<AuthContextType | undefined>(undefined);

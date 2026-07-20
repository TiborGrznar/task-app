import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export function PrivateRoute({ children }: { children: React.ReactNode}) {

    const { token } = useAuth();

    if (!token) {
        return<Navigate to="/login" replace/>;
    }

    return children;
}
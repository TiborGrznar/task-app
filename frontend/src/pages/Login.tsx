import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import axios from "axios";
import AuthLayout from "../components/AuthLayout";

/**
 * Login page. Submits credentials via AuthContext's login(), which stores
 * the JWT on success. On failure, shows the backend's error message (or a
 * generic one for network/unexpected errors) instead of crashing.
 */
function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    
    
    const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");

        try {
            await login(email, password);
            navigate("/tasks");
        } catch (err) {
            
            // Only trust err.response.data.message if the backend actually responded
            // (e.g. 401 for bad credentials). Anything else (network down, etc.)
            // falls back to a generic message.
            if (axios.isAxiosError(err) && err.response) {
                setError(err.response.data.message);
            } else {
                setError("Something went wrong. Please try again.")
            }
        }
    };
    
    return (
        <AuthLayout>
            <form onSubmit={handleSubmit} className="space-y-4">
                <h1 className="text-2xl font-semibold text-white text-center">Login</h1>
                <input
                    type="email"
                    value={email}
                    placeholder="Email"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
                    className="w-full px-3 py-2 bg-neutral-900 text-white border border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-neutral-500"
                />
                <input
                    type="password"
                    value={password}
                    placeholder="Password"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
                    className="w-full px-3 py-2 bg-neutral-900 text-white border border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-neutral-500"
                />
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <button type="submit" className="w-full bg-emerald-600 text-white py-2 rounded-md font-medium hover:bg-emerald-700 transition-colors cursor-pointer">
                    Login
                </button>
                <p className="text-sm text-neutral-400 text-center">
                    Don't have an account? <Link to="/register" className="text-emerald-400 hover:underline">Register</Link>
                </p>
            </form>
        </AuthLayout>
    );
}

export default Login;
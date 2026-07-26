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
            <h1 className="text-2xl font-semibold text-gray-900 text-center">Login</h1>
            <input
                type="email"
                value={email}
                placeholder="Email"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
                type="password"
                value={password}
                placeholder="Password"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            />
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition-colors cursor-pointer"
            >
                Login
            </button>
            <p className="text-sm text-gray-600 text-center">
                Don't have an account? <Link to="/register" className="text-blue-600 hover:underline cursor-pointer">Register</Link>
            </p>
        </form>
    </AuthLayout>
);
}

export default Login;
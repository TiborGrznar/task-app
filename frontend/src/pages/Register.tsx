import React, { useState } from "react";
import { useAuth } from "../context/useAuth";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";

/**
 * Registration page. Creates a new account via AuthContext's register()
 * (doesn't log the user in automatically — see AuthService.register on the
 * backend). On success, shows a confirmation and redirects to /login after
 * a short delay so the user has time to read it.
 */
function Register() {
    const { register } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [success, setSuccess] = useState(false);
    
    
        const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");

        try {
            await register(email, password, name);
            setSuccess(true);
            setTimeout(() => navigate("/login"), 1500);
        } catch (err) {
            // Trust the backend's message when it responded,
            // otherwise fall back to a generic one (e.g. backend unreachable)
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
                <h1 className="text-2xl font-semibold text-gray-900 text-center">Register</h1>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input 
                    type="text" 
                    value={name}
                    placeholder="Name"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setName(event.target.value)} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
                {success && <p className="text-green-600 text-sm">Account created! Redirecting to login...</p>}
                {error && <p className="text-red-600 text-sm">{error}</p>}
                <button 
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition-colors cursor-pointer"
                >
                    Register
                </button>
                <p className="text-sm text-gray-600 text-center">
                    Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
                </p>
            </form>
        </AuthLayout>
    );
}

export default Register;
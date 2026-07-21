import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import axios from "axios";

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
        <form onSubmit={handleSubmit}>
            <input
                type="email"
                value={email}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)} 
            />
            <input 
                type="password" 
                value={password}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
            />
            {error && <p>{error}</p>}
            <button type="submit">Login</button>
            <p>Don't have an account? <Link to="/register">Register</Link></p>
        </form>
    );
}

export default Login;
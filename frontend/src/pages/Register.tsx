import React, { useState } from "react";
import { useAuth } from "../context/useAuth";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

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
            <input 
                type="text" 
                value={name}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setName(event.target.value)} 
                />
            {success && <p>Account created! Redirecting to login...</p>}
            {error && <p>{error}</p>}
            <button type="submit">Register</button>
            <p>Already have an account? <Link to="/login">Login</Link></p>
        </form>
    );

}

export default Register;
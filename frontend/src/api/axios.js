import axios from "axios";

/**
 * Pre-configured axios instance for talking to the backend API. Automatically
 * attaches the JWT token (if present) to every outgoing request, so individual
 * components never have to do it manually.
 */
const api = axios.create({
    baseURL: "http://localhost:8081/api",
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if(token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
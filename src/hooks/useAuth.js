import { useState, useEffect } from "react";
import api from "../lib/axios";

export function useAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        checkAuth();

        // Listen for storage changes (logout in another tab)
        window.addEventListener('storage', checkAuth);
        return () => window.removeEventListener('storage', checkAuth);
    }, []);

    async function checkAuth() {
        const token = localStorage.getItem("online_marketplace_access_token");
        const userDataString = localStorage.getItem("online_marketplace_user");

        if (!token) {
            setLoading(false);
            setIsAuthenticated(false);
            setUser(null);
            return;
        }

        // Token exists, parse user data from localStorage
        try {
            const userData = userDataString ? JSON.parse(userDataString) : null;
            setUser(userData);
            setIsAuthenticated(true);
            setLoading(false);
        } catch (error) {
            // If parsing fails, clear everything
            console.error("Failed to parse user data:", error);
            localStorage.removeItem("online_marketplace_access_token");
            localStorage.removeItem("online_marketplace_user");
            setIsAuthenticated(false);
            setUser(null);
            setLoading(false);
        }
    }

    function logout() {
        // Hapus semua item di localStorage
        localStorage.clear();
        setUser(null);
        setIsAuthenticated(false);
    }

    return {
        user,
        loading,
        isAuthenticated,
        logout,
        refreshAuth: checkAuth,
    };
}

import api from "../services/api";

/*
========================================
Cookie Authentication Helpers
========================================
*/

// Check if user is authenticated
export const isAuthenticated = async () => {
    try {
        await api.get("/auth/me", {
            withCredentials: true,
        });

        return true;
    } catch {
        return false;
    }
};

// Get current user
export const getUser = async () => {
    try {
        const { data } = await api.get("/auth/me", {
            withCredentials: true,
        });

        return data.data;
    } catch {
        return null;
    }
};

// Logout
export const logout = async () => {
    try {
        await api.post(
            "/auth/logout",
            {},
            {
                withCredentials: true,
            }
        );
    } catch (error) {
        console.error(error);
    }
};
import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    const getCurrentUser = async () => {

        try {

            const { data } = await api.get("/auth/me");

            setUser(data.data);

        } catch {

            setUser(null);

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {

        getCurrentUser();

    }, []);

    const logout = async () => {

        await api.post("/auth/logout");

        setUser(null);

    };

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                loading,
                logout,
                getCurrentUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () =>
    useContext(AuthContext);
import { useState, type ReactNode } from "react";
import type { User } from "../types";
import { useNavigate } from "react-router-dom";
import api from "../config/api";
import toast from "react-hot-toast";
import axios from "axios";
import { AuthContext } from "./useAuth";

export function AuthProvider({ children }: { children: ReactNode }) {

    const navigate = useNavigate();

    const [user, setUser] = useState<User | null>(() => {
        const savedUser = localStorage.getItem("auth_user");

        if (savedUser) {
            return JSON.parse(savedUser) as User;
        }

        return null;
    });

    const [token, setToken] = useState<string | null>(() => {
        return localStorage.getItem("auth_token");
    });

    const [loading] = useState(false);

    const login = async (email: string, password: string) => {
        try {
            const { data } = await api.post("/auth/login", {
                email,
                password
            });

            setUser(data.user);
            setToken(data.token);

            localStorage.setItem("auth_token", data.token);
            localStorage.setItem(
                "auth_user",
                JSON.stringify(data.user)
            );

            toast.success("Login successful");
            navigate("/");
        } catch (error: unknown) {
            const message = axios.isAxiosError(error)
                ? error.response?.data?.message || error.message
                : null;

            toast.error(message || "Login failed. Please try again.");
        }
    };

    const register = async (
        name: string,
        email: string,
        password: string
    ) => {
        try {
            const { data } = await api.post("/auth/register", {
                name,
                email,
                password
            });

            setUser(data.user);
            setToken(data.token);

            localStorage.setItem("auth_token", data.token);
            localStorage.setItem(
                "auth_user",
                JSON.stringify(data.user)
            );

            toast.success("Registration successful");
            navigate("/");
        } catch (error: unknown) {
            const message = axios.isAxiosError(error)
                ? error.response?.data?.message || error.message
                : null;

            toast.error(message || "Registration failed. Please try again.");
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);

        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
    };

    const updateUser = (userData: Partial<User>) => {
        if (user) {
            const updated = { ...user, ...userData };

            setUser(updated);

            localStorage.setItem(
                "auth_user",
                JSON.stringify(updated)
            );
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                login,
                register,
                logout,
                updateUser
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}


import React, { useState, useEffect } from "react";
import AuthContext from "./AuthContext";
import {jwtDecode} from "jwt-decode";

const AuthState = (props) => {
    const host = "http://localhost:5000"; // Replace with your backend URL
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [error, setError] = useState(null);
 const [loading, setLoading] = useState(true); // Loading state
    // Load user from localStorage on mount
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        console.log(storedToken);
        
        if (storedToken) {
            try {
                const decoded = jwtDecode(storedToken);
                setUser({
                    id: decoded.user.id,
                    isAdmin: decoded.user.isAdmin,
                });
                setToken(storedToken);
            } catch (err) {
                console.error("Invalid token:", err);
                // localStorage.removeItem("token");
            }
        }
        setLoading(false); 
    }, []);

    // Login function
    const login = async (email, password, isAdmin = false) => {
        try {
            const endpoint = isAdmin ? "/api/admin/login" : "/api/auth/login";
            const response = await fetch(`${host}${endpoint}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                const { authtoken } = data;
                console.log(authtoken);
                
                localStorage.setItem("token", authtoken);
                const decoded = jwtDecode(authtoken);
                setUser({
                    id: decoded.user.id,
                    isAdmin: decoded.user.isAdmin,
                });
                setToken(authtoken);
                console.log(authtoken);
                setError(null);
                return { success: true ,'authtoken':authtoken};
            } else {
                setError(data.error || "Login failed");
                return { success: false };
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("Login failed due to server error.");
            return { success: false };
        }
    };

    // Register function
    const register = async (name, email, password, isAdmin = false) => {
        try {
            const endpoint = isAdmin ? "/api/admin/register" : "/api/auth/createuser";
            console.log(endpoint);
            
            const response = await fetch(`${host}${endpoint}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token":localStorage.getItem("token")
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                const { authtoken } = data;
                localStorage.setItem("token", authtoken);
                const decoded = jwtDecode(authtoken);
                setUser({
                    id: decoded.user.id,
                    isAdmin: decoded.user.isAdmin,
                });
                setToken(authtoken);
                setError(null);
                return { success: true,'auth-token':authtoken };
            } else {
                setError(data.error || "Registration failed");
                return { success: false };
            }
        } catch (err) {
            console.error("Registration error:", err);
            setError("Registration failed due to server error.");
            return { success: false };
        }
    };

    // Logout function
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
        setError(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, error,loading }}>
            {props.children}
        </AuthContext.Provider>
    );
};

export default AuthState;

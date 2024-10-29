import React from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext"; // Ensure correct import path

export const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    // const location = useLocation(); 
    // const handleLogout = () => {
    //     logout(); 
    //     setTimeout(() => {
    //         navigate("/login", { state: { message: "Logged out successfully!" } });
    //     }, 100);
    // }
    const location = useLocation();
    const handleLogout = () => {
        logout();
        if (user?.isAdmin) {
            navigate("/admin-login");
        } else {
            navigate("/login");
        }
    };

    const isAdminPage = location.pathname === "/admin-login" || location.pathname === "/admin-register";

    return (
        <nav className="bg-gray-800 p-3">
            <div className="container mx-auto flex justify-between items-center">
                <Link className="text-white text-lg mr-10" to="/">
                    Navbar
                </Link>
                <div className="flex space-x-6">
                    {!user?.isAdmin && (
                        <Link className="text-white hover:underline" to="/">
                            Home
                        </Link>
                    )}
                    <Link className="text-white hover:underline" to="/about">
                        About
                    </Link>
                    <Link className="text-white hover:underline" to="/vote">
                        Vote
                    </Link>
                    <Link className="text-white hover:underline" to="/announcements">
                        Announcements
                    </Link>
                    {user?.isAdmin && (
                        <Link className="text-white hover:underline" to="/admin-dashboard">
                            Dashboard
                        </Link>
                    )}
                </div>

                <div className="ml-auto space-x-2">
                    {!user && !isAdminPage ? (
                        <>
                            <Link className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600" to="/login" role="button">
                                Login
                            </Link>
                            <Link className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600" to="/signup" role="button">
                                Signup
                            </Link>
                        </>
                    ) : (
                        <>
                            {!isAdminPage && (
                                <button onClick={handleLogout} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                                    Logout
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};
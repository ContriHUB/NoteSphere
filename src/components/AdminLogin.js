import React, { useState, useContext } from 'react';
import AuthContext from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';

const AdminLogin = (props) => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await login(form.email, form.password, true); 
        if (res.success) {
            localStorage.setItem('token', res.authtoken);
            props.showAlert("Account successfully logged in", "success");
            navigate('/admin-dashboard');
        } else {
            props.showAlert("Invalid credentials", "danger");
            setError(res.message);
        }
    };

    return (
        <div className="max-w-md mx-auto my-12 p-6 border border-gray-300 rounded-lg bg-gray-100">
            <h2 className="text-2xl font-semibold text-center mb-4">Admin Login</h2>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="flex flex-col">
                <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                    className="p-3 my-2 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Password"
                    required
                    className="p-3 my-2 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    type="submit"
                    className="py-3 px-6 mt-4 text-white bg-gray-800 rounded-md hover:bg-gray-900 focus:outline-none"
                >
                    Login
                </button>
            </form>
        </div>
    );
};

export default AdminLogin;

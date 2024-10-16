import React, { useState, useContext } from 'react';
import AuthContext from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';

const AdminRegister = (props) => {
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password.length < 5) {
            setError('Password must be at least 5 characters');
            return;
        }
        console.log(form.name, form.email, form.password, true);
        
        const res = await register(form.name, form.email, form.password, true); // isAdmin = true
        if (res.success) {
            localStorage.setItem('token', res.authtoken);
            props.showAlert("Account successfully created", "success");
            navigate('/admin-dashboard');
        } else {
            setError(res.message);
        }
    };

    return (
        <div className="max-w-md mx-auto my-12 p-6 border border-gray-300 rounded-lg bg-gray-100">
            <h2 className="text-2xl font-semibold text-center mb-4">Admin Register</h2>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="flex flex-col">
                <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Name"
                    required
                    className="p-3 my-2 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
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
                    Register
                </button>
            </form>
        </div>
    );
};

export default AdminRegister;

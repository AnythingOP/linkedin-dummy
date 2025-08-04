import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

const RegisterPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', bio: '' });
    const navigate = useNavigate();

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_URL}/api/auth/register`, formData);
            localStorage.setItem('token', res.data.token);
            navigate('/');
        } catch (err) {
            console.error(err.response.data);
            alert('Registration failed. User may already exist.');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <h1 className="text-3xl font-bold mb-4 text-center">Register</h1>
            <form onSubmit={onSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" type="text" name="name" value={formData.name} onChange={onChange} required />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" type="email" name="email" value={formData.email} onChange={onChange} required />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" type="password" name="password" minLength="6" value={formData.password} onChange={onChange} required />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Bio</label>
                    <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" name="bio" value={formData.bio} onChange={onChange}></textarea>
                </div>
                <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Register</button>
            </form>
        </div>
    );
};

export default RegisterPage;
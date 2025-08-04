import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    let userId = null;

    if (token) {
        try {
            const decodedToken = jwtDecode(token);
            if (decodedToken.exp * 1000 > Date.now()) {
                userId = decodedToken.user.id;
            } else {
                localStorage.removeItem('token');
            }
        } catch (error) {
            console.error("Invalid token:", error);
            localStorage.removeItem('token');
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <nav className="bg-gray-800 p-4 text-white dark:bg-gray-900">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-xl font-bold">MiniLinkedIn</Link>
                <div className="flex items-center space-x-4">
                    <ThemeToggle />
                    <Link to="/" className="hover:text-gray-300">Home</Link>
                    {userId ? (
                        <>
                            <Link to={`/profile/${userId}`} className="hover:text-gray-300">My Profile</Link>
                            <button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="hover:text-gray-300">Login</Link>
                            <Link to="/register" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
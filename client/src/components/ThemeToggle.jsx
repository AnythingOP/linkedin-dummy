import React, { useState, useEffect } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';

const ThemeToggle = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const handleThemeSwitch = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <button onClick={handleThemeSwitch} className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 focus:outline-none">
            {theme === 'dark' ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-white" />}
        </button>
    );
};

export default ThemeToggle;
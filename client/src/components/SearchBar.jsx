import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const debouncedSearch = useCallback(
        debounce(async (searchQuery) => {
            if (searchQuery.trim() === '') {
                setResults([]);
                return;
            }
            setLoading(true);
            try {
                const res = await axios.get(`${API_URL}/api/users/search?q=${searchQuery}`);
                setResults(res.data);
            } catch (err) {
                console.error("Search failed", err);
            } finally {
                setLoading(false);
            }
        }, 300),
        []
    );

    const handleChange = (e) => {
        const newQuery = e.target.value;
        setQuery(newQuery);
        debouncedSearch(newQuery);
    };

    return (
        <div className="relative">
            <input
                type="text"
                value={query}
                onChange={handleChange}
                onBlur={() => setTimeout(() => setResults([]), 200)} // Hide results on blur
                placeholder="Search for users..."
                className="bg-gray-700 text-white rounded-md py-2 px-4 focus:outline-none w-64"
            />
            {results.length > 0 && (
                <div className="absolute top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10">
                    <ul>
                        {results.map(user => (
                            <li key={user._id}>
                                <Link
                                    to={`/profile/${user._id}`}
                                    className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    <img src={user.profilePicture || `https://i.pravatar.cc/150?u=${user._id}`} alt={user.name} className="w-8 h-8 rounded-full mr-2"/>
                                    <span className="text-gray-900 dark:text-gray-200">{user.name}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SearchBar;
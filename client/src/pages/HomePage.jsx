import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import PostCard from '../components/PostCard';
import { useNavigate } from 'react-router-dom';

// We are hardcoding the API_URL for the final test to bypass Vercel's environment variables.
// const API_URL = import.meta.env.VITE_API_URL;
const API_URL = 'https://ciaan-challenge-api.onrender.com';

const HomePage = () => {
    const [posts, setPosts] = useState([]);
    const [text, setText] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    // This is the variable we will display on the screen to debug.
    const apiUrlForDebug = import.meta.env.VITE_API_URL;

    const fetchPosts = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/posts`);
            setPosts(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handlePostSubmit = async (e) => {
        e.preventDefault();
        if (!token) {
            navigate('/login');
            return;
        }
        try {
            // The backend gets the author's ID from the token, so we only need to send the text.
            const newPostData = { text };
            
            // We must include the token in the Authorization header for the protected route.
            await axios.post(`${API_URL}/api/posts`, newPostData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setText('');
            fetchPosts(); // Refresh posts
        } catch (err) {
            console.error(err);
            if (err.response && err.response.status === 401) {
                alert("Your session has expired. Please log in again.");
                navigate('/login');
            }
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">Home Feed</h1>

            {/* This is the debugging block. It shows us what Vercel thinks the URL is. */}
            <div className="p-4 mb-4 bg-red-200 text-red-800 border border-red-800 rounded">
                <p className="font-bold">DEBUGGING INFO:</p>
                <p>The VITE_API_URL is: "{apiUrlForDebug}"</p>
            </div>

            {token && (
                <form onSubmit={handlePostSubmit} className="mb-6 bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md">
                    <textarea
                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                        rows="3"
                        placeholder="What's on your mind?"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        required
                    ></textarea>
                    <button type="submit" className="mt-2 bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">Post</button>
                </form>
            )}
            <div className="space-y-4">
                {posts.map(post => (
                    <PostCard key={post._id} post={post} />
                ))}
            </div>
        </div>
    );
};

export default HomePage;
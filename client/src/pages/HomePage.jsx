import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PostCard from '../components/PostCard';
import { useNavigate } from 'react-router-dom';

// This now uses the Vercel environment variable
const API_URL = import.meta.env.VITE_API_URL;

const HomePage = () => {
    const [posts, setPosts] = useState([]);
    const [text, setText] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

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
            const newPostData = { text };
            
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
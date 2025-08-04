import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import PostCard from '../components/PostCard';
import { useNavigate } from 'react-router-dom';

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
            const userId = jwtDecode(token).user.id;
            const newPost = { text, authorId: userId };
            await axios.post(`${API_URL}/api/posts`, newPost, {
                headers: { 'Content-Type': 'application/json' }
            });
            setText('');
            fetchPosts(); // Refresh posts
        } catch (err) {
            console.error(err);
            if (err.response && err.response.status === 401) navigate('/login');
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">Home Feed</h1>
            {token && (
                <form onSubmit={handlePostSubmit} className="mb-6 bg-white p-4 rounded-lg shadow-md">
                    <textarea
                        className="w-full p-2 border rounded"
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
                {posts.map(post => <PostCard key={post._id} post={post} />)}
            </div>
        </div>
    );
};

export default HomePage;
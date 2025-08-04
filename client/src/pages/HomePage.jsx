import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaPlus } from 'react-icons/fa';
import PostCard from '../components/PostCard';
import PostSkeleton from '../components/PostSkeleton';
import CreatePostModal from '../components/CreatePostModal';

const API_URL = import.meta.env.VITE_API_URL;

const HomePage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const token = localStorage.getItem('token');

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/api/posts`);
            setPosts(res.data);
        } catch (err) {
            console.error(err);
            toast.error("Could not fetch posts.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handlePostCreated = () => {
        setIsModalOpen(false);
        fetchPosts(); // Refresh the feed after a new post is created
    };

    return (
        <>
            {token && (
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="fixed bottom-10 right-10 bg-blue-500 hover:bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg focus:outline-none z-40"
                    aria-label="Create new post"
                >
                    <FaPlus size={24} />
                </button>
            )}

            {isModalOpen && <CreatePostModal onClose={() => setIsModalOpen(false)} onPostCreated={handlePostCreated} />}

            <div>
                <h1 className="text-3xl font-bold mb-4">Home Feed</h1>
                <div className="space-y-4">
                    {loading ? (
                        [...Array(3)].map((_, i) => <PostSkeleton key={i} />)
                    ) : posts.length > 0 ? (
                        posts.map(post => <PostCard key={post._id} post={post} />)
                    ) : (
                        <div className="text-center text-gray-500 dark:text-gray-400 mt-16 p-8 bg-white dark:bg-gray-900 rounded-lg shadow-md">
                            <h2 className="text-2xl font-semibold mb-2">It's quiet in here...</h2>
                            <p>No posts have been made yet. Log in or register to be the first to share something!</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default HomePage;
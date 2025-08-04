import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import PostCard from '../components/PostCard';

const API_URL = import.meta.env.VITE_API_URL;

const ProfilePage = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                setLoading(true);
                // Fetch user profile
                const userRes = await axios.get(`${API_URL}/api/users/${userId}`);
                setUser(userRes.data);

                // Fetch user's posts
                const postsRes = await axios.get(`${API_URL}/api/posts/user/${userId}`);
                setPosts(postsRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchProfileData();
        }
    }, [userId]);

    if (loading) return <p className="text-center mt-8">Loading...</p>;
    if (!user) return <p className="text-center mt-8 text-red-500">User not found.</p>;

    return (
        <div>
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h1 className="text-3xl font-bold">{user.name}</h1>
                <p className="text-gray-600">{user.email}</p>
                <p className="mt-4 text-gray-800">{user.bio || 'No bio provided.'}</p>
            </div>
            
            <h2 className="text-2xl font-bold mb-4">Posts by {user.name}</h2>
            <div className="space-y-4">
                {posts.length > 0 ? (
                    posts.map(post => <PostCard key={post._id} post={post} />)
                ) : (
                    <p>This user has not made any posts yet.</p>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
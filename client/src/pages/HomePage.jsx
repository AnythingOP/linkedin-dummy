import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import PostCard from '../components/PostCard';
import PostSkeleton from '../components/PostSkeleton';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;
const CLOUDINARY_UPLOAD_PRESET = 'ciaan_preset';
const CLOUDINARY_CLOUD_NAME = 'your_cloud_name';

const HomePage = () => {
    const [posts, setPosts] = useState([]);
    const [text, setText] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
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

    const handlePostSubmit = async (e) => {
        e.preventDefault();
        if (!token) {
            navigate('/login');
            return;
        }

        if (text.trim() === '' && !image) {
            return toast.error("Post cannot be empty!");
        }

        const toastId = toast.loading('Creating post...');
        let imageUrl = '';

        try {
            if (image) {
                const formData = new FormData();
                formData.append('file', image);
                formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
                const res = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, formData);
                imageUrl = res.data.secure_url;
            }

            const newPostData = { text, imageUrl };
            await axios.post(`${API_URL}/api/posts`, newPostData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success('Post created successfully!', { id: toastId });
            setText('');
            setImage(null);
            document.getElementById('image-upload-input').value = null; // Clear file input
            fetchPosts();
        } catch (err) {
            toast.error('Failed to create post.', { id: toastId });
            console.error(err);
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
                    ></textarea>
                    <div className="flex justify-between items-center mt-2">
                        <input id="image-upload-input" type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
                        <button type="submit" className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">Post</button>
                    </div>
                </form>
            )}
            <div className="space-y-4">
                {loading ? (
                    [...Array(3)].map((_, i) => <PostSkeleton key={i} />)
                ) : (
                    posts.map(post => <PostCard key={post._id} post={post} />)
                )}
            </div>
        </div>
    );
};

export default HomePage;
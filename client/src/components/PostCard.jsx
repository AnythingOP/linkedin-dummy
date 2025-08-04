import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import toast from 'react-hot-toast';
import { FaHeart, FaRegHeart, FaCommentAlt } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL;

const PostCard = ({ post }) => {
    const token = localStorage.getItem('token');
    const userId = token ? jwtDecode(token).user.id : null;

    const [likes, setLikes] = useState(post.likes);
    const [comments, setComments] = useState(post.comments || []);
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState('');

    const isLiked = likes.includes(userId);

    const handleLike = async () => {
        if (!token) return toast.error("You must be logged in to like posts.");
        
        // Optimistic update
        const originalLikes = [...likes];
        const newLikes = isLiked 
            ? likes.filter(id => id !== userId) 
            : [...likes, userId];
        setLikes(newLikes);

        try {
            await axios.post(`${API_URL}/api/posts/${post._id}/like`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (err) {
            setLikes(originalLikes); // Revert on error
            toast.error("Failed to update like.");
            console.error(err);
        }
    };
    
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        
        try {
            const res = await axios.post(`${API_URL}/api/posts/${post._id}/comments`, 
                { text: commentText },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setComments([...comments, res.data]);
            setCommentText('');
            toast.success("Comment added!");
        } catch (err) {
            toast.error("Failed to add comment.");
            console.error(err);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg p-4 mb-4">
            <div className="flex items-center mb-2">
                <img src={post.author.profilePicture || `https://i.pravatar.cc/150?u=${post.author._id}`} alt={post.author.name} className="w-10 h-10 rounded-full mr-3"/>
                <div>
                    <Link to={`/profile/${post.author._id}`} className="font-bold text-blue-600 hover:underline">{post.author.name}</Link>
                    <p className="text-gray-500 text-sm">{new Date(post.createdAt).toLocaleString()}</p>
                </div>
            </div>

            <p className="text-gray-800 dark:text-gray-300 my-4">{post.text}</p>
            
            {post.imageUrl && (
                <img src={post.imageUrl} alt="Post content" className="rounded-lg w-full max-h-96 object-cover my-4"/>
            )}

            <div className="flex justify-between items-center text-gray-500 border-t dark:border-gray-700 pt-2">
                <button onClick={handleLike} className="flex items-center space-x-2 hover:text-red-500">
                    {isLiked ? <FaHeart className="text-red-500"/> : <FaRegHeart />}
                    <span>{likes.length} Likes</span>
                </button>
                <button onClick={() => setShowComments(!showComments)} className="flex items-center space-x-2 hover:text-blue-500">
                    <FaCommentAlt />
                    <span>{comments.length} Comments</span>
                </button>
            </div>
            
            {showComments && (
                <div className="mt-4 pt-4 border-t dark:border-gray-700">
                    {comments.map(comment => (
                        <div key={comment._id} className="flex items-start space-x-3 mb-2">
                            <img src={comment.author.profilePicture || `https://i.pravatar.cc/150?u=${comment.author._id}`} alt={comment.author.name} className="w-8 h-8 rounded-full"/>
                            <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-2">
                                <Link to={`/profile/${comment.author._id}`} className="font-semibold text-sm">{comment.author.name}</Link>
                                <p className="text-sm">{comment.text}</p>
                            </div>
                        </div>
                    ))}
                    {token && (
                        <form onSubmit={handleCommentSubmit} className="flex items-center space-x-2 mt-4">
                            <input type="text" value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Write a comment..." className="flex-1 p-2 border rounded-full dark:bg-gray-700 dark:border-gray-600"/>
                            <button type="submit" className="bg-blue-500 text-white font-bold py-2 px-4 rounded-full">Send</button>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
};

export default PostCard;
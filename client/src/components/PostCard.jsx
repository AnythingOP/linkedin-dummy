import React from 'react';
import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
    return (
        <div className="bg-white shadow-md rounded-lg p-4 mb-4">
            <div className="flex items-center mb-2">
                <div className="font-bold">
                    <Link to={`/profile/${post.author._id}`} className="text-blue-600 hover:underline">
                        {post.author.name}
                    </Link>
                </div>
                <span className="text-gray-500 text-sm ml-auto">
                    {new Date(post.createdAt).toLocaleString()}
                </span>
            </div>
            <p className="text-gray-800">{post.text}</p>
        </div>
    );
};
export default PostCard;
import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;
const CLOUDINARY_UPLOAD_PRESET = 'ciaan_preset';
const CLOUDINARY_CLOUD_NAME = 'dbd736mdi';

const CreatePostModal = ({ onClose, onPostCreated }) => {
    const [text, setText] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const token = localStorage.getItem('token');

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
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
            onPostCreated(); // This tells the HomePage to refresh
        } catch (err) {
            toast.error('Failed to create post.', { id: toastId });
            console.error(err);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-lg relative">
                <h2 className="text-2xl font-bold mb-4 text-center">Create a Post</h2>
                <button onClick={onClose} className="absolute top-4 right-4 text-2xl font-bold hover:text-red-500">&times;</button>
                <form onSubmit={handleSubmit}>
                    <textarea
                        className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="5"
                        placeholder="What's on your mind?"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    ></textarea>
                    
                    {imagePreview && <img src={imagePreview} alt="Preview" className="mt-4 rounded-lg max-h-60 w-auto mx-auto"/>}
                    
                    <div className="flex justify-between items-center mt-4">
                        <label htmlFor="image-upload-modal" className="cursor-pointer text-blue-500 hover:underline">
                            Add a photo
                            <input id="image-upload-modal" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                        </label>
                        <button type="submit" className="px-6 py-2 rounded-full bg-blue-500 text-white font-bold hover:bg-blue-600">Post</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePostModal;
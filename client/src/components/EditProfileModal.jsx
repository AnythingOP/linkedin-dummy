import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

const EditProfileModal = ({ user, onClose, onProfileUpdate }) => {
    const [name, setName] = useState(user.name);
    const [bio, setBio] = useState(user.bio);
    const token = localStorage.getItem('token');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const toastId = toast.loading('Updating profile...');
        try {
            const res = await axios.put(
                `${API_URL}/api/users/profile`,
                { name, bio },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            onProfileUpdate(res.data);
            toast.success('Profile updated successfully!', { id: toastId });
            onClose();
        } catch (err) {
            toast.error('Failed to update profile.', { id: toastId });
            console.error("Failed to update profile", err);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-1 font-semibold dark:text-gray-300">Name</label>
                        <input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" 
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1 font-semibold dark:text-gray-300">Bio</label>
                        <textarea 
                            value={bio} 
                            onChange={(e) => setBio(e.target.value)} 
                            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" 
                            rows="4"
                        ></textarea>
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-600 hover:bg-gray-400">Cancel</button>
                        <button type="submit" className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfileModal;
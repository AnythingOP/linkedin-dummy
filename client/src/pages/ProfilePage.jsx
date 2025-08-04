import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import PostCard from '../components/PostCard';
import { jwtDecode } from 'jwt-decode';
import { FaCamera } from 'react-icons/fa';
import EditProfileModal from '../components/EditProfileModal';
import ChangePasswordModal from '../components/ChangePasswordModal';

const API_URL = import.meta.env.VITE_API_URL;
const CLOUDINARY_UPLOAD_PRESET = 'ciaan_preset'; // Your preset name
const CLOUDINARY_CLOUD_NAME = 'dbd736mdi';   // Your cloud name

const ProfilePage = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    const token = localStorage.getItem('token');
    const loggedInUserId = token ? jwtDecode(token).user.id : null;
    const isOwnProfile = userId === loggedInUserId;

    // This function fetches all the data from the backend
    const fetchProfileData = async () => {
        setLoading(true);
        try {
            const userRes = await axios.get(`${API_URL}/api/users/${userId}`);
            setUser(userRes.data);
            const postsRes = await axios.get(`${API_URL}/api/posts/user/${userId}`);
            setPosts(postsRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // This hook runs when the component loads
    useEffect(() => {
        if (userId) {
            fetchProfileData(); // This line starts the data fetching
        }
    }, [userId]);
    
    const handlePictureUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

        try {
            const res = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, formData);
            const profilePictureUrl = res.data.secure_url;

            await axios.put(`${API_URL}/api/users/profile`, 
                { profilePicture: profilePictureUrl },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchProfileData();
        } catch (err) {
            console.error("Image upload failed", err);
            alert("Image upload failed. Please check your Cloudinary settings and try again.");
        }
    };

    const handleProfileUpdate = (updatedUser) => {
        setUser(updatedUser);
    };

    if (loading) return <p className="text-center mt-8">Loading...</p>;
    if (!user) return <p className="text-center mt-8 text-red-500">User not found.</p>;

    return (
        <>
            {showEditModal && <EditProfileModal user={user} onClose={() => setShowEditModal(false)} onProfileUpdate={handleProfileUpdate} />}
            {showPasswordModal && <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />}
            
            <div>
                <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg p-6 mb-6">
                    <div className="flex items-center space-x-6">
                        <div className="relative">
                            <img src={user.profilePicture || `https://i.pravatar.cc/150?u=${user._id}`} alt={user.name} className="w-24 h-24 rounded-full object-cover border-4 border-gray-300 dark:border-gray-600" />
                            {isOwnProfile && (
                                <label htmlFor="pictureUpload" className="absolute -bottom-2 -right-2 bg-blue-500 p-2 rounded-full cursor-pointer hover:bg-blue-600">
                                    <FaCamera className="text-white" />
                                    <input id="pictureUpload" type="file" className="hidden" accept="image/*" onChange={handlePictureUpload} />
                                </label>
                            )}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">{user.name}</h1>
                            <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                        </div>
                    </div>
                    <p className="mt-4 text-gray-800 dark:text-gray-300">{user.bio}</p>
                    {isOwnProfile && (
                        <div className="mt-4 space-x-2">
                           <button onClick={() => setShowEditModal(true)} className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-700">Edit Profile</button>
                           <button onClick={() => setShowPasswordModal(true)} className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-700">Change Password</button>
                        </div>
                    )}
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
        </>
    );
};

export default ProfilePage;
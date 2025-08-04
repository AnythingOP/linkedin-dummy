import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// @desc    Get user profile by ID
// @route   GET /api/users/:id
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ msg: 'User not found' });
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Update user profile (name, bio, profile picture)
// @route   PUT /api/users/profile
export const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user) {
            user.name = req.body.name || user.name;
            user.bio = req.body.bio || user.bio;
            if (req.body.profilePicture) {
                user.profilePicture = req.body.profilePicture;
            }
            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                bio: updatedUser.bio,
                profilePicture: updatedUser.profilePicture,
            });
        } else {
            res.status(404).json({ msg: 'User not found' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Change user password
// @route   PUT /api/users/change-password
export const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });
        
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid current password' });

        user.password = newPassword; // The pre-save hook will hash it
        await user.save();
        
        res.json({ msg: 'Password updated successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Search for users by name
// @route   GET /api/users/search?q=...
export const searchUsers = async (req, res) => {
    const keyword = req.query.q
        ? {
              name: {
                  $regex: req.query.q,
                  $options: 'i', // case-insensitive
              },
          }
        : {};
    
    try {
        const users = await User.find(keyword).select('-password').limit(10);
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
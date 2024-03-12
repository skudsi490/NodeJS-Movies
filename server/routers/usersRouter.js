const express = require('express');
const User = require('../models/usersModel');
const router = express.Router();
const authenticate = require('../middleware/authenticate'); 

// Fetch user profile
router.get('/profile', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const { password, ...profileData } = user.toObject();
        res.json(profileData);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user profile', error: error.message });
    }
});

// Update user profile
router.put('/update', authenticate, async (req, res) => {
    try {
        const updates = req.body;
        const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        const { password, ...updatedProfileData } = updatedUser.toObject();
        res.json(updatedProfileData);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user profile', error: error.message });
    }
});



module.exports = router;

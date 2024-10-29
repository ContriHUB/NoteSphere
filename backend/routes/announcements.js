const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');
const adminAuth = require('../middleware/adminAuth');

// Create an announcement
router.post('/', adminAuth,  async (req, res) => {
    const { title, content } = req.body;
    try {
        const announcement = new Announcement({ title, content });
        await announcement.save();
        console.log("create announcement");
        
        
        // Emit the new announcement to all connected clients
        req.io.emit('announcement', announcement); // Emit here
        return res.status(201).json(announcement); // Ensure only one response is sent
    } catch (error) {
        return res.status(500).json({ message: 'Error creating announcement', error });
    }
});

// Get all announcements
router.get('/', async (req, res) => {
    try {
        const announcements = await Announcement.find().sort({ createdAt: -1 });
        return res.json(announcements); // Ensure only one response is sent
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching announcements', error });
    }
});

// Delete an announcement
router.delete('/:id', adminAuth, async (req, res) => {
    try {
        const announcementId = req.params.id;
        await Announcement.findByIdAndDelete(announcementId);
        
        // Emit the deletion event to all connected clients
        req.io.emit('deleteAnnouncement', announcementId);
        
        return res.status(200).json({ message: 'Announcement deleted successfully' }); // Ensure only one response is sent
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting announcement', error });
    }
});

module.exports = router;
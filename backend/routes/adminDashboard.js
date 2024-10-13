// routes/adminDashboard.js
const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const Notes = require('../models/Notes');
const User = require('../models/User');

// Route to get all notes
// GET /api/admin/notes
router.get('/notes', adminAuth, async (req, res) => {
    try {
        const notes = await Notes.find()
            .populate('user', 'name email') // Populate user details
            .sort({ date: -1 });// Sort by most recent first
            res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

router.get("/fetchimagenote/:id", adminAuth, async (req, res) => {
    try {
        const note = await Notes.findById(req.params.id);
        if (!note || !note.imageData) {
            return res.status(404).send("Image not found");
        }

        res.set('Content-Type', note.contentType);
        
        res.send(note.imageData);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
});

module.exports = router;

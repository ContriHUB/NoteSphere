const express = require('express');
const Poll = require("../models/Poll");
const router = express.Router();
const { body, validationResult } = require('express-validator');

router.post('/create', async (req, res) => {
    try {
        const { question, options, timer } = req.body;

        const expirationDate = new Date(Date.now() + timer * 3600000);

        const newPoll = new Poll({
            question,
            options, 
            expiration: expirationDate,
        });

        await newPoll.save();
        res.status(201).json({ message: 'Poll created successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create poll.' });
    }
});

router.post('/vote/:id', async (req, res) => {
    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ success: false, message: 'Poll not found' });

    if (new Date() > poll.expiration) {
        return res.status(400).json({ success: false, message: 'Poll has expired' });
    }

    const { optionId } = req.body;
    if (optionId < 0 || optionId >= poll.options.length) return res.status(400).json({ success: false, message: 'Invalid option' });

    poll.options[optionId].votes += 1;

    try {
        await poll.save();
        res.json({ success: true, message: 'Vote recorded successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error voting on poll', error: error.message });
    }
});

router.delete('/del/:id', async (req, res) => {
    //console.log("hi");
    const pollId = req.params.id;
    console.log(pollId);


    console.log(`Attempting to delete poll with ID: ${pollId}`);
    try {
        const deletedPoll = await Poll.findByIdAndDelete(pollId);
        console.log("Deleted Poll:", deletedPoll); 
        if (!deletedPoll) {
            return res.status(404).json({ message: 'Poll not found' });
        }
        res.status(200).json({ message: 'Poll deleted successfully' });
    } catch (error) {
        console.error("Error deleting poll:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/', async (req, res) => {
    try {
        const polls = await Poll.find();
        res.json(polls);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching polls', error: error.message });
    }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchUser");
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");
const multer = require('multer'); //for image storage
// Configure Multer storage (memory storage to get Buffer)
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            cb(new Error('Only image files are allowed!'), false);
        } else {
            cb(null, true);
        }
    }
});
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });

    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "Description must be at atleast 5 characters").isLength(
      { min: 5 }
    ),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });

      const saveNote = await note.save();

      res.json(saveNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);
// Route: Update an existing note (with optional image)
router.put("/updatenote/:id", fetchuser,upload.single('image'), async (req, res) => {
  const { title, description, tag } = req.body;

  try {
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }
    // If an image is uploaded, add it to newNote
    if (req.file) {
        newNote.imageData = req.file.buffer;
        newNote.contentType = req.file.mimetype;
    }
    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not Found!!!");
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    note = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json({ note });
  } catch (error) {
    console.error(error.message);
    //multer error
    if (error instanceof multer.MulterError) {
        return res.status(400).send(error.message);
    }
    res.status(500).send("Internal server error");
  }
});

router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  const { title, description, tag } = req.body;

  try {
    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not Found!!!");
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    note = await Notes.findByIdAndDelete(req.params.id);
    res.json({ success: "Note has been deleted", note: note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});
// Route to fetch image of a note
router.get("/fetchimagenote/:id", fetchuser, async (req, res) => {
    try {
        const note = await Notes.findById(req.params.id);
        if (!note || !note.imageData) {
            return res.status(404).send("Image not found");
        }

        // Check ownership
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        res.set('Content-Type', note.contentType);
        
        res.send(note.imageData);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
});
module.exports = router;

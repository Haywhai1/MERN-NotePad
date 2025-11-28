const mongoose = require("mongoose");
const Note = require("../models/Notes.js");

// GET /api/notes
// Optionally filter by folder or favorite
const getNotes = async (req, res) => {
  try {
    const { folder, favorite } = req.query;
    const filter = {};

    if (folder) filter.folder = folder;       // filter by folder if provided
    if (favorite === "true") filter.favorite = true; // filter by favorite if true

    const notes = await Note.find(filter).populate("folder");
    res.status(200).json(notes);
  } catch (err) {
    console.error("Failed to fetch notes:", err);
    res.status(500).json({ message: "Failed to fetch notes" });
  }
};

const getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id).populate("folder", "name");;
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a new note
// @route   POST /api/notes
const createNote = async (req, res) => {
  try {
    const { title, description, folder } = req.body;

    const note = await Note.create({
      title,
      description,
      folder: folder ? new mongoose.Types.ObjectId(folder.trim()) : null,
    });

    res.status(201).json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Update a note (including favorite toggle)
const updateNote = async (req, res) => {
  try {
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      req.body, // can include { favorite: true/false } or any field
      { new: true }
    );

    if (!updatedNote) return res.status(404).json({ message: "Note not found" });
    res.json(updatedNote);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete a note
// @route   DELETE /api/notes/:id
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json({ message: "Note deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getNotesByFolder = async (req, res) => {
  try {
    const folderId = req.query.folder;

    if (!folderId) {
      return res.status(400).json({ message: "Folder ID is required" });
    }

    // Convert folder string to ObjectId
    const folderObjectId = new mongoose.Types.ObjectId(folderId.trim());

    const notes = await Note.find({ folder: folderObjectId }).sort({ createdAt: -1 });

    // Map to include formatted timestamps
    const formattedNotes = notes.map((note) => ({
      _id: note._id,
      title: note.title,
      description: note.description,
      favorite: note.favorite,
      folder: note.folder,
      createdAt: note.createdAt.toLocaleString(), // e.g., "11/26/2025, 4:54:41 PM"
      updatedAt: note.updatedAt.toLocaleString(),
    }));

    res.json(formattedNotes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getNotes, getNoteById, createNote, updateNote, deleteNote, getNotesByFolder };

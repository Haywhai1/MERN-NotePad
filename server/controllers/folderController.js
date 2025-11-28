const Folder = require('../models/Folder.js');
const Note = require('../models/Notes.js');

// Create folder
const createFolder = async (req, res) => {
  try {
    const folder = await Folder.create({ name: req.body.name });
    res.status(201).json(folder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all folders
const getFolders = async (req, res) => {
  try {
    const folders = await Folder.find().sort({ createdAt: -1 });
    res.json(folders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Rename folder
const renameFolder = async (req, res) => {
  try {
    const folder = await Folder.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );

    if (!folder) return res.status(404).json({ message: 'Folder not found' });

    res.json(folder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete folder + optionally delete all notes inside it
const deleteFolder = async (req, res) => {
  try {
    const folderId = req.params.id;

    await Folder.findByIdAndDelete(folderId);

    // Remove folder reference from notes
    await Note.updateMany({ folder: folderId }, { folder: null });

    res.json({ message: 'Folder deleted and notes updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//Get All Folders With Notes Embedded
const getFoldersWithNotes = async (req, res) => {
  try {
    // Fetch all folders
    const folders = await Folder.find().sort({ createdAt: -1 });

    // For each folder, fetch notes inside it
    const result = await Promise.all(
      folders.map(async (folder) => {
        const notes = await Note.find({ folder: folder._id }).sort({ createdAt: -1 });

        // Format dates
        const formattedNotes = notes.map((note) => ({
          _id: note._id,
          title: note.title,
          description: note.description,
          favorite: note.favorite,
          createdAt: note.createdAt.toLocaleString(),
          updatedAt: note.updatedAt.toLocaleString(),
        }));

        return {
          _id: folder._id,
          name: folder.name,
          createdAt: folder.createdAt.toLocaleString(),
          notes: formattedNotes,
        };
      })
    );

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  createFolder,
  getFolders,
  renameFolder,
  deleteFolder,
  getFoldersWithNotes
};

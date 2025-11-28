const express = require('express');
const router = express.Router();
const {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  getNotesByFolder,
  getNoteById
} = require('../controllers/noteController');

// Get all notes OR get notes by folder
router.route('/').get(getNotes).post(createNote);

// Get, update, delete a single note by ID
router.route('/:id')
  .get(getNoteById)  // this is the missing piece
  .patch(updateNote)
  .delete(deleteNote);

module.exports = router;

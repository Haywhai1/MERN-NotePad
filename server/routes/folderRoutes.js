const express = require('express');
const router = express.Router();
const {
  createFolder,
  getFolders,
  renameFolder,
  deleteFolder,
  getFoldersWithNotes
} = require('../controllers/folderController');

router.route('/').get(getFolders).post(createFolder);
router.get("/with-notes", getFoldersWithNotes);
router.route('/:id').put(renameFolder).delete(deleteFolder);

module.exports = router;


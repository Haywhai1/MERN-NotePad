const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    favorite: { type: Boolean, default: false },
    folder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
      default: null,
    },
  },
  { timestamps: true } // automatically adds createdAt & updatedAt
);

module.exports = mongoose.model("Note", noteSchema);

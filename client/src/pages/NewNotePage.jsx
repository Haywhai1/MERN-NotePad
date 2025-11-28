import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

export default function NewNotePage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const folderId = state?.folderId || null;
  const folderName = state?.folderName || null;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGoBack = () => {
    if (folderId) {
      navigate(`/folder/${folderId}`, { state: { folderName } });
    } else {
      navigate("/");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) {
      setError("Title and description are required.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await api.post("/notes", {
        title,
        description,
        folder: folderId, // null if standalone
      });

      // Redirect back to folder or home
      handleGoBack();
    } catch (err) {
      console.error("Failed to create note", err);
      setError("Failed to create note");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen w-full p-6 flex flex-col space-y-6 relative">
      {/* Back Arrow */}
      <button
        onClick={handleGoBack}
        className="absolute top-6 left-6 p-2 rounded-full hover:bg-orange-600 transition"
        title="Go Back"
      >
        <ArrowLeftIcon className="w-6 h-6 text-orange-500" />
      </button>

      <h1 className="text-4xl font-bold text-orange-500 text-center">
        {folderName ? `New Note in ${folderName}` : "New Note"}
      </h1>

      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-3 rounded bg-neutral-700 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="p-3 rounded bg-neutral-700 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-orange-500 h-40 resize-none"
        />

        <button
          type="submit"
          className="px-4 py-2 bg-orange-500 hover:bg-orange-400 rounded text-white font-semibold transition"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Note"}
        </button>
      </form>
    </div>
  );
}

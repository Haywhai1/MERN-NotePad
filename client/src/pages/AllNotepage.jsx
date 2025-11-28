import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import {
  ArrowLeftIcon,
  StarIcon as StarOutline,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";

export default function AllNotepage() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/notes"); // Fetch all notes
        setNotes(res.data);
      } catch (err) {
        console.error("Failed to load notes", err);
        setError("Failed to load notes");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleGoBack = () => navigate("/");

  const handleAddNote = () => navigate("/new-note"); // no folder

  const toggleFavorite = async (noteId, currentValue) => {
    try {
      if (
        currentValue &&
        !confirm("Do you want to remove this note from favorites?")
      ) {
        return;
      }
      await api.patch(`/notes/${noteId}`, { favorite: !currentValue });
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note._id === noteId ? { ...note, favorite: !currentValue } : note
        )
      );
    } catch (err) {
      console.error("Failed to update favorite", err);
      alert("Failed to update favorite");
    }
  };

  if (loading) return <p className="text-white p-6">Loading notes...</p>;
  if (error) return <p className="text-red-500 p-6">{error}</p>;
  if (!notes.length) return <p className="text-white p-6">No notes found</p>;

  return (
    <div className="bg-black text-white min-h-screen w-full p-6 relative">
      {/* Top-left back arrow */}
      <button
        onClick={handleGoBack}
        className="absolute top-6 left-6 p-2 rounded-full hover:bg-orange-600 transition"
        title="Go Back"
      >
        <ArrowLeftIcon className="w-6 h-6 text-orange-500" />
      </button>

      <h1 className="text-4xl font-bold mb-6 text-orange-500 text-center">
        All Notes
      </h1>

      <div className="space-y-4 mt-4">
        {notes.map((note) => (
          <div
            key={note._id}
            className="p-4 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition flex justify-between items-center"
          >
            {/* Note info */}
            <div
              className="flex-1 cursor-pointer truncate"
              onClick={() =>
                navigate(`/note/${note._id}`, {
                  state: { folderName: note.folder?.name },
                })
              }
            >
              <h2 className="text-xl font-semibold">{note.title}</h2>
              <p className="text-neutral-300 mt-2 truncate">
                {note.description}
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                {new Date(note.updatedAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </p>
            </div>

            {/* Favorite icon */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(note._id, note.favorite);
              }}
              className="p-1"
              title={note.favorite ? "Unfavorite" : "Favorite"}
            >
              {note.favorite ? (
                <StarSolid className="w-6 h-6 text-orange-500" />
              ) : (
                <StarOutline className="w-6 h-6 text-orange-500" />
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Floating Add Note Button */}
      <button
        onClick={handleAddNote}
        className="fixed bottom-6 right-6 bg-orange-500 hover:bg-orange-400 p-4 rounded-full shadow-lg transition flex items-center justify-center"
        title="Add New Note"
      >
        <PlusIcon className="w-6 h-6 text-white" />
      </button>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { ArrowLeftIcon, StarIcon as StarOutline, PlusIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";
import SearchInput from "../components/SearchInput";
import { highlightText } from "../utils/highlightText.jsx";

export default function AllNotepage() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/notes"); 
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
  const handleAddNote = () => navigate("/new-note");

  const toggleFavorite = async (noteId, currentValue) => {
    try {
      await api.patch(`/notes/${noteId}`, { favorite: !currentValue });
      setNotes(prev =>
        prev.map(note =>
          note._id === noteId ? { ...note, favorite: !currentValue } : note
        )
      );
    } catch (err) {
      console.error("Failed to update favorite", err);
    }
  };

  const filteredNotes = notes.filter(note => {
    const term = searchTerm.toLowerCase();
    return (
      note.title.toLowerCase().includes(term) ||
      note.description.toLowerCase().includes(term) ||
      note.folder?.name.toLowerCase().includes(term)
    );
  });

  if (loading) return <p className="text-white p-6">Loading notes...</p>;
  if (error) return <p className="text-red-500 p-6">{error}</p>;

  return (
    <div className="bg-black text-white min-h-screen w-full p-6 relative">
      <button
        onClick={handleGoBack}
        className="absolute top-6 left-6 p-2 rounded-full hover:bg-orange-600 transition"
      >
        <ArrowLeftIcon className="w-6 h-6 text-orange-500" />
      </button>

      <h1 className="text-4xl font-bold mb-4 text-orange-500 text-center">
        All Notes
      </h1>

      <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Search by title, description, folder..." />

      <div className="space-y-4 mt-2">
        {filteredNotes.length === 0 && (
          <p className="text-neutral-400 text-center">No notes found</p>
        )}

        {filteredNotes.map(note => (
          <div
            key={note._id}
            className="p-4 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition flex justify-between items-center cursor-pointer"
            onClick={() =>
              navigate(`/note/${note._id}`, { state: { folderName: note.folder?.name } })
            }
          >
            <div className="flex-1 truncate">
              <h2 className="text-xl font-semibold">
                {highlightText(note.title, searchTerm)}
              </h2>
              <p className="text-neutral-300 mt-2 truncate">
                {highlightText(note.description, searchTerm)}
              </p>
              {note.folder?.name && (
                <p className="text-xs text-neutral-400 mt-1">
                  Folder: {highlightText(note.folder.name, searchTerm)}
                </p>
              )}
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

            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(note._id, note.favorite);
              }}
              className="p-1"
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

      <button
        onClick={handleAddNote}
        className="fixed bottom-6 right-6 bg-orange-500 hover:bg-orange-400 p-4 rounded-full shadow-lg transition flex items-center justify-center"
      >
        <PlusIcon className="w-6 h-6 text-white" />
      </button>
    </div>
  );
}

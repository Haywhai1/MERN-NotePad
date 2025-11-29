import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { PlusIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarSolid, StarIcon as StarOutline } from "@heroicons/react/24/solid";
import SearchInput from "../components/SearchInput";
import { highlightText } from "../utils/highlightText.jsx";

export default function FolderNotesPage() {
  const { id } = useParams();
  const { state } = useLocation();
  const folderName = state?.folderName || "Folder";

  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/notes?folder=${id}`);
        setNotes(res.data);
      } catch (err) {
        console.error("Failed to load notes", err);
        setError("Failed to load notes");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleAddNote = () => navigate("/new-note", { state: { folderId: id, folderName } });
  const handleGoBack = () => navigate("/");

  const toggleFavorite = async (noteId, currentValue) => {
    try {
      await api.patch(`/notes/${noteId}`, { favorite: !currentValue });
      setNotes(prevNotes =>
        prevNotes.map(note =>
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
      note.description.toLowerCase().includes(term)
    );
  });

  if (loading) return <p className="text-white p-6">Loading notes...</p>;
  if (error) return <p className="text-red-500 p-6">{error}</p>;

  return (
    <div className="bg-black text-white min-h-screen w-full p-6 flex flex-col relative">
      <button
        onClick={handleGoBack}
        className="absolute top-6 left-6 p-2 rounded-full hover:bg-orange-600 transition"
      >
        <ArrowLeftIcon className="w-6 h-6 text-orange-500" />
      </button>

      <h1 className="text-4xl font-bold mb-4 text-orange-500 text-center">{folderName}</h1>

      <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Search in this folder..." />

      <div className="flex-1 space-y-3 w-full mt-2">
        {filteredNotes.length === 0 && (
          <p className="text-neutral-400 text-center">No notes found</p>
        )}

        {filteredNotes.map(note => (
          <div
            key={note._id}
            className="p-3 bg-neutral-700 rounded-lg hover:bg-neutral-600 transition flex justify-between items-center cursor-pointer"
            onClick={() => navigate(`/note/${note._id}`)}
          >
            <div className="flex-1">
              <p className="font-semibold text-white">{highlightText(note.title, searchTerm)}</p>
              <p className="text-xs text-neutral-500 mt-1">{highlightText(note.description, searchTerm)}</p>
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
              onClick={e => {
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
        className="fixed bottom-6 right-6 bg-orange-500 hover:bg-orange-400 text-white p-4 rounded-full shadow-lg flex items-center justify-center transition"
      >
        <PlusIcon className="w-6 h-6" />
      </button>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { ArrowLeftIcon, StarIcon as StarOutline } from "@heroicons/react/24/outline";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";

export default function FavoritesPage() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch favorite notes
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await api.get("/notes?favorite=true"); // Only favorite notes
        setFavorites(res.data);
      } catch (err) {
        console.error("Failed to load favorite notes", err);
        setError("Failed to load favorite notes");
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  const handleGoBack = () => navigate("/");

  // Toggle favorite status
  const toggleFavorite = async (noteId, currentValue) => {
    if (currentValue && !window.confirm("Remove this note from favorites?")) return;

    try {
      await api.patch(`/notes/${noteId}`, { favorite: !currentValue });
      setFavorites((prev) =>
        prev
          .map((note) =>
            note._id === noteId ? { ...note, favorite: !currentValue } : note
          )
          .filter((note) => note.favorite) // remove from list if unfavorited
      );
    } catch (err) {
      console.error("Failed to update favorite", err);
      alert("Failed to update favorite");
    }
  };

  return (
    <div className="bg-black text-white min-h-screen w-full p-6 flex flex-col relative">
      {/* Top-left back arrow */}
      <button
        onClick={handleGoBack}
        className="absolute top-6 left-6 p-2 rounded-full hover:bg-orange-600 transition"
        title="Go Back"
      >
        <ArrowLeftIcon className="w-6 h-6 text-orange-500" />
      </button>

      <h1 className="text-4xl font-bold mb-6 text-orange-500 text-center">
        Favorite Notes
      </h1>

      {loading ? (
        <p className="text-white p-6">Loading favorite notes...</p>
      ) : error ? (
        <p className="text-red-500 p-6">{error}</p>
      ) : favorites.length === 0 ? (
        <p className="text-white p-6 text-center">No favorite notes found</p>
      ) : (
        <div className="flex-1 space-y-3 w-full">
          {favorites.map((note) => (
            <div
              key={note._id}
              className="p-3 bg-neutral-700 rounded-lg flex justify-between items-center hover:bg-neutral-600 transition cursor-pointer"
            >
              {/* Note info */}
              <div
                className="flex-1"
                onClick={() =>
                  navigate(`/note/${note._id}`, {
                    state: { folderName: note.folder?.name },
                  })
                }
              >
                <p className="font-semibold text-white">{note.title}</p>
                <p className="text-sm text-neutral-400">
                  {new Date(note.createdAt).toLocaleString()}
                </p>
              </div>

              {/* Favorite toggle icon */}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // prevent navigating to note
                  toggleFavorite(note._id, note.favorite);
                }}
                className="p-1"
                title={note.favorite ? "Remove from favorites" : "Add to favorites"}
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
      )}
    </div>
  );
}

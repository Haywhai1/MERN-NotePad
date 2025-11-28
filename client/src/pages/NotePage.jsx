import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

export default function NotePage() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  // Folder name from navigation state or fallback to "Folder"
  const [folderName, setFolderName] = useState(state?.folderName || "Folder");
  const [folderId, setFolderId] = useState(state?.folderId || null);
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await api.get(`/notes/${id}`);
        setNote(res.data);

        // Populate folder info if not passed via state
        if (!state?.folderName) {
          setFolderName(res.data.folder?.name || "Folder");
        }
        if (!state?.folderId) {
          setFolderId(res.data.folder?._id || null);
        }
      } catch (err) {
        console.error("Failed to load note", err);
        setError("Failed to load note");
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id, state?.folderName, state?.folderId]);

  if (loading) return <p className="text-white p-6">Loading note...</p>;
  if (error) return <p className="text-red-500 p-6">{error}</p>;
  if (!note) return <p className="text-white p-6">Note not found</p>;

  // Navigate back to folder
  const handleGoBack = () => {
    if (folderId) {
      navigate(`/folder/${folderId}`, { state: { folderName } });
    } else {
      navigate("/"); // fallback to home if no folderId
    }
  };

  return (
    <div className="bg-black text-white min-h-screen w-full p-6 flex flex-col space-y-6 relative">
      {/* Top-left back arrow */}
      <button
        onClick={handleGoBack}
        className="absolute top-6 left-6 p-2 rounded-full hover:bg-orange-600 transition"
        title="Back to Folder"
      >
        <ArrowLeftIcon className="w-6 h-6 text-orange-500" />
      </button>

      {/* Folder Name */}
      <h1 className="text-4xl font-bold text-orange-500 text-center">{folderName}</h1>

      {/* Note Title */}
      <h2 className="text-2xl font-semibold">{note.title}</h2>

      {/* Buttons */}
      <div className="flex space-x-4">
        <button className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500 transition">
          Edit
        </button>
        <button className="px-4 py-2 bg-red-600 rounded hover:bg-red-500 transition">
          Delete
        </button>
      </div>

      {/* Note Description */}
      <p className="text-neutral-300 whitespace-pre-wrap">{note.description}</p>
    </div>
  );
}

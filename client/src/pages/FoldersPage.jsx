import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import {
  FolderIcon,
  PlusIcon,
  StarIcon,
  FolderPlusIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";

export default function FoldersPage() {
  const [folders, setFolders] = useState([]);
  const [allNotesCount, setAllNotesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showAddFolder, setShowAddFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [addingFolder, setAddingFolder] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const foldersRes = await api.get("/folders/with-notes");
        setFolders(foldersRes.data);

        const notesRes = await api.get("/notes");
        setAllNotesCount(notesRes.data.length);
      } catch (err) {
        console.error("Failed to load folders", err);
        setError("Failed to load folders");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p className="text-white p-6">Loading folders...</p>;
  if (error) return <p className="text-red-500 p-6">{error}</p>;
  if (!folders.length) return <p className="text-white p-6">No folders found</p>;

  const handleAddNote = () => navigate("/new-note");
  const handleViewFavorites = () => navigate("/favorites");
  const handleAddFolderClick = () => setShowAddFolder(true);

  const handleSaveFolder = async () => {
    if (!newFolderName.trim()) return;

    setAddingFolder(true);
    try {
      const res = await api.post("/folders", { name: newFolderName.trim() });
      setFolders((prev) => [...prev, res.data]);
      setNewFolderName("");
      setShowAddFolder(false);
    } catch (err) {
      console.error("Failed to create folder", err);
      alert("Failed to create folder");
    } finally {
      setAddingFolder(false);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen w-full h-full flex flex-col relative">
      <h1 className="text-4xl font-bold mb-6 text-orange-500 p-5">Folders</h1>

      {/* Overlay blur when adding a folder */}
      {showAddFolder && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-10 flex justify-center items-center">
          <div className="bg-neutral-800 p-6 rounded-lg w-80 flex flex-col space-y-4">
            <h2 className="text-xl font-semibold text-orange-500">New Folder</h2>
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Folder name"
              className="p-3 rounded bg-neutral-700 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAddFolder(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveFolder}
                disabled={addingFolder}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-400 rounded transition disabled:opacity-50"
              >
                {addingFolder ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Folder list container */}
      <div
        className={`flex-1 overflow-y-auto p-5 ${showAddFolder ? "blur-sm" : ""}`}
        style={{ paddingBottom: "100px" }} // space for bottom bar
      >
        <div className="bg-neutral-800 rounded-lg p-2">
          {/* All Notes */}
          <div
            onClick={() => navigate("/all-notes")}
            className="w-full p-4 cursor-pointer hover:bg-neutral-700 transition-all flex items-center gap-4"
          >
            <FolderIcon className="w-7 h-7 text-orange-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xl font-semibold">All Notes</p>
              <p className="text-sm text-neutral-400">{allNotesCount} notes</p>
              <div className="border-b border-white/20 mt-4"></div>
            </div>
          </div>

          {/* DB Folders */}
          {folders.map((folder, index) => (
            <div
              key={folder._id}
              onClick={() =>
                navigate(`/folder/${folder._id}`, {
                  state: { folderName: folder.name },
                })
              }
              className="w-full p-4 cursor-pointer hover:bg-neutral-700 transition-all flex items-center gap-4"
            >
              <FolderIcon className="w-7 h-7 text-orange-400 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xl font-semibold">{folder.name}</p>
                <p className="text-sm text-neutral-400">{folder.notes?.length || 0} notes</p>
                {index !== folders.length - 1 && (
                  <div className="border-b border-white/20 mt-4"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fixed bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-white/20 p-3 flex justify-around z-10">
        <button
          onClick={handleAddNote}
          className="bg-orange-500 hover:bg-orange-400 p-4 rounded-full shadow-lg transition"
        >
          <PlusIcon className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={handleAddFolderClick}
          className="bg-orange-500 hover:bg-orange-400 p-4 rounded-full shadow-lg transition"
        >
          <FolderPlusIcon className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={handleViewFavorites}
          className="bg-orange-500 hover:bg-orange-400 p-4 rounded-full shadow-lg transition"
        >
          <StarIcon className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={() => navigate("/recently-deleted")}
          className="bg-orange-500 hover:bg-orange-400 p-4 rounded-full shadow-lg transition"
        >
          <TrashIcon className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  );
}

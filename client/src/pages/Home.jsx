import { useEffect, useState } from "react";
import api from "../api/axios";
import FolderList from "../components/FolderList";
import NoteList from "../components/NoteList";

export default function Home() {
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);

  const loadFolders = async () => {
    const res = await api.get("/folders/with-notes");
    setFolders(res.data);

    // auto-select first folder if none selected
    if (!selectedFolder && res.data.length > 0) {
      setSelectedFolder(res.data[0]);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await loadFolders();
    };

    fetchData();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <FolderList
        folders={folders}
        onSelectFolder={setSelectedFolder}
      />

      <NoteList
        folder={selectedFolder}
        refresh={loadFolders}
      />
    </div>
  );
}

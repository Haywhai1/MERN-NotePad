import { BrowserRouter, Routes, Route } from "react-router-dom";
import FoldersPage from "./pages/FoldersPage";
import FolderNotesPage from "./pages/FolderNotesPage";
import NotePage from "./pages/NotePage";
import AllNotepage from "./pages/AllNotepage";
import NewNotePage from "./pages/NewNotePage";
import FavoritesPage from "./pages/FavoritesPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FoldersPage />} />
        <Route path="/folder/:id" element={<FolderNotesPage />} />
        <Route path="/note/:id" element={<NotePage />} />
        <Route path="/all-notes" element={<AllNotepage />} />
        <Route path="/new-note" element={<NewNotePage />} />
        <Route path="/favorites" element={<FavoritesPage />} />



      </Routes>
    </BrowserRouter>
  );
}

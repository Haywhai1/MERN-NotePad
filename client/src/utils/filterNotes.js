export function filterNotes(notes, searchTerm) {
  if (!searchTerm.trim()) return notes;

  const term = searchTerm.toLowerCase();

  return notes.filter((note) => {
    const title = note.title?.toLowerCase() || "";
    const content = note.content?.toLowerCase() || note.description?.toLowerCase() || "";
    const createdAt = new Date(note.createdAt)
      .toLocaleString("en-GB")
      .toLowerCase();
    const folderName = note.folder?.name?.toLowerCase() || "";

    return (
      title.includes(term) ||
      content.includes(term) ||
      folderName.includes(term) ||
      createdAt.includes(term) ||
      (term === "favorite" && note.favorite === true)
    );
  });
}

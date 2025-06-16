import { useEffect, useState } from "react"
import { getNotes, createNote, deleteNote, updateNote } from "../services/noteService"
import type { Note } from "../services/noteService"
import "../styles/notes.css"

// Importez les icônes de React Icons pour les boutons d'action
import { FaSave, FaTimes, FaEdit, FaTrash } from "react-icons/fa"; // Exemples Font Awesome

export default function NotesSection() {
  const [notes, setNotes] = useState<Note[]>([])
  const [newNote, setNewNote] = useState("")
  const [editId, setEditId] = useState<number | null>(null)
  const [editContent, setEditContent] = useState("")

  useEffect(() => {
    getNotes().then(setNotes).catch(console.error)
  }, [])

  const handleAdd = async () => {
    if (!newNote.trim()) return
    const now = new Date().toISOString()
    const created = await createNote({ content: newNote, created_at: now, updated_at: now })
    setNotes(prev => [...prev, created])
    setNewNote("")
  }

  const handleDelete = async (id: number) => {
    await deleteNote(id)
    setNotes(prev => prev.filter(n => n.id !== id))
  }

  const handleUpdate = async () => {
    if (editId === null) {
      console.error("Attempted to update a note with no editId set.");
      return;
    }
    const noteToUpdate = notes.find(n => n.id === editId);
    if (!noteToUpdate) {
        console.error("Note to update not found in state.");
        return;
    }

    const updated = await updateNote(editId, {
        content: editContent,
        created_at: noteToUpdate.created_at, // Conserver la date de création originale
        updated_at: new Date().toISOString() // Mettre à jour la date de modification côté frontend
    });
    setNotes(prev => prev.map(n => n.id === editId ? updated : n))
    setEditId(null)
  }

  return (
    <div className="notes-section">
      <textarea
        value={newNote}
        onChange={(e) => setNewNote(e.target.value)}
        placeholder="Écris ta note ici..."
        rows={3}
      />
      <button onClick={handleAdd} disabled={!newNote.trim()}>Ajouter la note</button>

      <div className="notes-list">
        {notes.map(note => (
          <div key={note.id} className="note-item">
            {editId === note.id ? (
              <>
                <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} />
                {/* Appeler handleUpdate sans argument, car il utilise editId */}
                <button onClick={handleUpdate}><FaSave size={16} /></button> {/* Nouvelle icône Save */}
                <button onClick={() => setEditId(null)}><FaTimes size={16} /></button> {/* Nouvelle icône Cancel */}
              </>
            ) : (
              <>
                <p>{note.content}</p>
                <small>🕒 {new Date(note.updated_at).toLocaleString()}</small>
                <button onClick={() => { setEditContent(note.content); setEditId(note.id) }}><FaEdit size={16} /></button> {/* Nouvelle icône Edit */}
                <button onClick={() => handleDelete(note.id)}><FaTrash size={16} /></button> {/* Nouvelle icône Delete */}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
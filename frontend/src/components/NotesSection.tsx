import { useEffect, useState } from "react"
import { getNotes, createNote, deleteNote, updateNote } from "../services/noteService"
import type { Note } from "../services/noteService"
import "../styles/notes.css"

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
    const created = await createNote({ content: newNote })
    setNotes(prev => [...prev, created])
    setNewNote("")
  }

  const handleDelete = async (id: number) => {
    await deleteNote(id)
    setNotes(prev => prev.filter(n => n.id !== id))
  }

  const handleUpdate = async (id: number) => {
    const updated = await updateNote(id, { content: editContent })
    setNotes(prev => prev.map(n => n.id === id ? updated : n))
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
                <button onClick={() => handleUpdate(note.id)}>💾</button>
                <button onClick={() => setEditId(null)}>❌</button>
              </>
            ) : (
              <>
                <p>{note.content}</p>
                <small>🕒 {new Date(note.updated_at).toLocaleString()}</small>
                <button onClick={() => { setEditContent(note.content); setEditId(note.id) }}>✏️</button>
                <button onClick={() => handleDelete(note.id)}>🗑️</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

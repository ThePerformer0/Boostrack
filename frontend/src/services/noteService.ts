export interface Note {
  id: number
  content: string
  created_at: string
  updated_at: string
}

export interface NotePayload {
  content: string;
  created_at: string; 
  updated_at: string;
}

const API_URL = "http://127.0.0.1:8000"

export const getNotes = async (): Promise<Note[]> => {
  const res = await fetch(`${API_URL}/notes`)
  return await res.json()
}

export const createNote = async (note: Omit<Note, "id">): Promise<Note> => {
  console.log("Creating note:", note)
  const res = await fetch(`${API_URL}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note),
  })
  if (!res.ok) {
    console.error("Failed to create note:", res.status, res.statusText)
    throw new Error(`Failed to create note: ${res.status} ${res.statusText}`)
  }else {
    console.log("Note created successfully")
  }
  return await res.json()
}

export const deleteNote = async (id: number): Promise<void> => {
  await fetch(`${API_URL}/notes/${id}`, {
    method: "DELETE",
  })
}

export const updateNote = async (id: number, data: NotePayload): Promise<Note> => {
  const res = await fetch(`${API_URL}/notes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  return await res.json()
}

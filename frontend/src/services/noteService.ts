export interface Note {
  id: number
  content: string
}

const API_URL = "http://127.0.0.1:8000"

export const getNotes = async (): Promise<Note[]> => {
  const res = await fetch(`${API_URL}/notes`)
  return await res.json()
}

export const createNote = async (note: Omit<Note, "id">): Promise<Note> => {
  const res = await fetch(`${API_URL}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note),
  })
  return await res.json()
}

export const deleteNote = async (id: number): Promise<void> => {
  await fetch(`${API_URL}/notes/${id}`, {
    method: "DELETE",
  })
}

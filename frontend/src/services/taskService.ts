export interface Task {
  id: number
  title: string
  done: boolean
}

const API_URL = "http://127.0.0.1:8000"

export const getTasks = async (): Promise<Task[]> => {
  const res = await fetch(`${API_URL}/tasks`)
  return await res.json()
}

export const createTask = async (task: Task): Promise<Task> => {
  const res = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  })
  return await res.json()
}

export const deleteTask = async (id: number): Promise<void> => {
  await fetch(`${API_URL}/tasks/${id}`, { method: "DELETE" })
}

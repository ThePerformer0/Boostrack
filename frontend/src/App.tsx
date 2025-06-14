import { useEffect, useState } from "react"
import { getTasks, createTask, deleteTask } from "./services/taskService"
import type { Task } from "./services/taskService"

function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTitle, setNewTitle] = useState("")

  useEffect(() => {
    getTasks().then(setTasks)
  }, [])

  const handleAdd = async () => {
    const newTask: Task = {
      id: Date.now(),
      title: newTitle,
      done: false,
    }
    const created = await createTask(newTask)
    setTasks((prev) => [...prev, created])
    setNewTitle("")
  }

  const handleDelete = async (id: number) => {
    await deleteTask(id)
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <div>
      <h1>Boostrack - Tâches</h1>
      <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
      <button onClick={handleAdd}>Ajouter</button>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.title} <button onClick={() => handleDelete(task.id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
// This code is a simple React application that manages a list of tasks.
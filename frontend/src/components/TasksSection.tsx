import { useEffect, useState } from "react"
import { getTasks, createTask, deleteTask, updateTask } from "../services/taskService"
import type { Task } from "../services/taskService"
import { Plus, CheckCircle2, Circle, Trash2 } from "lucide-react"
import "../styles/tasks.css"

export default function TasksSection() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTitle, setNewTitle] = useState("")

  useEffect(() => {
    getTasks().then(setTasks).catch(console.error)
  }, [])

  const handleAdd = async () => {
    if (!newTitle.trim()) return
    const newTask: Task = { id: Date.now(), title: newTitle, done: false }
    const created = await createTask(newTask)
    setTasks(prev => [...prev, created])
    setNewTitle("")
  }

  const handleToggle = async (id: number) => {
    const task = tasks.find(t => t.id === id)
    if (!task) return
    const updated = await updateTask(id, { ...task, done: !task.done })
    setTasks(prev => prev.map(t => t.id === id ? updated : t))
  }

  const handleDelete = async (id: number) => {
    await deleteTask(id)
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  return (
    <div className="tasks-section">
      <div className="add-task-section">
        <div className="input-group">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Ajouter une nouvelle tâche..."
            className="task-input"
          />
          <button onClick={handleAdd} className="add-btn" disabled={!newTitle.trim()}>
            <Plus size={20} />
          </button>
        </div>
      </div>

      <div className="tasks-container">
        <h2>Mes tâches</h2>
        {tasks.length === 0 ? (
          <p>Aucune tâche pour l’instant</p>
        ) : (
          tasks.map(task => (
            <div key={task.id} className={`task-item ${task.done ? "completed" : ""}`}>
              <button onClick={() => handleToggle(task.id)}>
                {task.done ? <CheckCircle2 /> : <Circle />}
              </button>
              <span>{task.title}</span>
              <button onClick={() => handleDelete(task.id)}><Trash2 /></button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

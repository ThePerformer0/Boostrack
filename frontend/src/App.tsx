import { useEffect, useState } from "react"
import { Plus, CheckCircle2, Circle, Trash2, Timer, FileText, BarChart3, Settings } from "lucide-react"
import { getTasks, createTask, deleteTask, updateTask } from "./services/taskService"
import type { Task } from "./services/taskService"

function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTitle, setNewTitle] = useState("")
  const [activeTab, setActiveTab] = useState("tasks") // tasks, notes, timer, stats

  // Intégration avec votre API backend
  useEffect(() => {
    getTasks().then(setTasks).catch(console.error)
  }, [])

  const handleAdd = async () => {
    if (!newTitle.trim()) return
    try {
      const newTask: Task = {
        id: Date.now(), // L'API assignera le vrai ID
        title: newTitle,
        done: false,
      }
      const created = await createTask(newTask)
      setTasks(prev => [...prev, created])
      setNewTitle("")
    } catch (error) {
      console.error("Erreur lors de l'ajout:", error)
    }
  }

  const handleToggle = async (id: number) => {
    try {
      const task = tasks.find(t => t.id === id)
      if (task) {
        const updated = await updateTask(id, { ...task, done: !task.done })
        setTasks(prev => prev.map(t => t.id === id ? updated : t))
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteTask(id)
      setTasks(prev => prev.filter(task => task.id !== id))
    } catch (error) {
      console.error("Erreur lors de la suppression:", error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdd()
    }
  }

  return (
    <div className="app">
      {/* Header avec branding */}
      <header className="app-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-icon">🚀</div>
            <h1 className="app-title">Boostrack</h1>
          </div>
          <div className="header-actions">
            <button className="settings-btn">
              <Settings size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Navigation principale */}
      <nav className="main-nav">
        <div className="nav-container">
          <button 
            className={`nav-item ${activeTab === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveTab('tasks')}
          >
            <CheckCircle2 size={20} />
            <span>Tâches</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'notes' ? 'active' : ''}`}
            onClick={() => setActiveTab('notes')}
          >
            <FileText size={20} />
            <span>Notes</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'timer' ? 'active' : ''}`}
            onClick={() => setActiveTab('timer')}
          >
            <Timer size={20} />
            <span>Minuteur</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            <BarChart3 size={20} />
            <span>Stats</span>
          </button>
        </div>
      </nav>

      {/* Contenu principal */}
      <main className="main-content">
        {activeTab === 'tasks' && (
          <div className="tasks-section">
            {/* Section d'ajout de tâche */}
            <div className="add-task-section">
              <div className="add-task-container">
                <div className="input-group">
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ajouter une nouvelle tâche..."
                    className="task-input"
                  />
                  <button 
                    onClick={handleAdd}
                    className="add-btn"
                    disabled={!newTitle.trim()}
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Liste des tâches */}
            <div className="tasks-container">
              <div className="tasks-header">
                <h2>Mes tâches</h2>
                <span className="tasks-count">
                  {tasks.filter(t => !t.done).length} en cours
                </span>
              </div>

              <div className="tasks-list">
                {tasks.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">📝</div>
                    <h3>Aucune tâche</h3>
                    <p>Ajoutez votre première tâche pour commencer !</p>
                  </div>
                ) : (
                  tasks.map((task) => (
                    <div key={task.id} className={`task-item ${task.done ? 'completed' : ''}`}>
                      <button
                        className="task-toggle"
                        onClick={() => handleToggle(task.id)}
                      >
                        {task.done ? 
                          <CheckCircle2 size={20} className="check-icon completed" /> : 
                          <Circle size={20} className="check-icon" />
                        }
                      </button>
                      
                      <span className="task-title">{task.title}</span>
                      
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(task.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="notes-section">
            <div className="coming-soon">
              <div className="coming-soon-icon">📝</div>
              <h2>Notes</h2>
              <p>Fonctionnalité en cours de développement...</p>
            </div>
          </div>
        )}

        {activeTab === 'timer' && (
          <div className="timer-section">
            <div className="coming-soon">
              <div className="coming-soon-icon">⏱️</div>
              <h2>Minuteur Pomodoro</h2>
              <p>Fonctionnalité en cours de développement...</p>
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="stats-section">
            <div className="coming-soon">
              <div className="coming-soon-icon">📊</div>
              <h2>Statistiques</h2>
              <p>Fonctionnalité en cours de développement...</p>
            </div>
          </div>
        )}
      </main>

      {/* Footer optionnel */}
      <footer className="app-footer">
        <p className="footer-text">PerformerTrack - Votre compagnon de productivité</p>
      </footer>
    </div>
  )
}

export default App
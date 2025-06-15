import { useState } from "react"
import TasksSection from "./components/TasksSection"
import NotesSection from "./components/NotesSection"
import TimerSection from "./components/TimerSection"
import StatsSection from "./components/StatsSection"

import {
  CheckCircle2,
  FileText,
  Timer,
  BarChart3,
  Settings,
} from "lucide-react"

function App() {
  const [activeTab, setActiveTab] = useState("tasks") // tasks, notes, timer, stats

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
            className={`nav-item ${activeTab === "tasks" ? "active" : ""}`}
            onClick={() => setActiveTab("tasks")}
          >
            <CheckCircle2 size={20} />
            <span>Tâches</span>
          </button>

          <button
            className={`nav-item ${activeTab === "notes" ? "active" : ""}`}
            onClick={() => setActiveTab("notes")}
          >
            <FileText size={20} />
            <span>Notes</span>
          </button>

          <button
            className={`nav-item ${activeTab === "timer" ? "active" : ""}`}
            onClick={() => setActiveTab("timer")}
          >
            <Timer size={20} />
            <span>Minuteur</span>
          </button>

          <button
            className={`nav-item ${activeTab === "stats" ? "active" : ""}`}
            onClick={() => setActiveTab("stats")}
          >
            <BarChart3 size={20} />
            <span>Stats</span>
          </button>
        </div>
      </nav>

      {/* Contenu principal */}
      <main className="main-content">
        {activeTab === "tasks" && <TasksSection />}
        {activeTab === "notes" && <NotesSection />}
        {activeTab === "timer" && <TimerSection />}
        {activeTab === "stats" && <StatsSection />}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p className="footer-text">
          Boostrack – Votre compagnon de productivité
        </p>
      </footer>
    </div>
  )
}

export default App
// App.tsx
import { useState } from "react";
import TasksSection from "./components/TasksSection";
import NotesSection from "./components/NotesSection";
import TimerSection from "./components/TimerSection";
import StatsSection from "./components/StatsSection";

// Importez les icônes spécifiques de la collection choisie
import { MdCheckCircle, MdNotes, MdTimer, MdBarChart, MdSettings } from "react-icons/md"; // Exemples Material Design Filled

function App() {
  const [activeTab, setActiveTab] = useState("tasks"); // tasks, notes, timer, stats

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
              <MdSettings size={20} /> {/* Utilisation de la nouvelle icône */}
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
            <MdCheckCircle size={20} /> {/* Nouvelle icône */}
            <span>Tâches</span>
          </button>

          <button
            className={`nav-item ${activeTab === "notes" ? "active" : ""}`}
            onClick={() => setActiveTab("notes")}
          >
            <MdNotes size={20} /> {/* Nouvelle icône */}
            <span>Notes</span>
          </button>

          <button
            className={`nav-item ${activeTab === "timer" ? "active" : ""}`}
            onClick={() => setActiveTab("timer")}
          >
            <MdTimer size={20} /> {/* Nouvelle icône */}
            <span>Minuteur</span>
          </button>

          <button
            className={`nav-item ${activeTab === "stats" ? "active" : ""}`}
            onClick={() => setActiveTab("stats")}
          >
            <MdBarChart size={20} /> {/* Nouvelle icône */}
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
  );
}

export default App;
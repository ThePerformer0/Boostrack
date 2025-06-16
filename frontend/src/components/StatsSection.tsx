import { useEffect, useState } from "react"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"
import "../styles/stats.css"

// Importez les icônes nécessaires de react-icons
import { FaCheck, FaClock, FaCalendarWeek } from "react-icons/fa"; // Exemples d'icônes Font Awesome

interface DailyStat {
  date: string
  hours: number
}

interface SummaryStats {
  tasks_done: number
  minutes_today: number
  minutes_week: number
}

export default function StatsSection() {
  const [data, setData] = useState<DailyStat[]>([])
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState<SummaryStats | null>(null)


  useEffect(() => {
    // Fonction asynchrone pour gérer les requêtes
    const fetchData = async () => {
      setLoading(true);
      try {
        const [dailyRes, summaryRes] = await Promise.all([
          fetch("http://localhost:8000/sessions/daily"),
          fetch("http://localhost:8000/stats/summary")
        ]);

        const dailyData = await dailyRes.json();
        const summaryData = await summaryRes.json();

        setData(dailyData);
        setSummary(summaryData);

      } catch (err) {
        console.error("Erreur lors du chargement des stats:", err);
        // Afficher un message d'erreur à l'utilisateur
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []) // Tableau de dépendances vide pour un seul appel au montage du composant

  if (loading) {
    return <div className="stats-section"><p>Chargement des statistiques...</p></div>;
  }

  // Si pas de données et pas de résumé après chargement, afficher un message d'absence de données.
  // Cela gère le cas où l'API ne retourne rien du tout.
  if (!data.length && !summary) {
    return (
      <div className="stats-section">
        <p>Aucune donnée de statistiques disponible pour le moment. Commencez à utiliser l'application !</p>
      </div>
    );
  }

  return (
    <div className="stats-section">
      <h2>Statistiques d'utilisation</h2>

      {summary && ( // Assurez-vous que summary n'est pas null avant d'afficher
        <div className="summary-cards">
          <div className="stat-card">
            <h4><FaCheck size={20} /> Tâches terminées</h4> {/* Nouvelle icône */}
            <p>{summary.tasks_done}</p>
          </div>
          <div className="stat-card">
            <h4><FaClock size={20} /> Minutes aujourd'hui</h4> {/* Nouvelle icône */}
            <p>{summary.minutes_today} min</p>
          </div>
          <div className="stat-card">
            <h4><FaCalendarWeek size={20} /> Minutes cette semaine</h4> {/* Nouvelle icône */}
            <p>{summary.minutes_week} min</p>
          </div>
        </div>
      )}
            
      {data.length > 0 ? ( // Affichez les graphiques seulement si des données sont disponibles
        <>
          <div className="chart-container">
            <h3>Heures travaillées (barres)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis unit="h" />
                <Tooltip />
                <Bar dataKey="hours" fill="#667eea" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-container">
            <h3>Progression quotidienne (courbe)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis unit="h" />
                <Tooltip />
                <Line type="monotone" dataKey="hours" stroke="#82ca9d" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : (
        <p className="no-data-message">Aucune donnée de temps de travail enregistrée pour cette période.</p>
      )}
    </div>
  )
}
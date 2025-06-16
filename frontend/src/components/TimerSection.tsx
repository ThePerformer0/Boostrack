import { useEffect, useRef, useState } from "react"
import "../styles/timer.css"
// Importez les icônes de React Icons pour le minuteur
import { FaPlay, FaPause, FaRedo, FaBellSlash, FaMugHot, FaLaptopCode } from "react-icons/fa"

const WORK_DURATION = 25 * 60
const BREAK_DURATION = 5 * 60
const ALARM_DURATION = 60
const STORAGE_KEY = "boostrack_timer_state"

export default function TimerSection() {
  const [mode, setMode] = useState<"pomodoro" | "custom">("pomodoro")
  const [customHours, setCustomHours] = useState(0)
  const [customMinutes, setCustomMinutes] = useState(10)
  const [timeLeft, setTimeLeft] = useState(WORK_DURATION)
  const [isRunning, setIsRunning] = useState(false)
  const [isBreak, setIsBreak] = useState(false)
  const [alarmPlaying, setAlarmPlaying] = useState(false)

  const intervalRef = useRef<number | null>(null)
  const alarmRef = useRef<HTMLAudioElement | null>(null)
  const alarmTimeoutRef = useRef<number | null>(null)

  // --- Fonctions existantes (pas de changement ici) ---
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    const min = m.toString().padStart(2, "0")
    const sec = s.toString().padStart(2, "0")
    return h > 0 ? `${h}h${min}:${sec}` : `${m}:${sec}`
  }

  const getCustomDuration = () => (customHours * 60 + customMinutes) * 60
  
  // --- useEffect pour le décompte (pas de changement majeur) ---
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            triggerAlarm()
            return 0
          }
          
          const updated = prev - 1
          // Sauvegarder l'état
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
              mode,
              customHours,
              customMinutes,
              timeLeft: updated,
              isRunning: true,
              isBreak
            })
          )
          return updated
        })
      }, 1000)
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning, isBreak, mode, customHours, customMinutes]) // Ajout des dépendances manquantes

  // --- useEffect pour charger l'état sauvegardé (pas de changement) ---
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const data = JSON.parse(saved)
      setMode(data.mode)
      setCustomHours(data.customHours)
      setCustomMinutes(data.customMinutes)
      setTimeLeft(data.timeLeft)
      setIsBreak(data.isBreak)
      setIsRunning(data.isRunning)
    }
  }, [])
  
  const triggerAlarm = () => {
    setIsRunning(false)
    setAlarmPlaying(true)
    
    // Tentative de lecture de l'alarme
    alarmRef.current?.play().catch(error => {
      // Au cas où la lecture échoue, on peut logger l'erreur
      console.error("La lecture de l'alarme a échoué :", error);
    });

    alarmTimeoutRef.current = setTimeout(() => stopAlarm(), ALARM_DURATION * 1000)

    if (mode === "pomodoro") {
      // Préparer le prochain cycle (pause ou travail)
      setIsBreak(prev => !prev); 
    }
  }

  // --- Changement dans la fonction stopAlarm ---
  const stopAlarm = () => {
    localStorage.removeItem(STORAGE_KEY) // On nettoie le state seulement quand l'alarme est arrêtée
    setAlarmPlaying(false)
    if (alarmRef.current) {
        alarmRef.current.pause()
        alarmRef.current.currentTime = 0
    }
    if (alarmTimeoutRef.current) clearTimeout(alarmTimeoutRef.current)
    
    // Après avoir arrêté l'alarme, on réinitialise le temps pour le prochain cycle
    if (mode === "pomodoro") {
      // isBreak a déjà été inversé dans triggerAlarm, on utilise sa nouvelle valeur
      setTimeLeft(isBreak ? BREAK_DURATION : WORK_DURATION)
    }
  }

  // --- Changement majeur dans la fonction startTimer ---
  const startTimer = () => {
    // CORRECTION : Charger l'audio lors du clic sur "Démarrer"
    // Cela "déverrouille" l'élément audio pour le navigateur
    if (alarmRef.current) {
      alarmRef.current.load();
    }
    
    // Si on démarre un nouveau cycle (pas une reprise), on définit la durée
    if (timeLeft === 0 || !isRunning) {
        const duration =
          mode === "pomodoro"
            ? isBreak ? BREAK_DURATION : WORK_DURATION
            : getCustomDuration()
        setTimeLeft(duration)
    }
    setIsRunning(true)
  }

  const resetTimer = () => {
    stopAlarm()
    setIsRunning(false)
    setIsBreak(false)
    // On doit réinitialiser le temps ici
    const newDuration = mode === 'pomodoro' ? WORK_DURATION : getCustomDuration();
    setTimeLeft(newDuration);
    localStorage.removeItem(STORAGE_KEY)
  }

  // Mettre à jour le temps affiché quand les paramètres custom changent
  useEffect(() => {
    if (mode === "custom" && !isRunning && !alarmPlaying) {
      setTimeLeft(getCustomDuration())
    }
  }, [customHours, customMinutes, mode])


  return (
    <div className="timer-section">
      <h2>Minuteur</h2>

      <div className="mode-select">
        <label>
          <input
            type="radio"
            value="pomodoro"
            checked={mode === "pomodoro"}
            onChange={() => {
              setMode("pomodoro")
              resetTimer()
            }}
          />
          Pomodoro (25/5)
        </label>
        <label>
          <input
            type="radio"
            value="custom"
            checked={mode === "custom"}
            onChange={() => {
              setMode("custom")
              resetTimer()
            }}
          />
          Personnalisé
        </label>
      </div>

      {mode === "custom" && (
        <div className="custom-time-input">
          <label>
            Heures :
            <input
              type="number"
              min={0}
              max={12}
              value={customHours}
              onChange={(e) => setCustomHours(parseInt(e.target.value))}
            />
          </label>
          <label>
            Minutes :
            <input
              type="number"
              min={0}
              max={59}
              value={customMinutes}
              onChange={(e) => setCustomMinutes(parseInt(e.target.value))}
            />
          </label>
        </div>
      )}

      <div className="timer-display">
        <h1>{formatTime(timeLeft)}</h1>
        {mode === "pomodoro" && <p>{isBreak ? <>Pause <FaMugHot size={16} /></> : <>Travail <FaLaptopCode size={16} /></>}</p>}
      </div>

      <div className="timer-controls">
        {alarmPlaying ? (
          <button onClick={stopAlarm}>Arrêter l’alarme <FaBellSlash size={16} /></button>
        ) : isRunning ? (
          <button onClick={() => setIsRunning(false)}>Pause <FaPause size={16} /></button>
        ) : (
          <button onClick={startTimer}>Démarrer <FaPlay size={16} /></button>
        )}
        <button onClick={resetTimer}>Réinitialiser <FaRedo size={16} /></button>
      </div>

      <audio
        ref={alarmRef}
        src="/alarm.mp3"
        preload="auto"
      />
    </div>
  )
}
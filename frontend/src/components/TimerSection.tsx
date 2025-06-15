import { useState, useEffect, useRef } from "react"
import { Play, Pause, RotateCcw, Clock, Coffee, Focus } from "lucide-react"
import "../styles/timer.css"

type TimerMode = 'pomodoro' | 'custom'
type PomodoroPhase = 'work' | 'break'

export default function TimerSection() {
  // États principaux
  const [mode, setMode] = useState<TimerMode>('pomodoro')
  const [isRunning, setIsRunning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes en secondes
  const [customHours, setCustomHours] = useState(0)
  const [customMinutes, setCustomMinutes] = useState(25)
  
  // États spécifiques au Pomodoro
  const [pomodoroPhase, setPomodoroPhase] = useState<PomodoroPhase>('work')
  const [pomodoroCount, setPomodoroCount] = useState(0)
  
  // Références pour les timers et audio
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const alarmIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const alarmTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  
  // États pour l'alarme
  const [isAlarmRinging, setIsAlarmRinging] = useState(false)
  
  // Configuration Pomodoro
  const WORK_TIME = 25 * 60 // 25 minutes
  const BREAK_TIME = 5 * 60 // 5 minutes

  // Initialisation de l'audio context
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  // Fonction pour créer un son d'alarme
  const createAlarmSound = () => {
    if (!audioContextRef.current) return

    const oscillator = audioContextRef.current.createOscillator()
    const gainNode = audioContextRef.current.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContextRef.current.destination)
    
    // Son d'alarme plus aigu et urgent
    oscillator.frequency.setValueAtTime(1000, audioContextRef.current.currentTime)
    oscillator.frequency.setValueAtTime(800, audioContextRef.current.currentTime + 0.3)
    oscillator.frequency.setValueAtTime(1000, audioContextRef.current.currentTime + 0.6)
    oscillator.type = 'square'
    
    gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime)
    gainNode.gain.linearRampToValueAtTime(0.4, audioContextRef.current.currentTime + 0.1)
    gainNode.gain.linearRampToValueAtTime(0.1, audioContextRef.current.currentTime + 0.5)
    gainNode.gain.linearRampToValueAtTime(0.4, audioContextRef.current.currentTime + 0.7)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 1)
    
    oscillator.start(audioContextRef.current.currentTime)
    oscillator.stop(audioContextRef.current.currentTime + 1)
  }

  // Démarrer l'alarme persistante
  const startAlarm = () => {
    setIsAlarmRinging(true)
    
    // Jouer le son immédiatement
    createAlarmSound()
    
    // Répéter le son toutes les 2 secondes
    alarmIntervalRef.current = setInterval(() => {
      createAlarmSound()
    }, 2000)
    
    // Arrêter automatiquement après 1 minute
    alarmTimeoutRef.current = setTimeout(() => {
      stopAlarm()
    }, 60000)
  }

  // Arrêter l'alarme
  const stopAlarm = () => {
    setIsAlarmRinging(false)
    
    if (alarmIntervalRef.current) {
      clearInterval(alarmIntervalRef.current)
      alarmIntervalRef.current = null
    }
    
    if (alarmTimeoutRef.current) {
      clearTimeout(alarmTimeoutRef.current)
      alarmTimeoutRef.current = null
    }
  }

  // Gestion du timer principal
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      handleTimerComplete()
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      stopAlarm() // Nettoyer l'alarme au démontage
    }
  }, [isRunning, timeLeft])

  // Gestion de la fin du timer
  const handleTimerComplete = () => {
    setIsRunning(false)
    
    // Démarrer l'alarme persistante
    startAlarm()
    
    // Notification visuelle
    if (Notification.permission === 'granted') {
      new Notification('🚨 Boostrack Timer - ALARME', {
        body: mode === 'pomodoro' 
          ? (pomodoroPhase === 'work' ? 'Temps de travail terminé ! Prenez une pause.' : 'Pause terminée ! Retour au travail.')
          : 'Session Deep Work terminée !',
        icon: '🚀',
        requireInteraction: true // La notification reste affichée
      })
    }
    
    // Logique spécifique au Pomodoro (mais pas de passage automatique pendant l'alarme)
    if (mode === 'pomodoro') {
      if (pomodoroPhase === 'work') {
        setPomodoroCount(prev => prev + 1)
      }
    }
  }

  // Demander la permission pour les notifications
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  // Actions du timer
  const startTimer = () => {
    // Arrêter l'alarme si elle sonne
    if (isAlarmRinging) {
      stopAlarm()
      
      // Si on était en mode Pomodoro, passer à la phase suivante
      if (mode === 'pomodoro') {
        if (pomodoroPhase === 'work') {
          setPomodoroPhase('break')
          setTimeLeft(BREAK_TIME)
        } else {
          setPomodoroPhase('work')
          setTimeLeft(WORK_TIME)
        }
      }
    }
    
    setIsRunning(true)
  }

  const pauseTimer = () => {
    setIsRunning(false)
  }

  const resetTimer = () => {
    setIsRunning(false)
    stopAlarm() // Arrêter l'alarme si elle sonne
    
    if (mode === 'pomodoro') {
      setPomodoroPhase('work') // Retour au mode travail
      setTimeLeft(WORK_TIME)
    } else {
      setTimeLeft((customHours * 60 + customMinutes) * 60)
    }
  }

  const switchMode = (newMode: TimerMode) => {
    setMode(newMode)
    setIsRunning(false)
    stopAlarm() // Arrêter l'alarme si elle sonne
    
    if (newMode === 'pomodoro') {
      setPomodoroPhase('work')
      setTimeLeft(WORK_TIME)
    } else {
      setTimeLeft((customHours * 60 + customMinutes) * 60)
    }
  }

  const updateCustomTime = (hours: number, minutes: number) => {
    setCustomHours(hours)
    setCustomMinutes(minutes)
    if (mode === 'custom' && !isRunning) {
      setTimeLeft((hours * 60 + minutes) * 60)
    }
  }

  const setQuickTime = (totalMinutes: number) => {
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    updateCustomTime(hours, minutes)
  }

  // Formatage du temps
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="timer-section">
      <div className="timer-header">
        <h2>Minuteur de Productivité</h2>
      </div>

      {/* Sélection du mode */}
      <div className="mode-selector">
        <button 
          className={`mode-btn ${mode === 'pomodoro' ? 'active' : ''}`}
          onClick={() => switchMode('pomodoro')}
        >
          <Clock size={18} />
          Pomodoro
        </button>
        <button 
          className={`mode-btn ${mode === 'custom' ? 'active' : ''}`}
          onClick={() => switchMode('custom')}
        >
          <Focus size={18} />
          Deep Work
        </button>
      </div>

      {/* Affichage du timer principal */}
      <div className="timer-display">
        <div className={`timer-circle ${isRunning ? 'running' : ''} ${isAlarmRinging ? 'alarm-ringing' : ''} ${mode === 'pomodoro' && pomodoroPhase === 'break' ? 'break-mode' : ''}`}>
          <div className="timer-time">
            {formatTime(timeLeft)}
          </div>
          <div className="timer-label">
            {isAlarmRinging 
              ? '🚨 ALARME !'
              : mode === 'pomodoro' 
                ? (pomodoroPhase === 'work' ? 'Travail' : 'Pause')
                : 'Deep Work'
            }
          </div>
        </div>
        
        {/* Bouton d'arrêt d'alarme */}
        {isAlarmRinging && (
          <button 
            className="stop-alarm-btn"
            onClick={stopAlarm}
          >
            🔇 Arrêter l'alarme
          </button>
        )}
      </div>

      {/* Informations Pomodoro */}
      {mode === 'pomodoro' && (
        <div className="pomodoro-info">
          <div className="pomodoro-counter">
            <Coffee size={16} />
            <span>Sessions complétées : {pomodoroCount}</span>
          </div>
          <div className="phase-indicator">
            <span className={`phase-dot ${pomodoroPhase === 'work' ? 'active' : ''}`}>Travail</span>
            <span className={`phase-dot ${pomodoroPhase === 'break' ? 'active' : ''}`}>Pause</span>
          </div>
        </div>
      )}

      {/* Contrôles du timer */}
      <div className="timer-controls">
        <button 
          className="control-btn reset-btn"
          onClick={resetTimer}
        >
          <RotateCcw size={20} />
          Reset
        </button>
        
        <button 
          className={`control-btn primary-btn ${isRunning ? 'pause' : 'start'} ${isAlarmRinging ? 'alarm-mode' : ''}`}
          onClick={isRunning ? pauseTimer : startTimer}
        >
          {isAlarmRinging 
            ? <>🔔 Commencer la suite</>
            : isRunning 
              ? <><Pause size={24} /> Pause</> 
              : <><Play size={24} /> Start</>
          }
        </button>
      </div>

      {/* Configuration du temps personnalisé */}
      {mode === 'custom' && (
        <div className="custom-time-config">
          <h3>⏰ Configurer la durée</h3>
          
          <div className="time-inputs">
            <div className="time-input-group">
              <label>Heures</label>
              <input
                type="number"
                min="0"
                max="12"
                value={customHours}
                onChange={(e) => updateCustomTime(parseInt(e.target.value) || 0, customMinutes)}
                disabled={isRunning}
              />
            </div>
            <div className="time-separator">:</div>
            <div className="time-input-group">
              <label>Minutes</label>
              <input
                type="number"
                min="0"
                max="59"
                value={customMinutes}
                onChange={(e) => updateCustomTime(customHours, parseInt(e.target.value) || 0)}
                disabled={isRunning}
              />
            </div>
          </div>
          
          <div className="quick-presets">
            <h4>🚀 Presets Deep Work</h4>
            <div className="preset-grid">
              <button onClick={() => setQuickTime(25)} disabled={isRunning}>25min</button>
              <button onClick={() => setQuickTime(45)} disabled={isRunning}>45min</button>
              <button onClick={() => setQuickTime(90)} disabled={isRunning}>1h30</button>
              <button onClick={() => setQuickTime(120)} disabled={isRunning}>2h</button>
              <button onClick={() => setQuickTime(180)} disabled={isRunning}>3h</button>
              <button onClick={() => setQuickTime(240)} disabled={isRunning}>4h</button>
            </div>
          </div>
        </div>
      )}

      {/* Conseils d'utilisation */}
      <div className="timer-tips">
        <h4>💡 Conseils</h4>
        <ul>
          <li><strong>Pomodoro :</strong> Cycles automatiques 25min travail → 5min pause</li>
          <li><strong>Deep Work :</strong> Sessions longues pour concentration maximale (1h30-4h)</li>
          <li>Activez les notifications pour être alerté à la fin de chaque session</li>
        </ul>
      </div>
    </div>
  )
}
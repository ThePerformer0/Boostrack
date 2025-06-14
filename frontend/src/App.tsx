import { useEffect, useState } from 'react'

function App() {
  const [message, setMessage] = useState("Chargement...")

  useEffect(() => {
    fetch("http://127.0.0.1:8000/") // URL FastAPI locale
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => setMessage("Erreur de connexion " + err.message))
  }, [])

  return (
    <div>
      <h1>Boostrack 🚀</h1>
      <p>{message}</p>
    </div>
  )
}

export default App

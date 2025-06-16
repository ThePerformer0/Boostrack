# 🚀 Boostrack – Votre Compagnon de Productivité Personnel

Boostrack est une application de productivité personnelle multiplateforme conçue pour les développeurs, étudiants et entrepreneurs. Elle vous aide à rester organisé, concentré et à suivre vos progrès grâce à une interface intuitive et des fonctionnalités essentielles.

## ✨ Fonctionnalités

Boostrack propose les outils suivants pour optimiser votre productivité quotidienne :

* **✅ Gestion de Tâches :** Créez, gérez et marquez vos tâches comme terminées.
    * *Voir [image de la section Tâches] (./docs/tasks_section.png)*
* **📝 Prise de Notes :** Capturez vos idées et informations importantes avec un système de notes simple et efficace.
    * *Voir [image de la section Notes] (./docs/notes_section.png)*
* **⏱️ Minuteur de Travail :** Intégrez la méthode Pomodoro (par défaut, mais paramétrable) pour des sessions de travail focalisées et des pauses régulières.
    * *Voir [image de la section Minuteur] (./docs/timer_section.png)*
* **📊 Statistiques d'Usage :** Obtenez un aperçu de votre productivité avec des statistiques sur les tâches complétées et le temps de travail.
    * *Voir [image de la section Statistiques] (./docs/stats_section.png)*

## 🎨 Design et Expérience Utilisateur

Boostrack se distingue par son interface épurée, professionnelle et dynamique. Les couleurs douces et les icônes conviviales contribuent à une expérience utilisateur agréable, pensée pour une utilisation quotidienne sans effort.

* *Voir [image de l'interface globale] (./docs/overall_interface.png)*

## 🧱 Architecture du Projet

Le projet Boostrack est structuré en deux parties principales : un frontend React.js et un backend Python, communiquant via une API REST. Les données sont stockées localement dans une base de données SQLite.

```
Boostrack/
├── frontend/           # Application React.js
│   ├── public/         # Fichiers statiques
│   └── src/            # Code source React
│       ├── components/ # Composants React (TasksSection, NotesSection, etc.)
│       ├── services/   # Services d'API pour interagir avec le backend
│       └── styles/     # Fichiers CSS pour le stylisme
├── backend/            # API Python (FastAPI)
│   ├── main.py         # Point d'entrée de l'API
│   ├── db/             # Configuration de la base de données (SQLite)
│   │   └── db.py
│   ├── models/         # Définitions des modèles de données (SQLModel)
│   │   ├── note_model.py
│   │   ├── task_model.py
│   │   └── work_session_model.py
│   └── routes/         # Définition des endpoints de l'API (FastAPI)
│       ├── note_routes.py
│       ├── task_routes.py
│       └── work_session_routes.py
├── installer/          # Fichiers pour le packaging (Windows & Linux)
├── README.md           # Ce fichier
└── LICENSE             # Licence du projet
```

## 🛠️ Technologies Utilisées

* **Frontend :** `React.js`
* **Backend :** `Python` avec `FastAPI`
* **Base de Données :** `SQLite` (via `SQLModel`)

## ⚙️ Installation et Lancement

Pour lancer Boostrack localement, suivez les étapes ci-dessous.

### Prérequis

* `Node.js` et `npm` (ou `yarn`) pour le frontend.
* `Python 3.8+` et `pip` pour le backend.

### Backend

1.  **Naviguez vers le dossier backend :**
    ```bash
    cd Boostrack/backend
    ```
2.  **Créez et activez un environnement virtuel (recommandé) :**
    ```bash
    python -m venv venv
    # Sur Windows
    .\venv\Scripts\activate
    # Sur macOS/Linux
    source venv/bin/activate
    ```
3.  **Installez les dépendances Python :**
    ```bash
    pip install -r requirements.txt
    ```
    
4.  **Lancez le serveur FastAPI :**
    ```bash
    uvicorn main:app --reload
    ```
    Le backend sera disponible sur `http://127.0.0.1:8000`.

### Frontend

1.  **Ouvrez un nouveau terminal et naviguez vers le dossier frontend :**
    ```bash
    cd Boostrack/frontend
    ```
2.  **Installez les dépendances Node.js :**
    ```bash
    npm install
    # ou yarn install
    ```
3.  **Lancez l'application React :**
    ```bash
    npm run dev
    # ou yarn dev
    ```
    L'application frontend sera généralement disponible sur `http://localhost:5173`.

## 📦 Packaging (pour les futures versions)

La version initiale ne comprend pas d'installeurs pré-packagés. Cependant, la feuille de route prévoit la création d'installateurs pour Windows (.exe) et Linux (.AppImage ou .deb) pour une expérience utilisateur simplifiée.

## 🛣️ Feuille de Route (Perspectives d'évolution)

Nous avons de grandes ambitions pour Boostrack ! Voici quelques fonctionnalités prévues pour les futures versions :

* **Notifications programmées :** Rappels pour les tâches et les sessions de travail.
* **Multi-utilisateur :** Prise en charge de plusieurs profils utilisateurs.
* **Synchronisation cloud :** Sauvegarde et synchronisation des données sur différents appareils.
* **Export/Import de fichiers :** Possibilité d'exporter vos données (notes, tâches, sessions) et de les importer.
* **Dashboard avancé avec IA d'analyse de productivité :** Des analyses plus approfondies de vos habitudes de travail pour des conseils personnalisés.

## 🤝 Contribution

Boostrack est un projet open-source. Les contributions sont les bienvenues ! Si vous souhaitez contribuer, veuillez forker le dépôt, créer une nouvelle branche et soumettre une Pull Request.

## 👨‍💻 À Propos du Développeur

Boostrack est le fruit du travail de **"The Performer"**, passionné par la productivité et les outils efficaces.

---

*Ce README sera mis à jour au fur et à mesure de l'évolution du projet.*
# Port d'Arcachon — Application mobile

Application mobile React Native / Expo pour les plaisanciers du Port d'Arcachon.  
Météo, marées, plan du port, services et espace plaisancier en un seul endroit.

---

## Aperçu

| Accueil | Météo | Marées |
|---------|-------|--------|
| Widget météo + marée en temps réel | Carte météo gradient, compas animé | Graphique sinusoïdal ±24h scrollable |

---

## Fonctionnalités

### 🌤 Météo
- Conditions actuelles : température, vent, rafales, direction, état de la mer
- Prévisions 7 jours
- Compas du vent animé (spin + stabilisation au chargement)
- Hauteur des vagues (Open-Meteo Marine API)
- Unités configurables : nœuds / km/h / mph / m/s — °C / °F — m / ft

### 🌊 Marées
- Données temps réel via **api-maree.fr** (Port d'Arcachon)
- Calcul des coefficients de marée (ratio PM/BM, référence Arcachon 4.4 m)
- Graphique SVG scrollable ±24h, centré sur l'heure actuelle
- Interpolation cosinus (oscillateur harmonique) entre chaque extrême
- Prochaine marée (haute/basse) avec compte à rebours

### 🗺 Plan du port
- Carte interactive centrée sur le port (react-native-maps)
- Localisation des pontons

### 📋 Services & Actualités
- Informations capitainerie (VHF, téléphone, email)
- Raccourcis rapides (plan, marées, services, urgences)
- Actualités du port

### 👤 Espace plaisancier
- Connexion / déconnexion (Zustand persist)
- Dashboard avec informations de l'anneau
- Profil utilisateur

### ⚙️ Paramètres
- Unités de mesure (vent, température, vagues) via sélecteurs inline
- Notifications push (marées, météo, alertes, quotidien) — désactivées en Expo Go
- Persistance via AsyncStorage

### 🔔 Notifications push *(dev build uniquement)*
- Rappel 30 min avant chaque marée haute
- Alerte vent fort / tempête
- Prévision quotidienne à 7h00
- Navigation directe vers l'écran concerné au tap

---

## Stack technique

| Catégorie | Technologie |
|-----------|-------------|
| Framework | React Native 0.81 + Expo SDK 54 |
| Navigation | Expo Router v6 (file-based) |
| État global | Zustand 5 + AsyncStorage persist |
| Data fetching | TanStack Query v5 |
| Animations | React Native Animated API |
| Graphiques | react-native-svg 15 |
| Gradients | expo-linear-gradient |
| Cartes | react-native-maps |
| Notifications | expo-notifications ~0.32 |
| Langage | TypeScript strict |

---

## APIs externes

| API | Usage | Auth |
|-----|-------|------|
| [Open-Meteo](https://open-meteo.com) | Météo actuelle + prévisions 7j | Gratuite, sans clé |
| [Open-Meteo Marine](https://marine-api.open-meteo.com) | Hauteur / direction / période des vagues | Gratuite, sans clé |
| [api-maree.fr](https://api-maree.fr) | Données de marées Port d'Arcachon | Clé API requise |

---

## Installation

### Prérequis

- Node.js ≥ 18
- npm ≥ 9
- Expo Go (Android / iOS) pour le développement rapide
- Android Studio / Xcode pour un dev build complet

### Cloner et installer

```bash
git clone https://github.com/<ton-user>/port-arcachon.git
cd port-arcachon
npm install --legacy-peer-deps
```

### Variables d'environnement

Crée un fichier `.env` à la racine :

```env
EXPO_PUBLIC_MAREE_API_KEY=ta_cle_api_maree
```

> Obtenir une clé sur [api-maree.fr](https://api-maree.fr) (inscription gratuite).

### Lancer l'application

```bash
# Démarrer le serveur Metro
npx expo start

# Ou directement sur Android
npx expo start --android

# Ou sur iOS
npx expo start --ios
```

Scanner le QR code avec **Expo Go** sur votre téléphone.

---

## Dev build (fonctionnalités complètes)

Certaines fonctionnalités (notifications push, react-native-reanimated) nécessitent un dev build :

```bash
# Android
npx expo run:android

# iOS
npx expo run:ios
```

---

## Structure du projet

```
port-arcachon/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx          # Accueil
│   │   ├── meteo.tsx          # Météo & Marées
│   │   ├── port.tsx           # Plan du port
│   │   ├── services.tsx       # Services
│   │   ├── actualites.tsx     # Actualités
│   │   └── _layout.tsx        # Header avec logo, compte, paramètres
│   ├── portail/
│   │   ├── login.tsx          # Connexion plaisancier
│   │   └── dashboard.tsx      # Espace plaisancier
│   ├── parametres.tsx         # Paramètres
│   ├── urgences.tsx           # Urgences
│   └── _layout.tsx            # Root layout
├── components/
│   ├── meteo/
│   │   ├── MeteoCard.tsx      # Carte météo (gradient sombre)
│   │   ├── WindGauge.tsx      # Compas animé
│   │   ├── TideChart.tsx      # Graphique marées SVG
│   │   ├── PrevisionJour.tsx  # Prévision jour (scroll horizontal)
│   │   └── ProchaineMaree.tsx # Prochaine marée (gradient)
│   └── ui/
│       ├── Card.tsx           # Carte blanche avec ombre
│       ├── GradientCard.tsx   # Carte avec LinearGradient
│       ├── FadeInView.tsx     # Animation d'entrée (fade + slide)
│       ├── Skeleton.tsx       # Shimmer loader
│       └── ...
├── constants/
│   ├── Colors.ts              # Palette (#1A3059 navy)
│   ├── Config.ts              # URLs API, coordonnées, seuils
│   ├── Spacing.ts             # Échelle d'espacement
│   └── Typography.ts         # Styles de texte
├── hooks/
│   ├── useMeteo.ts            # TanStack Query météo
│   ├── useMarees.ts           # TanStack Query marées
│   └── useNotifications.ts   # Init notifications
├── services/
│   ├── meteoApi.ts            # Fetch Open-Meteo (météo + marine)
│   ├── mareesApi.ts           # Fetch api-maree.fr + calcul coefficients
│   └── notificationsService.ts # Planification notifications
├── store/
│   ├── settingsStore.ts       # Paramètres utilisateur (Zustand persist)
│   └── userStore.ts           # Session plaisancier (Zustand persist)
├── types/                     # Types TypeScript partagés
├── utils/                     # Helpers (meteo, marees, formatage)
└── assets/
    └── images/logo.png        # Logo officiel Port d'Arcachon
```

---

## Design

- **Couleur principale** : `#1A3059` (bleu marine du logo)
- **Gradients** : cartes météo et marées en dégradé diagonal
- **Animations** : fade-in étagé au chargement des écrans, compas avec spin + stabilisation
- **Graphique marées** : courbe SVG sinusoïdale (interpolation cosinus), scrollable ±24h
- **Compatibilité** : Expo Go (développement) + dev build (production complète)

---

## Roadmap

- [ ] Coordonnées GPS réelles des pontons
- [ ] Données actualités depuis un backend réel
- [ ] Réservation de place / gestion d'anneau
- [ ] Météo marine étendue (courants, houle)
- [ ] Widget iOS/Android écran d'accueil

---

## Licence

Projet privé — Port d'Arcachon © 2026

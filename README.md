# Port d'Arcachon — Application mobile

> Application React Native / Expo pour les plaisanciers du Port d'Arcachon.  
> Météo temps réel, marées, plan interactif et espace plaisancier.

[![React Native](https://img.shields.io/badge/React_Native-0.81-61DAFB?logo=react)](https://reactnative.dev)
[![Expo SDK](https://img.shields.io/badge/Expo-SDK_54-000020?logo=expo)](https://expo.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org)

---

## Points techniques notables

### Fetch de données & state management

- **TanStack Query v5** pour le fetching, le cache, le refetch automatique et les états de chargement
- Deux hooks custom (`useMeteo`, `useMarees`) encapsulant les requêtes avec gestion d'erreur
- **Zustand v5** avec middleware `persist` (AsyncStorage) pour les préférences utilisateur — sélecteurs individuels pour éviter les re-renders infinis
- Requêtes **parallèles** : météo standard + API marine exécutées simultanément avec `Promise.all`, merge des résultats côté service

### Traitement des données de marées

- Consommation de l'API **api-maree.fr** (série temporelle toutes les 10 min sur 4 jours)
- Algorithme de **détection des extrema locaux** (fenêtre glissante ±6 points = ±1h) pour identifier PM/BM
- **Calcul du coefficient de marée** : `round((PM - BM) / 4.4 * 95)` basé sur l'amplitude de référence d'Arcachon, plafonné entre 20 et 120
- **Interpolation cosinus** entre chaque extrême (oscillateur harmonique), avec points virtuels aux bornes pour couvrir la plage 0h–24h sans artefacts aux extrémités
- Fallback sur données mockées si absence de clé API

### Graphique de marées

- Courbe **SVG** (react-native-svg) avec remplissage dégradé, 288 points interpolés (1 point/5 min)
- Affichage **±24h** scrollable en combinant plusieurs jours de données dans une timeline absolue
- Centrage automatique sur l'heure actuelle via `onLayout` (évite le `setTimeout` approximatif)
- Calcul du `nowMinutes` **timezone-safe** : `(now - midnight_local) / 60000` plutôt que `getHours()` qui peut retourner UTC

### Animations

- **Compas** : séquence 3 phases avec `Animated.sequence` — accélération (`Easing.in`), décélération avec dépassement (`Easing.out`), rebond spring. Interpolation sur plage `[0, 7200]deg` pour compatibilité native driver Android (extrapolate non fiable)
- **Skeleton shimmer** : `LinearGradient` transparent → blanc → transparent translateX en boucle avec `Animated.timing`
- **FadeInView** : fade + translateY avec `Easing.out(Easing.cubic)`, délais étagés pour effet cascade au chargement
- **Gradients** : `expo-linear-gradient` sur les cartes météo, marées, boutons — dégradés diagonaux avec transparence

### Architecture & navigation

- **Expo Router v6** (file-based routing) : navigation par structure de fichiers `app/(tabs)/`, routes modales, layout partagé
- **Header universel** : logo centré, compte plaisancier (initiales + anneau), icône paramètres — appliqués via `screenOptions` sur toutes les tabs
- Composants UI réutilisables : `Card`, `GradientCard`, `Skeleton`, `FadeInView`, `SectionHeader`, `Badge`
- Barrel exports via `index.ts` sur chaque dossier

### Compatibilité Expo Go / dev build

- Détection de l'environnement via `Constants.executionEnvironment` — toutes les fonctions `expo-notifications` sont des no-ops silencieux sous Expo Go (SDK 53 a supprimé les push dans Expo Go)
- `react-native-svg` et `expo-linear-gradient` : versions exactes alignées sur le `bundledNativeModules.json` d'Expo SDK 54

---

## Stack

| Catégorie | Technologie |
|-----------|-------------|
| Framework | React Native 0.81 + Expo SDK 54 |
| Navigation | Expo Router v6 (file-based) |
| State | Zustand 5 + AsyncStorage persist |
| Data fetching | TanStack Query v5 |
| Animations | React Native Animated API |
| Graphiques | react-native-svg 15 |
| Gradients | expo-linear-gradient |
| Cartes | react-native-maps |
| Notifications | expo-notifications ~0.32 |
| Langage | TypeScript strict |

---

## APIs

| API | Usage | Auth |
|-----|-------|------|
| [Open-Meteo](https://open-meteo.com) | Météo actuelle + prévisions 7j | Gratuite |
| [Open-Meteo Marine](https://marine-api.open-meteo.com) | Hauteur / direction / période des vagues | Gratuite |
| [api-maree.fr](https://api-maree.fr) | Marées Port d'Arcachon | Clé API |

---

## Installation

```bash
git clone https://github.com/<user>/port-arcachon.git
cd port-arcachon
npm install --legacy-peer-deps
```

Créer un `.env` à la racine :

```env
EXPO_PUBLIC_MAREE_API_KEY=ta_cle_api_maree
```

```bash
npx expo start
```

> Les notifications push et react-native-reanimated nécessitent un dev build : `npx expo run:android`

---

## Structure

```
app/
├── (tabs)/          # Accueil, Météo, Port, Services, Actualités
├── portail/         # Login + Dashboard plaisancier
├── parametres.tsx
└── urgences.tsx
components/
├── meteo/           # MeteoCard, WindGauge, TideChart, PrevisionJour…
└── ui/              # Card, GradientCard, Skeleton, FadeInView…
services/            # meteoApi, mareesApi, notificationsService
hooks/               # useMeteo, useMarees, useNotifications
store/               # settingsStore, userStore (Zustand)
constants/           # Colors, Config, Spacing, Typography
```

---

## Auteur

**Jolann** — [github.com/\<user\>](https://github.com)

# Port d'Arcachon — Application Mobile
# Instructions pour Claude Code

## Vue d'ensemble du projet
Refonte complète de l'application mobile officielle du Port d'Arcachon.
L'appli actuelle (Port Arcachon Officiel par Alizée-Soft) existe sur iOS et Android
mais souffre d'un design daté et d'une UX limitée.

Public cible : plaisanciers, propriétaires de bateaux, usagers du port.

### Fonctionnalités à refaire en mieux
- Météo en temps réel (vent, vagues, température)
- Horaires des marées
- Actualités du port et de la capitainerie
- Portail plaisanciers (accès compte client)
- Webcams du port
- Plan du port interactif
- Numéros utiles et infos pratiques
- Accès sanitaires et cale de mise à l'eau
- Notifications push

### Nouvelles fonctionnalités à ajouter
- Carte interactive des pontons avec numérotation des anneaux
- Réservation d'anneau directement depuis l'appli
- Journal de bord simplifié
- Alertes météo personnalisées (seuils de vent configurables)
- Mode hors ligne pour les infos critiques (marées, plan)

---

## Stack technique
- **Framework** : React Native + Expo SDK 51
- **Langage** : TypeScript strict
- **Navigation** : Expo Router (file-based routing, comme Next.js)
- **State management** : Zustand (léger, simple)
- **Requêtes API** : TanStack Query (React Query)
- **Styles** : StyleSheet React Native + design tokens custom
- **Animations** : React Native Reanimated 3
- **Icônes** : @expo/vector-icons (Ionicons)
- **Cartes** : react-native-maps
- **Notifications** : expo-notifications
- **Stockage local** : expo-secure-store + AsyncStorage
- **Météo API** : Open-Meteo (gratuite, pas de clé API requise)
- **Marées API** : SHOM (Service Hydrographique de la Marine)

---

## Design system

### Palette de couleurs — Port d'Arcachon
```typescript
export const Colors = {
  // Primaires
  ocean:        '#0A4F7A',   // Bleu océan profond — couleur principale
  oceanDark:    '#063554',   // Bleu nuit, header, status bar
  oceanLight:   '#E6F3FA',   // Bleu ciel pâle, fonds de cards
  oceanMid:     '#2A7FAF',   // Bleu intermédiaire, icônes actives

  // Accents
  sand:         '#E8C97A',   // Sable doré — accent chaud
  sandLight:    '#FDF6E3',   // Sable clair, fonds alternatifs
  coral:        '#E8614A',   // Corail — alertes, urgences

  // Neutres
  white:        '#FFFFFF',
  gray50:       '#F8F9FA',   // Fond général
  gray100:      '#EAECEF',   // Séparateurs
  gray300:      '#C4CBD4',   // Bordures
  gray500:      '#7A8A96',   // Texte secondaire
  gray900:      '#1A2530',   // Texte principal

  // Sémantiques
  success:      '#2E7D32',
  warning:      '#ED6C02',
  danger:       '#D32F2F',
  info:         '#0288D1',
}
```

### Typographie
```typescript
export const Typography = {
  // Titres — SF Pro Display / Roboto selon plateforme
  h1: { fontSize: 28, fontWeight: '700', lineHeight: 34 },
  h2: { fontSize: 22, fontWeight: '600', lineHeight: 28 },
  h3: { fontSize: 18, fontWeight: '600', lineHeight: 24 },

  // Corps
  body:   { fontSize: 16, fontWeight: '400', lineHeight: 24 },
  bodyMd: { fontSize: 14, fontWeight: '400', lineHeight: 20 },
  bodySm: { fontSize: 12, fontWeight: '400', lineHeight: 16 },

  // Labels
  label:  { fontSize: 11, fontWeight: '600', letterSpacing: 0.8, textTransform: 'uppercase' },
  caption:{ fontSize: 12, fontWeight: '400' },
}
```

### Espacements
```typescript
export const Spacing = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
  xxl: 48,
}
```

### Composants visuels
- Cards : borderRadius 16, background white, shadow légère iOS / elevation Android
- Boutons primaires : background ocean, borderRadius 12, height 52
- Boutons secondaires : border 1.5px ocean, background transparent, borderRadius 12
- Bottom tabs : fond blanc, icône active ocean, badge notification coral
- Header : fond oceanDark, texte blanc, status bar light

---

## Structure des dossiers

```
port-arcachon/
├── app/                          # Expo Router — file-based routing
│   ├── _layout.tsx               # Root layout, providers, navigation
│   ├── (tabs)/                   # Tab navigation principale
│   │   ├── _layout.tsx           # Config bottom tabs
│   │   ├── index.tsx             # Accueil / Dashboard
│   │   ├── meteo.tsx             # Météo & Marées
│   │   ├── port.tsx              # Plan du port & pontons
│   │   ├── services.tsx          # Services & infos pratiques
│   │   └── actualites.tsx        # News & notifications
│   ├── portail/
│   │   ├── _layout.tsx
│   │   ├── login.tsx             # Connexion compte plaisancier
│   │   └── dashboard.tsx         # Espace client
│   ├── urgences.tsx              # Numéros d'urgence (accessible sans connexion)
│   └── parametres.tsx            # Paramètres & alertes
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx             # Ex: "Vent fort", "Marée haute"
│   │   ├── InfoRow.tsx           # Ligne label + valeur
│   │   ├── SectionHeader.tsx
│   │   └── LoadingState.tsx
│   ├── meteo/
│   │   ├── MeteoCard.tsx         # Carte météo principale
│   │   ├── WindGauge.tsx         # Jauge de vent animée
│   │   ├── TideChart.tsx         # Graphique des marées
│   │   └── AlertBanner.tsx       # Bannière alerte météo
│   ├── port/
│   │   ├── PortMap.tsx           # Carte interactive du port
│   │   ├── PontonInfo.tsx        # Infos d'un ponton
│   │   └── WebcamViewer.tsx      # Visionneuse webcam
│   └── actualites/
│       ├── NewsCard.tsx
│       └── NotificationItem.tsx
├── store/
│   ├── meteoStore.ts             # Zustand — état météo
│   ├── userStore.ts              # Zustand — utilisateur connecté
│   └── alertStore.ts             # Zustand — préférences alertes
├── hooks/
│   ├── useMeteo.ts               # TanStack Query — fetch météo
│   ├── useMarees.ts              # TanStack Query — fetch marées
│   └── useActualites.ts          # TanStack Query — fetch news
├── services/
│   ├── meteoApi.ts               # Calls Open-Meteo API
│   ├── mareesApi.ts              # Calls SHOM API
│   └── portApi.ts                # Calls API Port d'Arcachon
├── constants/
│   ├── Colors.ts
│   ├── Typography.ts
│   ├── Spacing.ts
│   └── Config.ts                 # URLs API, coords GPS port
├── types/
│   ├── meteo.ts
│   ├── maree.ts
│   └── actualite.ts
├── assets/
│   ├── images/
│   └── icons/
├── CLAUDE.md
├── app.json                      # Config Expo
└── package.json
```

---

## Écrans en détail

### (tabs)/index.tsx — Dashboard Accueil
- Header : logo Port d'Arcachon + icône notifications
- Widget météo résumé : température, vent, état de la mer
- Prochaine marée (haute ou basse) avec countdown
- 4 raccourcis rapides : Plan, Capitainerie, Webcam, Urgences
- Dernières actualités (2-3 cards)
- Bouton accès portail plaisancier

### (tabs)/meteo.tsx — Météo & Marées
- Météo actuelle : température, vent (nœuds + direction), rafales, visibilité
- WindGauge animé (rose des vents)
- Prévisions 7 jours (scroll horizontal)
- TideChart : courbe de marée sur 24h avec coefficients
- Tableau marées J+3

### (tabs)/port.tsx — Plan du port
- Carte interactive react-native-maps centrée sur le port
- Pontons numérotés avec tap pour infos
- Couche webcams (pins cliquables)
- Filtres : pontons / services / accès eau-carburant

### (tabs)/services.tsx — Services
- Capitainerie : horaires, téléphone, VHF canal
- Sanitaires : localisation + code d'accès (si connecté)
- Cale de mise à l'eau : disponibilité
- Avitaillement : carburant, eau, électricité
- Numéros utiles : SNSM, CROSS Étel, Météo France Marine

### (tabs)/actualites.tsx — Actualités
- Flux news du port (JSON/RSS)
- Historique notifications reçues
- Filtres : Capitainerie / Travaux / Événements

---

## Conventions de code

### Composants
```typescript
// Toujours typer les props avec interface
interface MeteoCardProps {
  temperature: number
  windSpeed: number
  windDirection: number
  condition: 'calm' | 'moderate' | 'strong' | 'storm'
}

export default function MeteoCard({
  temperature,
  windSpeed,
  windDirection,
  condition,
}: MeteoCardProps) {
  // ...
}
```

### Styles
```typescript
// Toujours utiliser StyleSheet.create, jamais de styles inline complexes
// Utiliser les tokens depuis constants/
import { Colors, Spacing, Typography } from '@/constants'

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: Spacing.md,
  },
  title: {
    ...Typography.h3,
    color: Colors.gray900,
  },
})
```

### Hooks de données
```typescript
// Pattern standard TanStack Query
export function useMeteo() {
  return useQuery({
    queryKey: ['meteo', 'arcachon'],
    queryFn: () => fetchMeteoArcachon(),
    staleTime: 1000 * 60 * 10,  // 10 minutes
    retry: 2,
  })
}
```

### Navigation Expo Router
```typescript
// Navigation entre écrans
import { router } from 'expo-router'
router.push('/portail/login')
router.back()

// Liens déclaratifs
import { Link } from 'expo-router'
<Link href="/urgences">Urgences</Link>
```

---

## Coordonnées GPS du port d'Arcachon
```typescript
export const PORT_ARCACHON = {
  latitude:  44.6635,
  longitude: -1.1673,
  latitudeDelta:  0.01,
  longitudeDelta: 0.01,
}
```

---

## APIs à intégrer

### Open-Meteo (météo — gratuit, sans clé)
```
GET https://api.open-meteo.com/v1/forecast
  ?latitude=44.6635
  &longitude=-1.1673
  &current=temperature_2m,wind_speed_10m,wind_direction_10m,wind_gusts_10m
  &hourly=wave_height,wave_direction
  &wind_speed_unit=kn
  &timezone=Europe/Paris
```

### SHOM — Marées
```
GET https://services.data.shom.fr/hdm/visu/portchoice
Port de référence : Arcachon (code 0222A)
```

---

## Ce qu'il ne faut jamais faire
- Pas de `any` TypeScript
- Pas de styles inline complexes (uniquement les tokens)
- Pas de `console.log` laissés en production
- Pas de logique métier dans les composants UI
- Pas de fetch direct dans les composants — toujours via hooks
- Pas de secrets/clés API dans le code source — utiliser `.env`
- Pas de composants > 150 lignes — découper
- Jamais hardcoder les coordonnées GPS ailleurs que dans Config.ts

---

## Commandes utiles
```bash
npx expo start          # Démarrer l'appli (QR code Expo Go)
npx expo start --ios    # Simulateur iOS
npx expo start --android # Simulateur Android
npx expo build          # Build de production
npx tsc --noEmit        # Vérification TypeScript
```

---

## Checklist avant chaque composant
- [ ] Props typées avec interface
- [ ] Styles via StyleSheet.create + tokens
- [ ] États de chargement et d'erreur gérés
- [ ] Fonctionne sur iOS ET Android (tester les deux)
- [ ] Accessible : labels accessibilityLabel sur les éléments interactifs
- [ ] Mode hors ligne géré pour les données critiques (marées, plan)

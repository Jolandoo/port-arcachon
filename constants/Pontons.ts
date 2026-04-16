import type { LatLng } from 'react-native-maps'

export type PontonType = 'plaisance' | 'visiteur' | 'pro' | 'service' | 'acces'

export interface Ponton {
  id: string
  label: string
  description: string
  type: PontonType
  coordinate: LatLng
}

// Coordonnées approximatives des pontons du Port d'Arcachon
export const PONTONS: Ponton[] = [
  {
    id: 'capitainerie',
    label: 'Capitainerie',
    description: 'Quai Goslar — VHF Canal 9',
    type: 'service',
    coordinate: { latitude: 44.6635, longitude: -1.1673 },
  },
  {
    id: 'ponton-a',
    label: 'Ponton A',
    description: 'Plaisanciers résidents',
    type: 'plaisance',
    coordinate: { latitude: 44.6642, longitude: -1.1668 },
  },
  {
    id: 'ponton-b',
    label: 'Ponton B',
    description: 'Accueil visiteurs',
    type: 'visiteur',
    coordinate: { latitude: 44.6628, longitude: -1.1661 },
  },
  {
    id: 'ponton-c',
    label: 'Ponton C',
    description: 'Plaisanciers résidents',
    type: 'plaisance',
    coordinate: { latitude: 44.6620, longitude: -1.1678 },
  },
  {
    id: 'ponton-pro',
    label: 'Ponton Pro',
    description: 'Bateaux professionnels',
    type: 'pro',
    coordinate: { latitude: 44.6648, longitude: -1.1685 },
  },
  {
    id: 'station-service',
    label: 'Station service',
    description: 'Carburant, eau, électricité',
    type: 'service',
    coordinate: { latitude: 44.6625, longitude: -1.1655 },
  },
  {
    id: 'cale',
    label: 'Cale de mise à l\'eau',
    description: 'Accès gratuit pour résidents',
    type: 'acces',
    coordinate: { latitude: 44.6652, longitude: -1.1660 },
  },
  {
    id: 'manutention',
    label: 'Manutention',
    description: 'Grue 35T — Port à sec',
    type: 'service',
    coordinate: { latitude: 44.6655, longitude: -1.1695 },
  },
]

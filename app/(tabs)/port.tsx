import { useState, useRef } from 'react'
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Linking } from 'react-native'
import MapView, { Marker, Callout, PROVIDER_DEFAULT } from 'react-native-maps'
import { Ionicons } from '@expo/vector-icons'
import { Colors, Spacing, Typography } from '@/constants'
import { PORT_ARCACHON } from '@/constants'
import { PONTONS, type Ponton, type PontonType } from '@/constants/Pontons'

// ── Couleur par type ──────────────────────────────────────────────────────────
const TYPE_COLOR: Record<PontonType, string> = {
  plaisance: Colors.ocean,
  visiteur:  Colors.info,
  pro:       Colors.warning,
  service:   Colors.success,
  acces:     Colors.sand,
}

const TYPE_ICON: Record<PontonType, React.ComponentProps<typeof Ionicons>['name']> = {
  plaisance: 'boat',
  visiteur:  'people',
  pro:       'briefcase',
  service:   'build',
  acces:     'arrow-down',
}

// ── Filtre ────────────────────────────────────────────────────────────────────
const FILTRES: { label: string; value: PontonType | 'all' }[] = [
  { label: 'Tous', value: 'all' },
  { label: 'Plaisance', value: 'plaisance' },
  { label: 'Visiteurs', value: 'visiteur' },
  { label: 'Services', value: 'service' },
  { label: 'Accès', value: 'acces' },
]

// ── Composant marker callout ──────────────────────────────────────────────────
function PontonCallout({ ponton }: { ponton: Ponton }) {
  return (
    <View style={styles.callout}>
      <Text style={styles.calloutTitle}>{ponton.label}</Text>
      <Text style={styles.calloutDesc}>{ponton.description}</Text>
    </View>
  )
}

// ── Écran principal ───────────────────────────────────────────────────────────
export default function PortScreen() {
  const [filtre, setFiltre] = useState<PontonType | 'all'>('all')
  const mapRef = useRef<MapView>(null)

  const pontonsFiltres = filtre === 'all'
    ? PONTONS
    : PONTONS.filter((p) => p.type === filtre)

  function recentrer() {
    mapRef.current?.animateToRegion({
      latitude:      PORT_ARCACHON.latitude,
      longitude:     PORT_ARCACHON.longitude,
      latitudeDelta:  PORT_ARCACHON.latitudeDelta,
      longitudeDelta: PORT_ARCACHON.longitudeDelta,
    }, 600)
  }

  return (
    <View style={styles.container}>
      {/* ── Carte ── */}
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={{
          latitude:      PORT_ARCACHON.latitude,
          longitude:     PORT_ARCACHON.longitude,
          latitudeDelta:  PORT_ARCACHON.latitudeDelta,
          longitudeDelta: PORT_ARCACHON.longitudeDelta,
        }}
        showsUserLocation
        showsCompass
      >
        {pontonsFiltres.map((p) => (
          <Marker
            key={p.id}
            coordinate={p.coordinate}
            pinColor={TYPE_COLOR[p.type]}
          >
            <Callout tooltip>
              <PontonCallout ponton={p} />
            </Callout>
          </Marker>
        ))}
      </MapView>

      {/* ── Bouton recentrer ── */}
      <TouchableOpacity style={styles.recentrerBtn} onPress={recentrer} accessibilityLabel="Recentrer la carte">
        <Ionicons name="locate" size={22} color={Colors.ocean} />
      </TouchableOpacity>

      {/* ── Bouton webcams ── */}
      <TouchableOpacity
        style={styles.webcamBtn}
        onPress={() => Linking.openURL('https://www.port-arcachon.fr/cameras/')}
        accessibilityLabel="Voir les webcams"
      >
        <Ionicons name="videocam" size={18} color={Colors.white} />
        <Text style={styles.webcamLabel}>Webcams</Text>
      </TouchableOpacity>

      {/* ── Filtres ── */}
      <View style={styles.filtresContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtres}>
          {FILTRES.map((f) => (
            <TouchableOpacity
              key={f.value}
              style={[styles.filtrePill, filtre === f.value && styles.filtrePillActive]}
              onPress={() => setFiltre(f.value)}
            >
              <Text style={[styles.filtreLabel, filtre === f.value && styles.filtreLabelActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ── Légende ── */}
      <View style={styles.legende}>
        {(Object.entries(TYPE_COLOR) as [PontonType, string][]).map(([type, color]) => (
          <View key={type} style={styles.legendeItem}>
            <View style={[styles.legendeDot, { backgroundColor: color }]} />
            <Text style={styles.legendeLabel}>{type}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },

  // Recentrer
  recentrerBtn: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: 12,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.gray900,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },

  // Webcams
  webcamBtn: {
    position: 'absolute',
    top: Spacing.md,
    left: Spacing.md,
    backgroundColor: Colors.ocean,
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    shadowColor: Colors.gray900,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  webcamLabel: { ...Typography.bodyMd, color: Colors.white, fontWeight: '600' },

  // Filtres
  filtresContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
  },
  filtres: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  filtrePill: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.gray100,
    elevation: 2,
  },
  filtrePillActive: {
    backgroundColor: Colors.ocean,
    borderColor: Colors.ocean,
  },
  filtreLabel: { ...Typography.bodyMd, color: Colors.gray900, fontWeight: '500' },
  filtreLabelActive: { color: Colors.white },

  // Légende
  legende: {
    position: 'absolute',
    bottom: Spacing.md,
    left: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.sm,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    maxWidth: 260,
    elevation: 3,
  },
  legendeItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendeDot: { width: 8, height: 8, borderRadius: 4 },
  legendeLabel: { ...Typography.bodySm, color: Colors.gray500, textTransform: 'capitalize' },

  // Callout
  callout: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: Spacing.sm,
    minWidth: 140,
    shadowColor: Colors.gray900,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  calloutTitle: { ...Typography.bodyMd, fontWeight: '700', color: Colors.gray900 },
  calloutDesc: { ...Typography.bodySm, color: Colors.gray500, marginTop: 2 },
})

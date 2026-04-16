import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Colors, Spacing, Typography } from '@/constants'

interface NumeroUrgence {
  label: string
  numero: string
  description: string
  icon: React.ComponentProps<typeof Ionicons>['name']
  color: string
  priority?: boolean
}

const NUMEROS: NumeroUrgence[] = [
  {
    label: 'CROSS Étel',
    numero: '196',
    description: 'Sauvetage en mer — numéro national',
    icon: 'boat',
    color: Colors.danger,
    priority: true,
  },
  {
    label: 'SNSM Arcachon',
    numero: '05 57 72 27 68',
    description: 'Station locale de sauvetage',
    icon: 'navigate-circle',
    color: Colors.coral,
    priority: true,
  },
  {
    label: 'CROSS Étel (fixe)',
    numero: '02 97 55 35 35',
    description: 'Coordination sauvetage maritime',
    icon: 'radio',
    color: Colors.ocean,
  },
  {
    label: 'Capitainerie',
    numero: '08 90 71 17 33',
    description: 'Port d\'Arcachon — 15 cts/mn',
    icon: 'business',
    color: Colors.oceanMid,
  },
  {
    label: 'SAMU',
    numero: '15',
    description: 'Urgences médicales',
    icon: 'medkit',
    color: Colors.danger,
  },
  {
    label: 'Pompiers',
    numero: '18',
    description: 'Secours et incendie',
    icon: 'flame',
    color: Colors.coral,
  },
  {
    label: 'Police / Gendarmerie',
    numero: '17',
    description: 'Sécurité publique',
    icon: 'shield',
    color: Colors.gray500,
  },
  {
    label: 'Numéro européen',
    numero: '112',
    description: 'Urgences depuis mobile',
    icon: 'call',
    color: Colors.info,
  },
]

function UrgenceCard({ item }: { item: NumeroUrgence }) {
  return (
    <TouchableOpacity
      style={[styles.card, item.priority && styles.cardPriority]}
      activeOpacity={0.75}
      onPress={() => Linking.openURL(`tel:${item.numero.replace(/\s/g, '')}`)}
      accessibilityLabel={`Appeler ${item.label}`}
      accessibilityRole="button"
    >
      <View style={[styles.iconBox, { backgroundColor: item.color + '18' }]}>
        <Ionicons name={item.icon} size={28} color={item.color} />
      </View>
      <View style={styles.info}>
        <Text style={styles.label}>{item.label}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
      <View style={styles.right}>
        <Text style={[styles.numero, { color: item.color }]}>{item.numero}</Text>
        <Ionicons name="call" size={16} color={item.color} />
      </View>
    </TouchableOpacity>
  )
}

export default function UrgencesScreen() {
  const priority = NUMEROS.filter((n) => n.priority)
  const secondary = NUMEROS.filter((n) => !n.priority)

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      {/* Bannière */}
      <View style={styles.banner}>
        <Ionicons name="warning" size={24} color={Colors.white} />
        <Text style={styles.bannerText}>
          En mer, VHF canal 16 en priorité.{'\n'}Signalez position + nombre de personnes.
        </Text>
      </View>

      {/* Numéros prioritaires */}
      <Text style={styles.sectionTitle}>Sauvetage en mer</Text>
      {priority.map((n) => <UrgenceCard key={n.numero} item={n} />)}

      {/* Autres numéros */}
      <Text style={styles.sectionTitle}>Autres urgences</Text>
      {secondary.map((n) => <UrgenceCard key={n.numero} item={n} />)}

      <View style={styles.bottomPad} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scroll: { backgroundColor: Colors.gray50 },
  content: { padding: Spacing.md },

  banner: {
    backgroundColor: Colors.danger,
    borderRadius: 14,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  bannerText: {
    ...Typography.bodyMd,
    color: Colors.white,
    flex: 1,
    lineHeight: 20,
  },

  sectionTitle: {
    ...Typography.h3,
    color: Colors.gray900,
    marginBottom: Spacing.sm,
    marginTop: Spacing.xs,
  },

  card: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  cardPriority: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.danger,
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1 },
  label: {
    ...Typography.bodyMd,
    fontWeight: '600',
    color: Colors.gray900,
  },
  description: {
    ...Typography.bodySm,
    color: Colors.gray500,
    marginTop: 2,
  },
  right: {
    alignItems: 'flex-end',
    gap: 4,
  },
  numero: {
    fontSize: 16,
    fontWeight: '700',
  },
  bottomPad: { height: Spacing.xxl },
})

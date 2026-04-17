import { ScrollView, View, Text, TouchableOpacity, Switch, StyleSheet, Linking, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Colors, Spacing, Typography, CAPITAINERIE } from '@/constants'
import { useSettingsStore, type WindUnit, type TempUnit, type WaveUnit } from '@/store/settingsStore'

// ── Types ─────────────────────────────────────────────────────────────────────
interface ToggleRowProps {
  icon: React.ComponentProps<typeof Ionicons>['name']
  iconColor: string
  label: string
  sub?: string
  value: boolean
  onChange: (v: boolean) => void
  last?: boolean
}

interface LinkRowProps {
  icon: React.ComponentProps<typeof Ionicons>['name']
  iconColor: string
  label: string
  sub?: string
  onPress: () => void
  last?: boolean
  destructive?: boolean
}

interface SelectOption<T extends string> {
  label: string
  value: T
}

interface SelectRowProps<T extends string> {
  icon: React.ComponentProps<typeof Ionicons>['name']
  iconColor: string
  label: string
  value: T
  options: SelectOption<T>[]
  onChange: (v: T) => void
  last?: boolean
}

// ── Composants lignes ─────────────────────────────────────────────────────────
function ToggleRow({ icon, iconColor, label, sub, value, onChange, last }: ToggleRowProps) {
  return (
    <View style={[styles.row, !last && styles.rowBorder]}>
      <View style={[styles.rowIcon, { backgroundColor: iconColor + '18' }]}>
        <Ionicons name={icon} size={18} color={iconColor} />
      </View>
      <View style={styles.rowText}>
        <Text style={styles.rowLabel}>{label}</Text>
        {sub && <Text style={styles.rowSub}>{sub}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: Colors.gray100, true: Colors.ocean + '80' }}
        thumbColor={value ? Colors.ocean : Colors.gray300}
      />
    </View>
  )
}

function SelectRow<T extends string>({ icon, iconColor, label, value, options, onChange, last }: SelectRowProps<T>) {
  return (
    <View style={[styles.selectRow, !last && styles.rowBorder]}>
      <View style={styles.selectTop}>
        <View style={[styles.rowIcon, { backgroundColor: iconColor + '18' }]}>
          <Ionicons name={icon} size={18} color={iconColor} />
        </View>
        <Text style={styles.rowLabel}>{label}</Text>
      </View>
      <View style={styles.selectOptions}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt.value}
            style={[styles.selectOpt, opt.value === value && styles.selectOptActive]}
            onPress={() => onChange(opt.value)}
            activeOpacity={0.7}
          >
            <Text style={[styles.selectOptLabel, opt.value === value && styles.selectOptLabelActive]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}

function LinkRow({ icon, iconColor, label, sub, onPress, last, destructive }: LinkRowProps) {
  return (
    <TouchableOpacity style={[styles.row, !last && styles.rowBorder]} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.rowIcon, { backgroundColor: iconColor + '18' }]}>
        <Ionicons name={icon} size={18} color={iconColor} />
      </View>
      <View style={styles.rowText}>
        <Text style={[styles.rowLabel, destructive && { color: Colors.danger }]}>{label}</Text>
        {sub && <Text style={styles.rowSub}>{sub}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={16} color={Colors.gray300} />
    </TouchableOpacity>
  )
}

function SectionTitle({ title }: { title: string }) {
  return <Text style={styles.sectionTitle}>{title}</Text>
}

function Card({ children }: { children: React.ReactNode }) {
  return <View style={styles.card}>{children}</View>
}

// ── Écran ─────────────────────────────────────────────────────────────────────
export default function ParametresScreen() {
  const {
    notifMeteo,    setNotifMeteo,
    notifMarees,   setNotifMarees,
    notifActus,    setNotifActus,
    notifUrgences, setNotifUrgences,
    windUnit,      setWindUnit,
    tempUnit,      setTempUnit,
    waveUnit,      setWaveUnit,
    reset,
  } = useSettingsStore()

  function handleAbout() {
    Alert.alert(
      'Port d\'Arcachon',
      'Version 1.0.0\n\nApplication officielle du Port d\'Arcachon.\nDéveloppée pour les plaisanciers résidents et visiteurs.\n\n© 2025 Port d\'Arcachon',
      [{ text: 'Fermer' }],
    )
  }

  function handleReset() {
    Alert.alert(
      'Réinitialiser',
      'Toutes vos préférences seront remises à zéro.',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Réinitialiser', style: 'destructive', onPress: reset },
      ],
    )
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

      {/* ── Notifications ── */}
      <SectionTitle title="Notifications" />
      <Card>
        <ToggleRow
          icon="warning"
          iconColor={Colors.danger}
          label="Alertes météo"
          sub="Vent fort, tempête, visibilité"
          value={notifUrgences}
          onChange={setNotifUrgences}
        />
        <ToggleRow
          icon="partly-sunny"
          iconColor={Colors.ocean}
          label="Prévisions météo"
          sub="Chaque matin à 7h"
          value={notifMeteo}
          onChange={setNotifMeteo}
        />
        <ToggleRow
          icon="water"
          iconColor={Colors.oceanMid}
          label="Marées"
          sub="Rappel 30 min avant marée haute"
          value={notifMarees}
          onChange={setNotifMarees}
        />
        <ToggleRow
          icon="newspaper"
          iconColor={Colors.sand}
          label="Actualités port"
          sub="Nouvelles et événements"
          value={notifActus}
          onChange={setNotifActus}
          last
        />
      </Card>

      {/* ── Affichage ── */}
      <SectionTitle title="Affichage" />
      <Card>
        <SelectRow<WindUnit>
          icon="speedometer"
          iconColor={Colors.oceanMid}
          label="Unité de vent"
          value={windUnit}
          options={[
            { label: 'Nœuds (kt)', value: 'kt'  },
            { label: 'km/h',       value: 'kmh' },
            { label: 'mph',        value: 'mph' },
            { label: 'm/s',        value: 'ms'  },
          ]}
          onChange={setWindUnit}
        />
        <SelectRow<TempUnit>
          icon="thermometer"
          iconColor={Colors.coral}
          label="Unité de température"
          value={tempUnit}
          options={[
            { label: 'Celsius (°C)',    value: 'C' },
            { label: 'Fahrenheit (°F)', value: 'F' },
          ]}
          onChange={setTempUnit}
        />
        <SelectRow<WaveUnit>
          icon="water"
          iconColor={Colors.oceanMid}
          label="Hauteur des vagues"
          value={waveUnit}
          options={[
            { label: 'Mètres (m)', value: 'm'  },
            { label: 'Pieds (ft)', value: 'ft' },
          ]}
          onChange={setWaveUnit}
          last
        />
      </Card>

      {/* ── Contact ── */}
      <SectionTitle title="Contact & aide" />
      <Card>
        <LinkRow
          icon="call"
          iconColor={Colors.ocean}
          label="Appeler la capitainerie"
          sub={CAPITAINERIE.telPlaisanciers}
          onPress={() => Linking.openURL(`tel:${CAPITAINERIE.telPlaisanciers.replace(/\s/g, '')}`)}
        />
        <LinkRow
          icon="mail"
          iconColor={Colors.oceanMid}
          label="Email capitainerie"
          sub={CAPITAINERIE.email}
          onPress={() => Linking.openURL(`mailto:${CAPITAINERIE.email}`)}
        />
        <LinkRow
          icon="globe"
          iconColor={Colors.info}
          label="Site officiel du port"
          sub="www.port-arcachon.fr"
          onPress={() => Linking.openURL('https://www.port-arcachon.fr')}
          last
        />
      </Card>

      {/* ── Légal ── */}
      <SectionTitle title="Informations" />
      <Card>
        <LinkRow
          icon="shield-checkmark"
          iconColor={Colors.success}
          label="Politique de confidentialité"
          onPress={() => Linking.openURL('https://www.port-arcachon.fr/confidentialite')}
        />
        <LinkRow
          icon="document-text"
          iconColor={Colors.gray500}
          label="Mentions légales"
          onPress={() => Linking.openURL('https://www.port-arcachon.fr/mentions-legales')}
        />
        <LinkRow
          icon="information-circle"
          iconColor={Colors.ocean}
          label="À propos"
          sub="Version 1.0.0"
          onPress={handleAbout}
          last
        />
      </Card>

      {/* ── Reset ── */}
      <SectionTitle title="Réinitialisation" />
      <Card>
        <LinkRow
          icon="refresh"
          iconColor={Colors.danger}
          label="Réinitialiser les préférences"
          sub="Remet tous les réglages par défaut"
          onPress={handleReset}
          destructive
          last
        />
      </Card>

      {/* Footer */}
      <View style={styles.footer}>
        <Ionicons name="boat" size={20} color={Colors.gray300} />
        <Text style={styles.footerText}>Port d'Arcachon © 2025</Text>
      </View>

      <View style={styles.bottomPad} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scroll: { backgroundColor: Colors.gray50 },
  content: { padding: Spacing.md },

  sectionTitle: {
    ...Typography.label,
    color: Colors.gray500,
    textTransform: 'uppercase',
    marginBottom: Spacing.xs,
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },

  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginBottom: Spacing.sm,
    overflow: 'hidden',
    shadowColor: Colors.gray900,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    minHeight: 56,
  },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.gray100 },
  rowIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  rowText: { flex: 1 },
  rowLabel: { ...Typography.bodyMd, fontWeight: '600', color: Colors.gray900 },
  rowSub:   { ...Typography.bodySm, color: Colors.gray500, marginTop: 2 },

  selectRow:   { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm },
  selectTop:   { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  selectOptions: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap', marginBottom: Spacing.xs },
  selectOpt:   { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: 8, borderWidth: 1.5, borderColor: Colors.gray100, backgroundColor: Colors.gray50 },
  selectOptActive: { borderColor: Colors.ocean, backgroundColor: Colors.ocean },
  selectOptLabel: { ...Typography.bodyMd, color: Colors.gray500, fontWeight: '500' },
  selectOptLabelActive: { color: Colors.white, fontWeight: '700' },

  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.xs, marginTop: Spacing.md },
  footerText: { ...Typography.bodySm, color: Colors.gray300 },

  bottomPad: { height: Spacing.xxl },
})

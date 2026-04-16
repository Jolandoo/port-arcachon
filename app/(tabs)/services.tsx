import { useState } from 'react'
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Colors, Spacing, Typography, CAPITAINERIE } from '@/constants'
import { Card, SectionHeader, InfoRow, Badge } from '@/components/ui'

// ── Sous-onglets capitainerie ─────────────────────────────────────────────────
type CapTab = 'capitainerie' | 'manutention' | 'port-a-sec'

const CAP_TABS: { id: CapTab; label: string }[] = [
  { id: 'capitainerie', label: 'Capitainerie' },
  { id: 'manutention',  label: 'Manutention' },
  { id: 'port-a-sec',   label: 'Port à sec' },
]

const CAP_DATA: Record<CapTab, { tel: string; vhf: string; horaires: string[] }> = {
  'capitainerie': {
    tel: CAPITAINERIE.telPlaisanciers,
    vhf: 'Canal 9',
    horaires: ['Jan–Mar : 8h30–12h / 13h30–17h', 'Avr–Jun : 8h–12h / 13h30–18h', 'Jul–Aoû : 7h30–20h (non-stop)', 'Sep–Déc : 8h30–12h / 13h30–17h'],
  },
  'manutention': {
    tel: CAPITAINERIE.telManutention,
    vhf: 'Canal 9',
    horaires: ['Jan–Mar : 8h–12h / 13h30–17h', 'Avr–Jun : 8h–12h / 13h–18h', 'Jul–Aoû : 7h30–19h', 'Sep–Déc : 8h–12h / 13h30–17h'],
  },
  'port-a-sec': {
    tel: CAPITAINERIE.telManutention,
    vhf: 'Canal 9',
    horaires: ['Jan–Mar : 8h–12h / 13h30–17h', 'Avr–Jun : 8h–18h', 'Jul–Aoû : 7h30–19h', 'Sep–Déc : 8h–12h / 13h30–17h'],
  },
}

// ── Services portuaires ───────────────────────────────────────────────────────
interface ServiceItem {
  icon: React.ComponentProps<typeof Ionicons>['name']
  label: string
  detail: string
  dispo: boolean
}

const SERVICES_PORTUAIRES: ServiceItem[] = [
  { icon: 'flash',      label: 'Électricité',        detail: '220V — bornes sur pontons',    dispo: true },
  { icon: 'water',      label: 'Eau potable',         detail: 'Disponible sur tous pontons',  dispo: true },
  { icon: 'flame',      label: 'Carburant',           detail: 'Station flot — Quai Sud',      dispo: true },
  { icon: 'person',     label: 'Sanitaires',          detail: 'Code accès sur demande',       dispo: true },
  { icon: 'trash',      label: 'Déchetterie',         detail: 'Huiles, batteries, déchets',   dispo: true },
  { icon: 'wifi',       label: 'Wi-Fi',               detail: 'Réseau Port_Arcachon (gratuit)', dispo: true },
  { icon: 'arrow-down', label: 'Cale mise à l\'eau',  detail: 'Accès résidents — gratuit',    dispo: true },
  { icon: 'construct',  label: 'Grue 35T',            detail: 'Sur réservation capitainerie', dispo: false },
]

// ── Numéros utiles ────────────────────────────────────────────────────────────
const NUMEROS_UTILES = [
  { label: 'CROSS Étel',         numero: '196',            icon: 'boat' as const },
  { label: 'Météo France Marine', numero: '0892 68 08 33', icon: 'partly-sunny' as const },
  { label: 'SNSM Arcachon',      numero: '05 57 72 27 68', icon: 'navigate-circle' as const },
  { label: 'Gendarmerie maritime', numero: '17',           icon: 'shield' as const },
]

// ── Écran ─────────────────────────────────────────────────────────────────────
export default function ServicesScreen() {
  const [capTab, setCapTab] = useState<CapTab>('capitainerie')
  const cap = CAP_DATA[capTab]

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

      {/* ── Capitainerie ── */}
      <SectionHeader title="Capitainerie" />

      {/* Sous-onglets */}
      <View style={styles.tabs}>
        {CAP_TABS.map((t) => (
          <TouchableOpacity
            key={t.id}
            style={[styles.tab, capTab === t.id && styles.tabActive]}
            onPress={() => setCapTab(t.id)}
          >
            <Text style={[styles.tabLabel, capTab === t.id && styles.tabLabelActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Card>
        <InfoRow label="VHF" value={cap.vhf} />
        <InfoRow label="Téléphone" value={cap.tel} />
        <InfoRow label="Email" value={CAPITAINERIE.email} />
        <InfoRow label="Adresse" value={CAPITAINERIE.adresse} last />
      </Card>

      <View style={styles.gap} />

      {/* Horaires */}
      <Card>
        <Text style={styles.horairesTitle}>Horaires saisonniers</Text>
        {cap.horaires.map((h, i) => (
          <View key={i} style={[styles.horaireRow, i > 0 && styles.horaireBorder]}>
            <Ionicons name="time-outline" size={14} color={Colors.gray500} />
            <Text style={styles.horaireText}>{h}</Text>
          </View>
        ))}
      </Card>

      {/* Boutons contact */}
      <View style={styles.contactRow}>
        <TouchableOpacity style={styles.contactBtn} onPress={() => Linking.openURL(`tel:${cap.tel}`)}>
          <Ionicons name="call" size={18} color={Colors.white} />
          <Text style={styles.contactLabel}>Appeler</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.contactBtn, styles.contactBtnSec]} onPress={() => Linking.openURL(`mailto:${CAPITAINERIE.email}`)}>
          <Ionicons name="mail" size={18} color={Colors.ocean} />
          <Text style={[styles.contactLabel, { color: Colors.ocean }]}>Email</Text>
        </TouchableOpacity>
      </View>

      {/* ── Services portuaires ── */}
      <SectionHeader title="Services portuaires" />
      <Card>
        {SERVICES_PORTUAIRES.map((s, i) => (
          <View key={s.label} style={[styles.serviceRow, i > 0 && styles.serviceBorder]}>
            <View style={styles.serviceIcon}>
              <Ionicons name={s.icon} size={18} color={s.dispo ? Colors.ocean : Colors.gray300} />
            </View>
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceLabel}>{s.label}</Text>
              <Text style={styles.serviceDetail}>{s.detail}</Text>
            </View>
            <Badge label={s.dispo ? 'Dispo' : 'Indispo'} type={s.dispo ? 'success' : 'default'} />
          </View>
        ))}
      </Card>

      {/* ── Numéros utiles ── */}
      <SectionHeader title="Numéros utiles" />
      <Card>
        {NUMEROS_UTILES.map((n, i) => (
          <TouchableOpacity
            key={n.label}
            style={[styles.numeroRow, i > 0 && styles.numeroBorder]}
            onPress={() => Linking.openURL(`tel:${n.numero.replace(/\s/g, '')}`)}
          >
            <Ionicons name={n.icon} size={18} color={Colors.ocean} />
            <Text style={styles.numeroLabel}>{n.label}</Text>
            <Text style={styles.numeroVal}>{n.numero}</Text>
            <Ionicons name="call-outline" size={14} color={Colors.gray300} />
          </TouchableOpacity>
        ))}
      </Card>

      <View style={styles.bottomPad} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scroll: { backgroundColor: Colors.gray50 },
  content: { padding: Spacing.md },
  gap: { height: Spacing.sm },

  // Tabs
  tabs: { flexDirection: 'row', backgroundColor: Colors.white, borderRadius: 12, padding: 4, marginBottom: Spacing.sm, borderWidth: 1, borderColor: Colors.gray100 },
  tab: { flex: 1, paddingVertical: Spacing.xs, alignItems: 'center', borderRadius: 8 },
  tabActive: { backgroundColor: Colors.ocean },
  tabLabel: { ...Typography.bodyMd, color: Colors.gray500, fontWeight: '500' },
  tabLabelActive: { color: Colors.white, fontWeight: '600' },

  // Horaires
  horairesTitle: { ...Typography.bodyMd, fontWeight: '700', color: Colors.gray900, marginBottom: Spacing.sm },
  horaireRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, paddingVertical: 6 },
  horaireBorder: { borderTopWidth: 1, borderTopColor: Colors.gray100 },
  horaireText: { ...Typography.bodyMd, color: Colors.gray900, flex: 1 },

  // Contact
  contactRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm, marginBottom: Spacing.lg },
  contactBtn: { flex: 1, backgroundColor: Colors.ocean, borderRadius: 12, height: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.xs },
  contactBtnSec: { backgroundColor: Colors.white, borderWidth: 1.5, borderColor: Colors.ocean },
  contactLabel: { ...Typography.bodyMd, color: Colors.white, fontWeight: '600' },

  // Services
  serviceRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.sm },
  serviceBorder: { borderTopWidth: 1, borderTopColor: Colors.gray100 },
  serviceIcon: { width: 32, alignItems: 'center' },
  serviceInfo: { flex: 1 },
  serviceLabel: { ...Typography.bodyMd, fontWeight: '600', color: Colors.gray900 },
  serviceDetail: { ...Typography.bodySm, color: Colors.gray500 },

  // Numéros
  numeroRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.sm },
  numeroBorder: { borderTopWidth: 1, borderTopColor: Colors.gray100 },
  numeroLabel: { ...Typography.bodyMd, color: Colors.gray900, flex: 1 },
  numeroVal: { ...Typography.bodyMd, fontWeight: '700', color: Colors.ocean },

  bottomPad: { height: Spacing.xxl },
})

import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Colors, Spacing, Typography } from '@/constants'
import { useUserStore } from '@/store/userStore'

// ── Mock données contrat ──────────────────────────────────────────────────────
const CONTRAT_MOCK = {
  numero:       'CTR-2024-00142',
  type:         'Annuel',
  debut:        '01/01/2025',
  fin:          '31/12/2025',
  statut:       'Actif',
  anneau:       'A-14',
  ponton:       'Ponton A',
  longueur:     '9,5 m',
  largeur:      '3,2 m',
  bateau:       'Dufour 310 — CAPELLA',
  immatriculation: 'ARC 1234 B',
}

const FACTURES_MOCK = [
  { id: 'F-2025-003', libelle: 'Redevance T2 2025',     montant: '487,00 €', date: '01/04/2025', statut: 'payée' },
  { id: 'F-2025-002', libelle: 'Redevance T1 2025',     montant: '487,00 €', date: '01/01/2025', statut: 'payée' },
  { id: 'F-2025-001', libelle: 'Assurance port 2025',   montant: '95,00 €',  date: '01/01/2025', statut: 'payée' },
  { id: 'F-2024-004', libelle: 'Redevance T4 2024',     montant: '487,00 €', date: '01/10/2024', statut: 'payée' },
]

const SERVICES_MOCK = [
  { label: 'Manutention grue',   date: '14/03/2025', statut: 'réalisé',  prix: '120,00 €' },
  { label: 'Hivernage port à sec', date: '01/11/2024', statut: 'réalisé', prix: '380,00 €' },
]

// ── Composants ────────────────────────────────────────────────────────────────
function InfoLigne({ label, value, last = false }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.infoLigne, !last && styles.infoLigneBorder]}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  )
}

function FactureRow({ facture, last = false }: {
  facture: typeof FACTURES_MOCK[0]
  last?: boolean
}) {
  return (
    <View style={[styles.factureRow, !last && styles.factureBorder]}>
      <View style={styles.factureLeft}>
        <Text style={styles.factureLibelle}>{facture.libelle}</Text>
        <Text style={styles.factureDate}>{facture.date} — {facture.id}</Text>
      </View>
      <View style={styles.factureRight}>
        <Text style={styles.factureMontant}>{facture.montant}</Text>
        <View style={styles.factureBadge}>
          <Ionicons name="checkmark-circle" size={12} color={Colors.success} />
          <Text style={styles.factureBadgeText}>{facture.statut}</Text>
        </View>
      </View>
    </View>
  )
}

// ── Écran ─────────────────────────────────────────────────────────────────────
export default function DashboardScreen() {
  const { user, clearUser } = useUserStore()

  function handleLogout() {
    Alert.alert(
      'Déconnexion',
      'Voulez-vous vous déconnecter de votre espace plaisancier ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnecter',
          style: 'destructive',
          onPress: () => {
            clearUser()
            router.replace('/(tabs)')
          },
        },
      ],
    )
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

      {/* ── Carte identité ── */}
      <View style={styles.idCard}>
        <View style={styles.idAvatar}>
          <Text style={styles.idInitiales}>
            {user?.nom.split(' ').map((n) => n[0]).join('') ?? 'PL'}
          </Text>
        </View>
        <View style={styles.idInfo}>
          <Text style={styles.idNom}>{user?.nom ?? 'Plaisancier'}</Text>
          <Text style={styles.idEmail}>{user?.email}</Text>
          <View style={styles.idBadge}>
            <Ionicons name="boat-outline" size={12} color={Colors.ocean} />
            <Text style={styles.idBadgeText}>Anneau {CONTRAT_MOCK.anneau} — {CONTRAT_MOCK.ponton}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn} accessibilityLabel="Déconnexion">
          <Ionicons name="log-out-outline" size={22} color={Colors.gray500} />
        </TouchableOpacity>
      </View>

      {/* ── Actions rapides ── */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} activeOpacity={0.75}>
          <View style={[styles.actionIcon, { backgroundColor: Colors.oceanLight }]}>
            <Ionicons name="document-text" size={22} color={Colors.ocean} />
          </View>
          <Text style={styles.actionLabel}>Contrat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} activeOpacity={0.75}>
          <View style={[styles.actionIcon, { backgroundColor: Colors.success + '18' }]}>
            <Ionicons name="receipt" size={22} color={Colors.success} />
          </View>
          <Text style={styles.actionLabel}>Factures</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} activeOpacity={0.75}>
          <View style={[styles.actionIcon, { backgroundColor: Colors.warning + '18' }]}>
            <Ionicons name="construct" size={22} color={Colors.warning} />
          </View>
          <Text style={styles.actionLabel}>Manutention</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} activeOpacity={0.75} onPress={() => router.push('/urgences')}>
          <View style={[styles.actionIcon, { backgroundColor: Colors.danger + '12' }]}>
            <Ionicons name="alert-circle" size={22} color={Colors.danger} />
          </View>
          <Text style={styles.actionLabel}>Urgences</Text>
        </TouchableOpacity>
      </View>

      {/* ── Mon anneau ── */}
      <Text style={styles.sectionTitle}>Mon anneau</Text>
      <View style={styles.card}>
        <View style={styles.anneauHeader}>
          <View style={styles.anneauIconBox}>
            <Ionicons name="boat" size={28} color={Colors.ocean} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.anneauBateau}>{CONTRAT_MOCK.bateau}</Text>
            <Text style={styles.anneauImmat}>{CONTRAT_MOCK.immatriculation}</Text>
          </View>
          <View style={styles.statutBadge}>
            <View style={styles.statutDot} />
            <Text style={styles.statutText}>{CONTRAT_MOCK.statut}</Text>
          </View>
        </View>
        <View style={styles.divider} />
        <InfoLigne label="Anneau" value={`${CONTRAT_MOCK.anneau} — ${CONTRAT_MOCK.ponton}`} />
        <InfoLigne label="Dimensions" value={`${CONTRAT_MOCK.longueur} × ${CONTRAT_MOCK.largeur}`} />
        <InfoLigne label="Contrat" value={`${CONTRAT_MOCK.type} — ${CONTRAT_MOCK.numero}`} />
        <InfoLigne label="Validité" value={`${CONTRAT_MOCK.debut} → ${CONTRAT_MOCK.fin}`} last />
      </View>

      {/* ── Dernières factures ── */}
      <Text style={styles.sectionTitle}>Dernières factures</Text>
      <View style={styles.card}>
        {FACTURES_MOCK.map((f, i) => (
          <FactureRow key={f.id} facture={f} last={i === FACTURES_MOCK.length - 1} />
        ))}
      </View>

      {/* ── Historique services ── */}
      <Text style={styles.sectionTitle}>Services effectués</Text>
      <View style={styles.card}>
        {SERVICES_MOCK.map((s, i) => (
          <View key={s.label} style={[styles.serviceRow, i > 0 && styles.factureBorder]}>
            <Ionicons name="checkmark-done-circle" size={18} color={Colors.success} />
            <View style={{ flex: 1 }}>
              <Text style={styles.serviceLabel}>{s.label}</Text>
              <Text style={styles.serviceDate}>{s.date}</Text>
            </View>
            <Text style={styles.servicePrix}>{s.prix}</Text>
          </View>
        ))}
      </View>

      {/* ── Bouton déconnexion bas ── */}
      <TouchableOpacity style={styles.logoutBtnFull} onPress={handleLogout} activeOpacity={0.8}>
        <Ionicons name="log-out-outline" size={18} color={Colors.gray500} />
        <Text style={styles.logoutLabel}>Se déconnecter</Text>
      </TouchableOpacity>

      <View style={styles.bottomPad} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scroll: { backgroundColor: Colors.gray50 },
  content: { padding: Spacing.md },

  // ID Card
  idCard: {
    backgroundColor: Colors.oceanDark,
    borderRadius: 20, padding: Spacing.md,
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  idAvatar: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: Colors.ocean,
    alignItems: 'center', justifyContent: 'center',
  },
  idInitiales: { ...Typography.h3, color: Colors.white },
  idInfo: { flex: 1 },
  idNom:   { ...Typography.bodyMd, fontWeight: '700', color: Colors.white },
  idEmail: { ...Typography.bodySm, color: Colors.oceanLight, marginTop: 2 },
  idBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    marginTop: Spacing.xs,
    backgroundColor: Colors.white + '18', borderRadius: 20,
    alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3,
  },
  idBadgeText: { ...Typography.bodySm, color: Colors.white, fontWeight: '600' },
  logoutBtn: { padding: Spacing.xs },

  // Actions
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.md },
  actionBtn: { alignItems: 'center', gap: Spacing.xs, flex: 1 },
  actionIcon: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  actionLabel: { ...Typography.bodySm, color: Colors.gray900, textAlign: 'center', fontWeight: '500' },

  // Sections
  sectionTitle: { ...Typography.h3, color: Colors.gray900, marginBottom: Spacing.sm, marginTop: Spacing.xs },

  // Card
  card: {
    backgroundColor: Colors.white, borderRadius: 16,
    padding: Spacing.md, marginBottom: Spacing.md,
    shadowColor: Colors.gray900,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  divider: { height: 1, backgroundColor: Colors.gray100, marginVertical: Spacing.sm },

  // Anneau header
  anneauHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  anneauIconBox: {
    width: 52, height: 52, borderRadius: 14,
    backgroundColor: Colors.oceanLight,
    alignItems: 'center', justifyContent: 'center',
  },
  anneauBateau: { ...Typography.bodyMd, fontWeight: '700', color: Colors.gray900 },
  anneauImmat:  { ...Typography.bodySm, color: Colors.gray500, marginTop: 2 },
  statutBadge:  { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statutDot:    { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.success },
  statutText:   { ...Typography.bodySm, color: Colors.success, fontWeight: '600' },

  // InfoLigne
  infoLigne: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: Spacing.sm },
  infoLigneBorder: { borderBottomWidth: 1, borderBottomColor: Colors.gray100 },
  infoLabel: { ...Typography.bodyMd, color: Colors.gray500 },
  infoValue: { ...Typography.bodyMd, fontWeight: '600', color: Colors.gray900, flex: 1, textAlign: 'right' },

  // Factures
  factureRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.sm },
  factureBorder: { borderTopWidth: 1, borderTopColor: Colors.gray100 },
  factureLeft: { flex: 1 },
  factureLibelle: { ...Typography.bodyMd, fontWeight: '600', color: Colors.gray900 },
  factureDate: { ...Typography.bodySm, color: Colors.gray500, marginTop: 2 },
  factureRight: { alignItems: 'flex-end', gap: 4 },
  factureMontant: { ...Typography.bodyMd, fontWeight: '700', color: Colors.gray900 },
  factureBadge: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  factureBadgeText: { ...Typography.bodySm, color: Colors.success, fontWeight: '600' },

  // Services
  serviceRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.sm },
  serviceLabel: { ...Typography.bodyMd, fontWeight: '600', color: Colors.gray900 },
  serviceDate:  { ...Typography.bodySm, color: Colors.gray500, marginTop: 2 },
  servicePrix:  { ...Typography.bodyMd, fontWeight: '700', color: Colors.ocean },

  // Logout bas
  logoutBtnFull: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: Spacing.xs, paddingVertical: Spacing.md,
    borderWidth: 1, borderColor: Colors.gray100,
    borderRadius: 14, backgroundColor: Colors.white,
  },
  logoutLabel: { ...Typography.bodyMd, color: Colors.gray500, fontWeight: '600' },

  bottomPad: { height: Spacing.xxl },
})

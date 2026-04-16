import { useState } from 'react'
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Colors, Spacing, Typography } from '@/constants'

// ── Types ─────────────────────────────────────────────────────────────────────
type Categorie = 'Tous' | 'Info' | 'Travaux' | 'Événement' | 'Sécurité'

interface Actualite {
  id: string
  titre: string
  resume: string
  contenu: string
  date: string
  categorie: Exclude<Categorie, 'Tous'>
  lu?: boolean
}

// ── Données mock ──────────────────────────────────────────────────────────────
const ACTUALITES: Actualite[] = [
  {
    id: '1',
    titre: 'Nouvelles bornes électriques',
    resume: 'Installation de 12 bornes haute puissance sur le quai Nord.',
    contenu: 'Dans le cadre de la modernisation du port, 12 nouvelles bornes électriques haute puissance (32A) ont été installées sur le quai Nord. Ces bornes sont disponibles dès maintenant pour les plaisanciers résidents. Contactez la capitainerie pour obtenir vos codes d\'accès.',
    date: "Aujourd'hui",
    categorie: 'Info',
  },
  {
    id: '2',
    titre: 'Travaux ponton B — perturbations',
    resume: 'Accès limité au ponton B jusqu\'au 30 avril.',
    contenu: 'Des travaux de rénovation sont en cours sur le ponton B. L\'accès est restreint jusqu\'au 30 avril 2026. Les plaisanciers habituellement amarrés sur ce ponton sont temporairement redirigés vers le ponton C. Merci de votre compréhension.',
    date: 'Il y a 2 jours',
    categorie: 'Travaux',
  },
  {
    id: '3',
    titre: 'Salon Nautique d\'Arcachon 2026',
    resume: 'Le rendez-vous à ne pas manquer cet été au port.',
    contenu: 'Le Salon Nautique d\'Arcachon revient du 18 au 21 juillet 2026. Plus de 80 exposants, démonstrations en mer, initiation à la voile et animations pour toute la famille. Programme complet disponible à la capitainerie.',
    date: 'Il y a 7 jours',
    categorie: 'Événement',
  },
  {
    id: '4',
    titre: 'Alerte météo — Vent fort prévu',
    resume: 'Rafales de 60 km/h annoncées vendredi. Amarrages à vérifier.',
    contenu: 'Météo France annonce des vents forts avec des rafales atteignant 60 km/h vendredi 17 avril. La capitainerie recommande de vérifier vos amarrages et filières avant jeudi soir. En cas de doute, contactez l\'équipe de permanence au VHF canal 9.',
    date: 'Il y a 3 jours',
    categorie: 'Sécurité',
  },
  {
    id: '5',
    titre: 'Nouvelle réglementation zones de mouillage',
    resume: 'Mise à jour des zones autorisées dans le bassin d\'Arcachon.',
    contenu: 'Suite à l\'arrêté préfectoral du 1er avril 2026, les zones de mouillage autorisées dans le bassin ont été mises à jour. Les nouvelles cartes sont disponibles à la capitainerie et sur le site officiel du port. Tout mouillage en dehors des zones autorisées est passible d\'une amende.',
    date: 'Il y a 10 jours',
    categorie: 'Info',
  },
  {
    id: '6',
    titre: 'Journée portes ouvertes SNSM',
    resume: 'La station de sauvetage vous ouvre ses portes le 24 mai.',
    contenu: 'La SNSM d\'Arcachon organise une journée portes ouvertes le samedi 24 mai 2026. Au programme : visite des vedettes de sauvetage, démonstrations de sauvetage en mer, initiation aux gestes de premiers secours. Entrée libre et gratuite de 10h à 17h.',
    date: 'Il y a 12 jours',
    categorie: 'Événement',
  },
  {
    id: '7',
    titre: 'Fermeture station carburant — maintenance',
    resume: 'La station est fermée du 20 au 22 avril pour maintenance annuelle.',
    contenu: 'La station carburant du Quai Sud sera fermée du lundi 20 au mercredi 22 avril pour sa maintenance annuelle obligatoire. La prochaine station la plus proche est à La Teste-de-Buch. Nous vous prions de nous excuser pour la gêne occasionnée.',
    date: 'Il y a 5 jours',
    categorie: 'Travaux',
  },
]

// ── Filtres ───────────────────────────────────────────────────────────────────
const CATEGORIES: Categorie[] = ['Tous', 'Info', 'Travaux', 'Événement', 'Sécurité']

const CAT_COLOR: Record<Exclude<Categorie, 'Tous'>, string> = {
  'Info':      Colors.ocean,
  'Travaux':   Colors.warning,
  'Événement': Colors.success,
  'Sécurité':  Colors.danger,
}

const CAT_ICON: Record<Exclude<Categorie, 'Tous'>, React.ComponentProps<typeof Ionicons>['name']> = {
  'Info':      'information-circle',
  'Travaux':   'construct',
  'Événement': 'calendar',
  'Sécurité':  'warning',
}

// ── Composant card ────────────────────────────────────────────────────────────
function ActuCard({ item, onPress }: { item: Actualite; onPress: () => void }) {
  const color = CAT_COLOR[item.categorie]
  const icon  = CAT_ICON[item.categorie]

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.75} onPress={onPress}>
      <View style={[styles.cardAccent, { backgroundColor: color }]} />
      <View style={styles.cardBody}>
        {/* Catégorie + date */}
        <View style={styles.cardMeta}>
          <View style={[styles.catBadge, { backgroundColor: color + '18' }]}>
            <Ionicons name={icon} size={12} color={color} />
            <Text style={[styles.catLabel, { color }]}>{item.categorie}</Text>
          </View>
          <Text style={styles.cardDate}>{item.date}</Text>
        </View>

        {/* Titre */}
        <Text style={styles.cardTitre} numberOfLines={2}>{item.titre}</Text>

        {/* Résumé */}
        <Text style={styles.cardResume} numberOfLines={2}>{item.resume}</Text>

        {/* Lire la suite */}
        <View style={styles.cardFooter}>
          <Text style={styles.lireSuite}>Lire la suite</Text>
          <Ionicons name="chevron-forward" size={14} color={Colors.ocean} />
        </View>
      </View>
    </TouchableOpacity>
  )
}

// ── Modal détail ──────────────────────────────────────────────────────────────
function ActuDetail({ item, onClose }: { item: Actualite; onClose: () => void }) {
  const color = CAT_COLOR[item.categorie]
  const icon  = CAT_ICON[item.categorie]

  return (
    <View style={styles.modal}>
      {/* Header */}
      <View style={styles.modalHeader}>
        <TouchableOpacity onPress={onClose} style={styles.backBtn} accessibilityLabel="Fermer">
          <Ionicons name="arrow-back" size={22} color={Colors.gray900} />
        </TouchableOpacity>
        <Text style={styles.modalTitle} numberOfLines={1}>Actualité</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView style={styles.modalScroll} contentContainerStyle={styles.modalContent}>
        {/* Badge */}
        <View style={[styles.catBadge, { backgroundColor: color + '18', alignSelf: 'flex-start' }]}>
          <Ionicons name={icon} size={12} color={color} />
          <Text style={[styles.catLabel, { color }]}>{item.categorie}</Text>
        </View>

        <Text style={styles.modalTitre}>{item.titre}</Text>
        <Text style={styles.modalDate}>{item.date}</Text>

        <View style={styles.modalDivider} />

        <Text style={styles.modalContenu}>{item.contenu}</Text>
      </ScrollView>
    </View>
  )
}

// ── Écran ─────────────────────────────────────────────────────────────────────
export default function ActualitesScreen() {
  const [filtre, setFiltre]   = useState<Categorie>('Tous')
  const [selected, setSelected] = useState<Actualite | null>(null)

  const filtered = filtre === 'Tous'
    ? ACTUALITES
    : ACTUALITES.filter((a) => a.categorie === filtre)

  if (selected) {
    return <ActuDetail item={selected} onClose={() => setSelected(null)} />
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

      {/* Filtres */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtres}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.filtrePill, filtre === cat && styles.filtrePillActive]}
            onPress={() => setFiltre(cat)}
          >
            {cat !== 'Tous' && (
              <Ionicons
                name={CAT_ICON[cat as Exclude<Categorie, 'Tous'>]}
                size={12}
                color={filtre === cat ? Colors.white : CAT_COLOR[cat as Exclude<Categorie, 'Tous'>]}
              />
            )}
            <Text style={[styles.filtreLabel, filtre === cat && styles.filtreLabelActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Compteur */}
      <Text style={styles.compteur}>
        {filtered.length} {filtered.length > 1 ? 'actualités' : 'actualité'}
      </Text>

      {/* Liste */}
      {filtered.map((item) => (
        <ActuCard key={item.id} item={item} onPress={() => setSelected(item)} />
      ))}

      <View style={styles.bottomPad} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scroll: { backgroundColor: Colors.gray50 },
  content: { padding: Spacing.md },

  // Filtres
  filtres: { gap: Spacing.xs, paddingBottom: Spacing.sm },
  filtrePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.white,
    borderRadius: 20,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.gray100,
  },
  filtrePillActive: { backgroundColor: Colors.ocean, borderColor: Colors.ocean },
  filtreLabel: { ...Typography.bodySm, color: Colors.gray500, fontWeight: '500' },
  filtreLabelActive: { color: Colors.white },

  // Compteur
  compteur: { ...Typography.bodySm, color: Colors.gray500, marginBottom: Spacing.sm },

  // Card
  card: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    marginBottom: Spacing.sm,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: Colors.gray900,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardAccent: { width: 4 },
  cardBody: { flex: 1, padding: Spacing.md },
  cardMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  catBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 },
  catLabel: { ...Typography.bodySm, fontWeight: '600' },
  cardDate: { ...Typography.bodySm, color: Colors.gray300 },
  cardTitre: { ...Typography.bodyMd, fontWeight: '700', color: Colors.gray900, marginBottom: 4 },
  cardResume: { ...Typography.bodySm, color: Colors.gray500, lineHeight: 18 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.sm, gap: 2 },
  lireSuite: { ...Typography.bodySm, color: Colors.ocean, fontWeight: '600' },

  // Modal
  modal: { flex: 1, backgroundColor: Colors.gray50 },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  backBtn: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  modalTitle: { ...Typography.bodyMd, fontWeight: '700', color: Colors.gray900, flex: 1, textAlign: 'center' },
  modalScroll: { flex: 1 },
  modalContent: { padding: Spacing.md },
  modalTitre: { ...Typography.h2, color: Colors.gray900, marginTop: Spacing.sm, marginBottom: 4 },
  modalDate: { ...Typography.bodySm, color: Colors.gray300, marginBottom: Spacing.md },
  modalDivider: { height: 1, backgroundColor: Colors.gray100, marginBottom: Spacing.md },
  modalContenu: { ...Typography.bodyMd, color: Colors.gray900, lineHeight: 24 },

  bottomPad: { height: Spacing.xxl },
})

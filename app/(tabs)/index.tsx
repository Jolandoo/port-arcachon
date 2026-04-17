import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Linking, RefreshControl } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Colors, Spacing, Typography, CAPITAINERIE } from '@/constants'
import { Card, SectionHeader, FadeInView } from '@/components/ui'
import { useMeteo } from '@/hooks/useMeteo'
import { useMarees } from '@/hooks/useMarees'
import { useSettingsStore, formatWind, formatTemp } from '@/store/settingsStore'
import { wmoIcon, wmoLabel, degreesToCardinal } from '@/utils/meteo'
import { getProchaineMaree } from '@/utils/marees'

// ── Actualités mock ───────────────────────────────────────────────────────────
const ACTU_MOCK = [
  { id: '1', titre: 'Salon Nautique d\'Arcachon 2026', resume: 'Le rendez-vous à ne pas manquer cet été au port.', date: 'Il y a 7 jours', categorie: 'Événement' },
  { id: '2', titre: 'Travaux ponton B — perturbations', resume: 'Accès limité au ponton B jusqu\'au 30 avril.', date: 'Il y a 2 jours', categorie: 'Travaux' },
  { id: '3', titre: 'Nouvelles bornes électriques', resume: 'Installation de 12 bornes haute puissance sur le quai Nord.', date: 'Aujourd\'hui', categorie: 'Info' },
]

// ── Raccourcis ────────────────────────────────────────────────────────────────
interface Shortcut {
  label: string
  icon: React.ComponentProps<typeof Ionicons>['name']
  colors: readonly [string, string]
  onPress: () => void
}

function ShortcutButton({ label, icon, colors, onPress }: Shortcut) {
  return (
    <TouchableOpacity style={styles.shortcut} onPress={onPress} activeOpacity={0.75}>
      <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.shortcutIcon}>
        <Ionicons name={icon} size={24} color={Colors.white} />
      </LinearGradient>
      <Text style={styles.shortcutLabel}>{label}</Text>
    </TouchableOpacity>
  )
}

// ── Écran principal ───────────────────────────────────────────────────────────
export default function AccueilScreen() {
  const meteo      = useMeteo()
  const marees     = useMarees()
  const windUnit = useSettingsStore((s) => s.windUnit)
  const tempUnit = useSettingsStore((s) => s.tempUnit)

  const actuelle       = meteo.data?.actuelle
  const prochaineMaree = marees.data ? getProchaineMaree(marees.data.jours) : null
  const isRefreshing   = meteo.isRefetching || marees.isRefetching

  function onRefresh() {
    meteo.refetch()
    marees.refetch()
  }

  const shortcuts: Shortcut[] = [
    { label: 'Plan du port',  icon: 'map',          colors: ['#1A3059', '#2A5499'], onPress: () => router.push('/(tabs)/port') },
    { label: 'Marées',        icon: 'water',        colors: ['#2A4E8A', '#1E7BC4'], onPress: () => router.push('/(tabs)/meteo') },
    { label: 'Services',      icon: 'grid',         colors: ['#B8893A', '#E8C97A'], onPress: () => router.push('/(tabs)/services') },
    { label: 'Urgences',      icon: 'alert-circle', colors: ['#C0392B', '#E8614A'], onPress: () => router.push('/urgences') },
  ]

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          tintColor={Colors.ocean}
          colors={[Colors.ocean]}
        />
      }
    >
      {/* ── Widget météo gradient ── */}
      <FadeInView delay={0}>
        <TouchableOpacity activeOpacity={0.88} onPress={() => router.push('/(tabs)/meteo')}>
          <LinearGradient
            colors={['#0F1E38', '#1A3059', '#1E4A8A']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.meteoCard}
          >
            {meteo.isLoading && (
              <Text style={styles.meteoLoading}>Chargement météo…</Text>
            )}
            {actuelle != null && (
              <View style={styles.meteoRow}>
                {/* Temp + condition */}
                <View>
                  <Text style={styles.meteoTemp}>{formatTemp(actuelle.temperature, tempUnit)}</Text>
                  <Text style={styles.meteoCondition}>{wmoLabel(actuelle.weatherCode)}</Text>
                </View>

                {/* Icône */}
                <Ionicons
                  name={wmoIcon(actuelle.weatherCode) as React.ComponentProps<typeof Ionicons>['name']}
                  size={52}
                  color={Colors.sand}
                />

                {/* Vent */}
                <View style={styles.meteoWind}>
                  <Text style={styles.meteoWindVal}>
                    {formatWind(actuelle.windSpeed, windUnit)}
                  </Text>
                  <Text style={styles.meteoWindDir}>{degreesToCardinal(actuelle.windDirection)}</Text>
                  <Text style={styles.meteoWindLabel}>vent</Text>
                </View>
              </View>
            )}
            <View style={styles.meteoFooter}>
              <Text style={styles.meteoLink}>Voir météo complète →</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </FadeInView>

      {/* ── Prochaine marée ── */}
      {prochaineMaree != null && (
        <FadeInView delay={80}>
          <View style={styles.gap} />
          <TouchableOpacity activeOpacity={0.85} onPress={() => router.push('/(tabs)/meteo')}>
            <LinearGradient
              colors={prochaineMaree.type === 'haute'
                ? ['#1A3059', '#2A6490']
                : ['#2A5499', '#3E7CC4']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.mareeCard}
            >
              <View style={styles.mareeRow}>
                <Ionicons
                  name={prochaineMaree.type === 'haute' ? 'arrow-up-circle' : 'arrow-down-circle'}
                  size={32}
                  color={'rgba(255,255,255,0.9)'}
                />
                <View>
                  <Text style={styles.mareeLabel}>
                    Prochaine {prochaineMaree.type === 'haute' ? 'marée haute' : 'marée basse'}
                  </Text>
                  <Text style={styles.mareeHeure}>{prochaineMaree.heure} — {prochaineMaree.hauteur.toFixed(2)} m</Text>
                </View>
                <View style={styles.mareeDans}>
                  <Text style={styles.mareeDansLabel}>dans</Text>
                  <Text style={styles.mareeDansVal}>
                    {Math.floor(prochaineMaree.minutesRestantes / 60)}h{String(prochaineMaree.minutesRestantes % 60).padStart(2, '0')}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </FadeInView>
      )}

      {/* ── Raccourcis ── */}
      <FadeInView delay={160}>
        <View style={styles.gap} />
        <View style={styles.shortcuts}>
          {shortcuts.map((s) => (
            <ShortcutButton key={s.label} {...s} />
          ))}
        </View>
      </FadeInView>

      {/* ── Capitainerie infos rapides ── */}
      <FadeInView delay={240}>
        <View style={styles.gap} />
        <SectionHeader title="Capitainerie" actionLabel="Appeler" onAction={() => Linking.openURL(`tel:${CAPITAINERIE.telPlaisanciers}`)} />
        <Card>
          <View style={styles.capRow}>
            <Ionicons name="radio" size={16} color={Colors.ocean} />
            <Text style={styles.capText}>VHF {CAPITAINERIE.vhf}</Text>
          </View>
          <View style={[styles.capRow, styles.capBorder]}>
            <Ionicons name="call" size={16} color={Colors.ocean} />
            <Text style={styles.capText}>{CAPITAINERIE.telPlaisanciers} <Text style={styles.capSub}>(15 cts/mn)</Text></Text>
          </View>
          <View style={[styles.capRow, styles.capBorder]}>
            <Ionicons name="mail" size={16} color={Colors.ocean} />
            <Text style={styles.capText}>{CAPITAINERIE.email}</Text>
          </View>
        </Card>
      </FadeInView>

      {/* ── Actualités ── */}
      <FadeInView delay={320}>
        <View style={styles.gap} />
        <SectionHeader title="Actualités" actionLabel="Voir tout" onAction={() => router.push('/(tabs)/actualites')} />
        <Card>
          {ACTU_MOCK.map((a, i) => (
            <TouchableOpacity
              key={a.id}
              style={[styles.actuRow, i < ACTU_MOCK.length - 1 && styles.actuBorder]}
              activeOpacity={0.7}
            >
              <View style={styles.actuContent}>
                <Text style={styles.actuCategorie}>{a.categorie}</Text>
                <Text style={styles.actuTitre}>{a.titre}</Text>
                <Text style={styles.actuDate}>{a.date}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={Colors.gray300} />
            </TouchableOpacity>
          ))}
        </Card>
      </FadeInView>

      {/* ── Portail plaisancier ── */}
      <FadeInView delay={400}>
        <View style={styles.gap} />
        <TouchableOpacity activeOpacity={0.85} onPress={() => router.push('/portail/login')}>
          <LinearGradient
            colors={['#0F1E38', '#1A3059', '#2A5499']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.portailBtn}
          >
            <Ionicons name="person-circle" size={24} color={Colors.white} />
            <Text style={styles.portailLabel}>Espace plaisancier</Text>
            <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.6)" />
          </LinearGradient>
        </TouchableOpacity>
      </FadeInView>

      <View style={styles.bottomPad} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scroll: { backgroundColor: Colors.gray50 },
  content: { padding: Spacing.md, paddingTop: Spacing.lg },
  gap: { height: Spacing.lg },

  // Météo widget
  meteoCard: {
    borderRadius: 20,
    padding: Spacing.md,
    overflow: 'hidden',
  },
  meteoLoading: { ...Typography.bodyMd, color: 'rgba(255,255,255,0.6)', textAlign: 'center', padding: Spacing.md },
  meteoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  meteoTemp: { fontSize: 44, fontWeight: '700', color: Colors.white, lineHeight: 50 },
  meteoCondition: { ...Typography.bodyMd, color: 'rgba(255,255,255,0.65)' },
  meteoWind: { alignItems: 'center' },
  meteoWindVal: { fontSize: 20, fontWeight: '700', color: Colors.sand },
  meteoWindDir: { ...Typography.bodyMd, color: 'rgba(255,255,255,0.65)' },
  meteoWindLabel: { ...Typography.label, color: 'rgba(255,255,255,0.45)' },
  meteoFooter: {
    marginTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.12)',
    paddingTop: Spacing.sm,
  },
  meteoLink: { ...Typography.bodyMd, color: 'rgba(255,255,255,0.7)', textAlign: 'right' },

  // Marée
  mareeCard: {
    borderRadius: 16,
    padding: Spacing.md,
    overflow: 'hidden',
  },
  mareeRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  mareeLabel: { ...Typography.label, color: 'rgba(255,255,255,0.6)' },
  mareeHeure: { ...Typography.bodyMd, fontWeight: '600', color: Colors.white },
  mareeDans: { marginLeft: 'auto', alignItems: 'flex-end' },
  mareeDansLabel: { ...Typography.label, color: 'rgba(255,255,255,0.6)' },
  mareeDansVal: { fontSize: 20, fontWeight: '700', color: Colors.sand },

  // Raccourcis
  shortcuts: { flexDirection: 'row', justifyContent: 'space-between' },
  shortcut: { alignItems: 'center', gap: Spacing.xs, flex: 1 },
  shortcutIcon: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  shortcutLabel: { ...Typography.bodySm, color: Colors.gray900, textAlign: 'center', fontWeight: '500' },

  // Capitainerie
  capRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.sm },
  capBorder: { borderTopWidth: 1, borderTopColor: Colors.gray100 },
  capText: { ...Typography.bodyMd, color: Colors.gray900, flex: 1 },
  capSub: { color: Colors.gray500, fontSize: 12 },

  // Portail
  portailBtn: {
    borderRadius: 14,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    overflow: 'hidden',
  },
  portailLabel: { ...Typography.body, color: Colors.white, fontWeight: '600', flex: 1 },

  // Actualités
  actuRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.sm, gap: Spacing.sm },
  actuBorder: { borderBottomWidth: 1, borderBottomColor: Colors.gray100 },
  actuContent: { flex: 1 },
  actuCategorie: { ...Typography.label, color: Colors.ocean, marginBottom: 2 },
  actuTitre: { ...Typography.bodyMd, fontWeight: '600', color: Colors.gray900 },
  actuDate: { ...Typography.bodySm, color: Colors.gray500, marginTop: 2 },

  bottomPad: { height: Spacing.xxl },
})

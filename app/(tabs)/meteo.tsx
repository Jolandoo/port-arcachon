import { ScrollView, View, Text, RefreshControl, StyleSheet } from 'react-native'
import { Colors, Spacing, Typography } from '@/constants'
import { SectionHeader } from '@/components/ui'
import { MeteoCard, WindGauge, PrevisionJour, ProchaineMaree, TideChart, MeteoSkeleton } from '@/components/meteo'
import { useMeteo } from '@/hooks/useMeteo'
import { useMarees } from '@/hooks/useMarees'
import { getProchaineMaree } from '@/utils/marees'

export default function MeteoScreen() {
  const meteo  = useMeteo()
  const marees = useMarees()

  const isRefreshing = meteo.isRefetching || marees.isRefetching

  function onRefresh() {
    meteo.refetch()
    marees.refetch()
  }

  if (meteo.isLoading) return <MeteoSkeleton />

  if (meteo.isError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Impossible de charger la météo.{'\n'}
          {(meteo.error as Error)?.message}
        </Text>
      </View>
    )
  }

  if (!meteo.data) return null

  const { actuelle, previsions } = meteo.data
  const prochaineMaree = marees.data ? getProchaineMaree(marees.data.jours) : null

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
      {/* Météo actuelle */}
      <SectionHeader title="Météo actuelle" />
      <MeteoCard data={actuelle} />

      {/* WindGauge */}
      <View style={styles.gaugeRow}>
        <WindGauge direction={actuelle.windDirection} speed={actuelle.windSpeed} />
      </View>

      {/* Prochaine marée */}
      {prochaineMaree != null && (
        <>
          <SectionHeader title="Marées" />
          <ProchaineMaree maree={prochaineMaree} minutesRestantes={prochaineMaree.minutesRestantes} />
        </>
      )}

      {/* Graphique marées ±24h */}
      {marees.data != null && (
        <>
          <View style={styles.gap} />
          <TideChart jours={marees.data.jours} />
        </>
      )}

      {/* Prévisions 7 jours */}
      <SectionHeader title="Prévisions 7 jours" />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.previsions}
      >
        {previsions.map((jour, i) => (
          <PrevisionJour key={jour.date} data={jour} isToday={i === 0} />
        ))}
      </ScrollView>

      <View style={styles.bottomPad} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scroll: { backgroundColor: Colors.gray50 },
  content: { padding: Spacing.md, paddingTop: Spacing.lg },
  errorContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.lg },
  errorText: { ...Typography.body, color: Colors.danger, textAlign: 'center' },
  gaugeRow: { alignItems: 'center', paddingVertical: Spacing.lg },
  previsions: { gap: Spacing.sm, paddingVertical: Spacing.xs, paddingRight: Spacing.md },
  gap: { height: Spacing.sm },
  bottomPad: { height: Spacing.xxl },
})

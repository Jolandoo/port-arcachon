import { ScrollView, View, Text, StyleSheet } from 'react-native'
import { Colors, Spacing, Typography } from '@/constants'
import { LoadingState, SectionHeader } from '@/components/ui'
import { MeteoCard, WindGauge, PrevisionJour, ProchaineMaree, TideChart } from '@/components/meteo'
import { useMeteo } from '@/hooks/useMeteo'
import { useMarees } from '@/hooks/useMarees'
import { getProchaineMaree } from '@/utils/marees'

export default function MeteoScreen() {
  const meteo = useMeteo()
  const marees = useMarees()

  if (meteo.isLoading) return <LoadingState fullScreen message="Chargement météo…" />

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
  const aujourdhui = marees.data?.jours[0]

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
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

      {/* Graphique marées du jour */}
      {aujourdhui != null && (
        <>
          <View style={styles.gap} />
          <TideChart jour={aujourdhui} />
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
  content: { padding: Spacing.md },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  errorText: {
    ...Typography.body,
    color: Colors.danger,
    textAlign: 'center',
  },
  gaugeRow: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  previsions: {
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
    paddingRight: Spacing.md,
  },
  gap: { height: Spacing.sm },
  bottomPad: { height: Spacing.xxl },
})

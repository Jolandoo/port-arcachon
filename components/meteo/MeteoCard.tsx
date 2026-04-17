import { View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Colors, Spacing, Typography } from '@/constants'
import { GradientCard } from '@/components/ui'
import { wmoLabel, wmoIcon, degreesToCardinal, windCondition } from '@/utils/meteo'
import { useSettingsStore, formatWind, formatTemp, formatWave } from '@/store/settingsStore'
import type { MeteoActuelle } from '@/types'

interface MeteoCardProps {
  data: MeteoActuelle
}

// Wind condition → accent color on dark background
function windAccent(cond: string): string {
  switch (cond) {
    case 'calm':     return '#7ECFB0'
    case 'moderate': return '#7EC8E3'
    case 'strong':   return '#F5A623'
    case 'storm':    return '#FF6B6B'
    default:         return Colors.white
  }
}

export function MeteoCard({ data }: MeteoCardProps) {
  const windUnit = useSettingsStore((s) => s.windUnit)
  const tempUnit = useSettingsStore((s) => s.tempUnit)
  const waveUnit = useSettingsStore((s) => s.waveUnit)
  const condition = windCondition(data.windSpeed)
  const accent    = windAccent(condition)
  const cardinal  = degreesToCardinal(data.windDirection)
  const icon      = wmoIcon(data.weatherCode) as React.ComponentProps<typeof Ionicons>['name']

  return (
    <GradientCard
      colors={['#0F1E38', '#1A3059', '#1E4A8A']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      {/* Température + icône */}
      <View style={styles.topRow}>
        <View>
          <Text style={styles.temperature}>{formatTemp(data.temperature, tempUnit)}</Text>
          <Text style={styles.condition}>{wmoLabel(data.weatherCode)}</Text>
        </View>
        <Ionicons name={icon} size={64} color={Colors.sand} />
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Vent + stats — 3 lignes horizontales pour aligner parfaitement */}
      <View style={styles.windGrid}>
        {/* Ligne labels */}
        <View style={styles.windGridRow}>
          <Text style={[styles.windLabel, styles.windCell]}>VENT</Text>
          <Text style={[styles.windLabel, styles.windCell]}>RAFALES</Text>
          <Text style={[styles.windLabel, styles.windCell]}>ÉTAT</Text>
          <Text style={[styles.windLabel, styles.windCell]}>VAGUES</Text>
        </View>
        {/* Ligne valeurs */}
        <View style={styles.windGridRow}>
          <Text style={[styles.windValue, styles.windCell, { color: accent }]}>{formatWind(data.windSpeed, windUnit)}</Text>
          <Text style={[styles.windValue, styles.windCell, { color: accent }]}>{formatWind(data.windGusts, windUnit)}</Text>
          <Text style={[styles.windValue, styles.windCell, { color: accent }]}>{condition.toUpperCase()}</Text>
          <Text style={[styles.windValue, styles.windCell]}>{data.waveHeight != null ? formatWave(data.waveHeight, waveUnit) : '—'}</Text>
        </View>
        {/* Ligne sous-textes */}
        <View style={styles.windGridRow}>
          <Text style={[styles.windSub, styles.windCell]}>{cardinal}</Text>
          <Text style={[styles.windSub, styles.windCell]}>{data.windDirection}°</Text>
          <Text style={[styles.windSub, styles.windCell]}> </Text>
          <Text style={[styles.windSub, styles.windCell]}> </Text>
        </View>
      </View>
    </GradientCard>
  )
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  temperature: {
    fontSize: 52,
    fontWeight: '700',
    color: Colors.white,
    lineHeight: 60,
  },
  condition: {
    ...Typography.bodyMd,
    color: 'rgba(255,255,255,0.65)',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
    marginVertical: Spacing.sm,
  },
  windGrid: {
    paddingTop: Spacing.xs,
    gap: 4,
  },
  windGridRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  windCell: {
    flex: 1,
    textAlign: 'center',
  },
  windLabel: {
    ...Typography.label,
    color: 'rgba(255,255,255,0.5)',
    fontSize: 9,
  },
  windValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.white,
  },
  windSub: {
    ...Typography.caption,
    color: 'rgba(255,255,255,0.5)',
  },
})

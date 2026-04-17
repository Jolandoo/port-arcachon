import { View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { Colors, Spacing, Typography } from '@/constants'
import { wmoIcon, formatDateShort } from '@/utils/meteo'
import { useSettingsStore, formatWind, formatTemp } from '@/store/settingsStore'
import type { MeteoJour } from '@/types'

interface PrevisionJourProps {
  data: MeteoJour
  isToday?: boolean
}

export function PrevisionJour({ data, isToday = false }: PrevisionJourProps) {
  const windUnit = useSettingsStore((s) => s.windUnit)
  const tempUnit = useSettingsStore((s) => s.tempUnit)
  const icon = wmoIcon(data.weatherCode) as React.ComponentProps<typeof Ionicons>['name']

  const inner = (
    <>
      <Text style={[styles.day, isToday && styles.dayToday]}>
        {isToday ? 'Auj.' : formatDateShort(data.date)}
      </Text>
      <Ionicons name={icon} size={26} color={isToday ? Colors.white : Colors.sand} />
      <Text style={[styles.tempMax, isToday && styles.textWhite]}>
        {formatTemp(data.temperatureMax, tempUnit)}
      </Text>
      <Text style={[styles.tempMin, isToday && styles.textWhiteLight]}>
        {formatTemp(data.temperatureMin, tempUnit)}
      </Text>
      <View style={styles.wind}>
        <Ionicons name="navigate" size={10} color={isToday ? Colors.white : Colors.gray500} />
        <Text style={[styles.windText, isToday && styles.textWhiteLight]}>
          {formatWind(data.windSpeedMax, windUnit)}
        </Text>
      </View>
    </>
  )

  if (isToday) {
    return (
      <LinearGradient
        colors={['#1A3059', '#2A5499']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.card, styles.cardToday]}
      >
        {inner}
      </LinearGradient>
    )
  }

  return <View style={styles.card}>{inner}</View>
}

const styles = StyleSheet.create({
  card: {
    width: 72,
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: 16,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray100,
  },
  cardToday: {
    borderWidth: 0,
  },
  day: {
    ...Typography.label,
    color: Colors.gray500,
  },
  dayToday: {
    color: Colors.white,
  },
  tempMax: {
    ...Typography.bodyMd,
    fontWeight: '700',
    color: Colors.gray900,
  },
  tempMin: {
    ...Typography.bodySm,
    color: Colors.gray500,
  },
  wind: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  windText: {
    ...Typography.bodySm,
    color: Colors.gray500,
  },
  textWhite: {
    color: Colors.white,
  },
  textWhiteLight: {
    color: 'rgba(255,255,255,0.7)',
  },
})

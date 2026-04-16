import { View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Colors, Spacing, Typography } from '@/constants'
import { wmoIcon, formatDateShort } from '@/utils/meteo'
import type { MeteoJour } from '@/types'

interface PrevisionJourProps {
  data: MeteoJour
  isToday?: boolean
}

export function PrevisionJour({ data, isToday = false }: PrevisionJourProps) {
  const icon = wmoIcon(data.weatherCode) as React.ComponentProps<typeof Ionicons>['name']

  return (
    <View style={[styles.card, isToday && styles.cardToday]}>
      <Text style={[styles.day, isToday && styles.dayToday]}>
        {isToday ? "Auj." : formatDateShort(data.date)}
      </Text>
      <Ionicons
        name={icon}
        size={26}
        color={isToday ? Colors.white : Colors.sand}
      />
      <Text style={[styles.tempMax, isToday && styles.textWhite]}>
        {Math.round(data.temperatureMax)}°
      </Text>
      <Text style={[styles.tempMin, isToday && styles.textWhiteLight]}>
        {Math.round(data.temperatureMin)}°
      </Text>
      <View style={styles.wind}>
        <Ionicons
          name="navigate"
          size={10}
          color={isToday ? Colors.white : Colors.gray500}
        />
        <Text style={[styles.windText, isToday && styles.textWhiteLight]}>
          {Math.round(data.windSpeedMax)}kt
        </Text>
      </View>
    </View>
  )
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
    backgroundColor: Colors.ocean,
    borderColor: Colors.ocean,
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

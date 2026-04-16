import { View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Colors, Spacing, Typography } from '@/constants'
import { Card } from '@/components/ui'
import { wmoLabel, wmoIcon, degreesToCardinal, windCondition, conditionColor } from '@/utils/meteo'
import type { MeteoActuelle } from '@/types'

interface MeteoCardProps {
  data: MeteoActuelle
}

export function MeteoCard({ data }: MeteoCardProps) {
  const condition = windCondition(data.windSpeed)
  const windColor = conditionColor(condition)
  const cardinal = degreesToCardinal(data.windDirection)
  const icon = wmoIcon(data.weatherCode) as React.ComponentProps<typeof Ionicons>['name']

  return (
    <Card>
      {/* Température + icône */}
      <View style={styles.topRow}>
        <View>
          <Text style={styles.temperature}>{Math.round(data.temperature)}°C</Text>
          <Text style={styles.condition}>{wmoLabel(data.weatherCode)}</Text>
        </View>
        <Ionicons name={icon} size={64} color={Colors.sand} />
      </View>

      {/* Séparateur */}
      <View style={styles.divider} />

      {/* Vent */}
      <View style={styles.windRow}>
        <View style={styles.windItem}>
          <Text style={styles.windLabel}>VENT</Text>
          <Text style={[styles.windValue, { color: windColor }]}>
            {Math.round(data.windSpeed)} kt
          </Text>
          <Text style={styles.windSub}>{cardinal}</Text>
        </View>

        <View style={styles.windItem}>
          <Text style={styles.windLabel}>RAFALES</Text>
          <Text style={[styles.windValue, { color: windColor }]}>
            {Math.round(data.windGusts)} kt
          </Text>
          <Text style={styles.windSub}>{data.windDirection}°</Text>
        </View>

        <View style={styles.windItem}>
          <Text style={styles.windLabel}>ÉTAT</Text>
          <Text style={[styles.windValue, { color: windColor, fontSize: 13 }]}>
            {condition.toUpperCase()}
          </Text>
        </View>
      </View>
    </Card>
  )
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  temperature: {
    fontSize: 52,
    fontWeight: '700',
    color: Colors.gray900,
    lineHeight: 60,
  },
  condition: {
    ...Typography.bodyMd,
    color: Colors.gray500,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.gray100,
    marginVertical: Spacing.sm,
  },
  windRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: Spacing.xs,
  },
  windItem: {
    alignItems: 'center',
    gap: 2,
  },
  windLabel: {
    ...Typography.label,
    color: Colors.gray500,
  },
  windValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.gray900,
  },
  windSub: {
    ...Typography.caption,
    color: Colors.gray500,
  },
})

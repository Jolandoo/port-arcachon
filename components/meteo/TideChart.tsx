import { View, Text, StyleSheet } from 'react-native'
import { Colors, Spacing, Typography } from '@/constants'
import type { MareeJour } from '@/types'

interface TideChartProps {
  jour: MareeJour
}

export function TideChart({ jour }: TideChartProps) {
  const CHART_HEIGHT = 80
  const maxH = Math.max(...jour.marees.map((m) => m.hauteur), 5)

  // Génère ~24 points interpolés depuis les marées
  const points = interpolatePoints(jour.marees, 24)

  const nowMinutes = (() => {
    const n = new Date()
    return n.getHours() * 60 + n.getMinutes()
  })()

  return (
    <View style={styles.container}>
      <View style={styles.chart}>
        {/* Barres */}
        {points.map((p, i) => {
          const barH = Math.max(4, (p.height / maxH) * CHART_HEIGHT)
          const isNow = Math.abs(p.minutes - nowMinutes) < 35
          return (
            <View key={i} style={styles.barCol}>
              <View
                style={[
                  styles.bar,
                  { height: barH },
                  isNow && styles.barNow,
                ]}
              />
            </View>
          )
        })}
      </View>

      {/* Ligne de temps */}
      <View style={styles.timeRow}>
        {['00h', '06h', '12h', '18h', '24h'].map((t) => (
          <Text key={t} style={styles.timeLabel}>{t}</Text>
        ))}
      </View>

      {/* Horaires hautes/basses */}
      <View style={styles.tideList}>
        {jour.marees.map((m, i) => (
          <View key={i} style={styles.tideItem}>
            <Text style={[styles.tideType, m.type === 'haute' ? styles.haute : styles.basse]}>
              {m.type === 'haute' ? '▲' : '▼'}
            </Text>
            <Text style={styles.tideHeure}>{m.heure}</Text>
            <Text style={styles.tideHauteur}>{m.hauteur.toFixed(2)} m</Text>
            {m.coefficient != null && (
              <Text style={styles.tideCoeff}>c.{m.coefficient}</Text>
            )}
          </View>
        ))}
      </View>
    </View>
  )
}

function interpolatePoints(marees: { heure: string; hauteur: number }[], count: number) {
  const toMin = (h: string) => {
    const [hh, mm] = h.split(':').map(Number)
    return hh * 60 + (mm ?? 0)
  }
  const pts = marees.map((m) => ({ minutes: toMin(m.heure), height: m.hauteur }))
  pts.sort((a, b) => a.minutes - b.minutes)

  return Array.from({ length: count }, (_, i) => {
    const min = (i / (count - 1)) * 24 * 60

    // Trouve les 2 points encadrants
    let before = pts[0]
    let after = pts[pts.length - 1]
    for (let j = 0; j < pts.length - 1; j++) {
      if (pts[j].minutes <= min && pts[j + 1].minutes >= min) {
        before = pts[j]
        after = pts[j + 1]
        break
      }
    }

    // Interpolation cosinus (plus douce qu'un linéaire)
    const range = after.minutes - before.minutes
    const t = range === 0 ? 0 : (min - before.minutes) / range
    const smooth = (1 - Math.cos(t * Math.PI)) / 2
    const height = before.height + (after.height - before.height) * smooth

    return { minutes: min, height }
  })
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: Spacing.md,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 80,
    gap: 2,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 80,
  },
  bar: {
    width: '85%',
    backgroundColor: Colors.oceanLight,
    borderRadius: 2,
  },
  barNow: {
    backgroundColor: Colors.ocean,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  timeLabel: {
    ...Typography.bodySm,
    color: Colors.gray500,
    fontSize: 10,
  },
  tideList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: Spacing.sm,
    gap: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.gray100,
    paddingTop: Spacing.sm,
  },
  tideItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    minWidth: '45%',
  },
  tideType: {
    fontSize: 12,
  },
  haute: { color: Colors.ocean },
  basse: { color: Colors.oceanMid },
  tideHeure: {
    ...Typography.bodyMd,
    fontWeight: '600',
    color: Colors.gray900,
  },
  tideHauteur: {
    ...Typography.bodyMd,
    color: Colors.gray500,
  },
  tideCoeff: {
    ...Typography.bodySm,
    color: Colors.sand,
    fontWeight: '600',
  },
})

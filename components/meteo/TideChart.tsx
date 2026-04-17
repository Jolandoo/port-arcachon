import { useRef } from 'react'
import { View, Text, ScrollView, StyleSheet, LayoutChangeEvent } from 'react-native'
import Svg, { Path, Defs, LinearGradient as SvgGradient, Stop, Line, Circle, Text as SvgText } from 'react-native-svg'
import { Colors, Spacing, Typography } from '@/constants'
import type { MareeJour } from '@/types'

interface TideChartProps {
  jours: MareeJour[]
}

// 1h = 40px → 24h = 960px → ±24h (48h) = 1920px
const PX_PER_MIN  = 40 / 60
const CHART_H     = 100
const HALF_PERIOD = 372  // ~6h12min demi-période semi-diurne

export function TideChart({ jours }: TideChartProps) {
  const scrollRef = useRef<ScrollView>(null)

  const now        = new Date()
  // Calcul timezone-safe : différence entre maintenant et minuit LOCAL
  const midnight   = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
  const nowMinutes = Math.floor((now.getTime() - midnight.getTime()) / 60000)

  // Calcule le jour 0 = aujourd'hui (trouver l'index)
  const todayStr    = now.toISOString().slice(0, 10)
  const todayIndex  = jours.findIndex((j) => j.date === todayStr)
  const refIndex    = todayIndex >= 0 ? todayIndex : 0

  // Convertit toutes les marées en minutes absolues (0 = minuit du jour refIndex)
  const allMarees = jours.flatMap((jour, di) => {
    const dayOffset = (di - refIndex) * 1440
    return jour.marees.map((m) => {
      const [hh, mm] = m.heure.split(':').map(Number)
      return { minutes: dayOffset + hh * 60 + mm, height: m.hauteur, type: m.type }
    })
  }).sort((a, b) => a.minutes - b.minutes)

  const points = interpolatePoints(allMarees)

  if (points.length === 0) return null

  // Bornes du graphique : ±24h autour de minuit d'aujourd'hui
  const minTime = -24 * 60
  const maxTime =  48 * 60
  const totalMin = maxTime - minTime
  const CHART_W  = Math.round(totalMin * PX_PER_MIN)

  const heights = points.map((p) => p.height)
  const minH    = Math.min(...heights)
  const maxH    = Math.max(...heights)
  const range   = maxH - minH || 1

  const toX = (min: number) => (min - minTime) * PX_PER_MIN
  const toY = (h: number)   => CHART_H - ((h - minH) / range) * (CHART_H - 10) - 5

  const visiblePoints = points.filter((p) => p.minutes >= minTime && p.minutes <= maxTime)

  const curvePath = visiblePoints.reduce((acc, p, i) => {
    const x = toX(p.minutes).toFixed(1)
    const y = toY(p.height).toFixed(1)
    return acc + (i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`)
  }, '')

  const fillPath = `${curvePath} L ${CHART_W} ${CHART_H + 2} L 0 ${CHART_H + 2} Z`

  const nowX = toX(nowMinutes)
  const nowPt = visiblePoints.reduce((best, p) =>
    Math.abs(p.minutes - nowMinutes) < Math.abs(best.minutes - nowMinutes) ? p : best,
    visiblePoints[0]
  )
  const nowY = toY(nowPt.height)

  // Repères toutes les 6h
  const hourMarks: number[] = []
  for (let m = Math.ceil(minTime / 360) * 360; m <= maxTime; m += 360) {
    hourMarks.push(m)
  }

  function onLayout(e: LayoutChangeEvent) {
    const containerW = e.nativeEvent.layout.width
    const offset     = Math.max(0, nowX - containerW / 2)
    scrollRef.current?.scrollTo({ x: offset, animated: false })
  }

  return (
    <View style={styles.container}>
      <ScrollView ref={scrollRef} horizontal showsHorizontalScrollIndicator={false} onLayout={onLayout}>
        <Svg width={CHART_W} height={CHART_H + 24}>
          <Defs>
            <SvgGradient id="tideGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={Colors.ocean} stopOpacity="0.38" />
              <Stop offset="1" stopColor={Colors.ocean} stopOpacity="0.04" />
            </SvgGradient>
          </Defs>

          {/* Quadrillage */}
          {hourMarks.map((min) => (
            <Line key={min}
              x1={toX(min)} y1={0} x2={toX(min)} y2={CHART_H}
              stroke={Colors.gray100} strokeWidth="1" />
          ))}

          {/* Remplissage */}
          <Path d={fillPath} fill="url(#tideGrad)" />

          {/* Courbe */}
          <Path d={curvePath} fill="none" stroke={Colors.ocean} strokeWidth="2.5" strokeLinejoin="round" />

          {/* Labels horaires */}
          {hourMarks.map((min) => {
            const absH = ((min % 1440) + 1440) % 1440
            const h    = Math.round(absH / 60)
            const isDay0 = min === 0
            return (
              <SvgText key={`t${min}`} x={toX(min) + 4} y={CHART_H + 16}
                fontSize="10" fill={isDay0 ? Colors.ocean : Colors.gray500}
                fontWeight={isDay0 ? 'bold' : 'normal'}>
                {`${String(h % 24).padStart(2, '0')}h`}
              </SvgText>
            )
          })}

          {/* Marqueurs PM / BM */}
          {allMarees
            .filter((m) => m.minutes >= minTime && m.minutes <= maxTime)
            .map((m, i) => (
              <Circle key={i} cx={toX(m.minutes)} cy={toY(m.height)} r={4}
                fill={m.type === 'haute' ? Colors.ocean : Colors.oceanMid}
                stroke={Colors.white} strokeWidth="1.5" />
            ))}

          {/* Ligne maintenant */}
          <Line x1={nowX} y1={0} x2={nowX} y2={CHART_H}
            stroke={Colors.sand} strokeWidth="2" strokeDasharray="4,3" />
          <Circle cx={nowX} cy={nowY} r={5} fill={Colors.sand} />
        </Svg>
      </ScrollView>

      {/* Horaires du jour */}
      <View style={styles.tideList}>
        {(jours[refIndex]?.marees ?? []).map((m, i) => (
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

function interpolatePoints(
  allMarees: { minutes: number; height: number; type: string }[],
) {
  if (allMarees.length === 0) return []

  const minM = allMarees[0].minutes  - HALF_PERIOD
  const maxM = allMarees[allMarees.length - 1].minutes + HALF_PERIOD

  // Points virtuels aux bornes
  const ext = [
    { minutes: minM, height: allMarees[0].type === 'haute' ? Math.min(...allMarees.map(p => p.height)) : Math.max(...allMarees.map(p => p.height)), type: '' },
    ...allMarees,
    { minutes: maxM, height: allMarees[allMarees.length-1].type === 'haute' ? Math.min(...allMarees.map(p => p.height)) : Math.max(...allMarees.map(p => p.height)), type: '' },
  ]

  // 1 point toutes les 5 min sur toute la plage
  const count = Math.round((maxM - minM) / 5) + 1
  return Array.from({ length: count }, (_, i) => {
    const min = minM + i * 5
    let before = ext[0]
    let after  = ext[ext.length - 1]
    for (let j = 0; j < ext.length - 1; j++) {
      if (ext[j].minutes <= min && ext[j + 1].minutes >= min) {
        before = ext[j]
        after  = ext[j + 1]
        break
      }
    }
    const r      = after.minutes - before.minutes
    const t      = r === 0 ? 0 : (min - before.minutes) / r
    const smooth = (1 - Math.cos(t * Math.PI)) / 2
    return { minutes: min, height: before.height + (after.height - before.height) * smooth }
  })
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: Spacing.md,
    overflow: 'hidden',
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
  tideItem:    { flexDirection: 'row', alignItems: 'center', gap: 4, minWidth: '45%' },
  tideType:    { fontSize: 12 },
  haute:       { color: Colors.ocean },
  basse:       { color: Colors.oceanMid },
  tideHeure:   { ...Typography.bodyMd, fontWeight: '600', color: Colors.gray900 },
  tideHauteur: { ...Typography.bodyMd, color: Colors.gray500 },
  tideCoeff:   { ...Typography.bodySm, color: Colors.sand, fontWeight: '600' },
})

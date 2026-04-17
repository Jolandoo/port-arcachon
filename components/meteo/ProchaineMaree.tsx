import { View, Text, StyleSheet } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { Colors, Spacing, Typography } from '@/constants'
import type { Maree } from '@/types'

interface ProchaineMareeProps {
  maree: Maree
  minutesRestantes: number
}

export function ProchaineMaree({ maree, minutesRestantes }: ProchaineMareeProps) {
  const isHaute = maree.type === 'haute'
  const heures = Math.floor(minutesRestantes / 60)
  const minutes = minutesRestantes % 60
  const countdown = heures > 0
    ? `${heures}h ${String(minutes).padStart(2, '0')}min`
    : `${minutes} min`

  const gradientColors: [string, string] = isHaute
    ? ['#1A3059', '#2A6490']
    : ['#2A5499', '#3E7CC4']

  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.left}>
        <Ionicons
          name={isHaute ? 'arrow-up-circle' : 'arrow-down-circle'}
          size={36}
          color={'rgba(255,255,255,0.9)'}
        />
        <View>
          <Text style={styles.label}>
            Prochaine {isHaute ? 'marée haute' : 'marée basse'}
          </Text>
          <Text style={styles.heure}>{maree.heure}</Text>
          {maree.coefficient != null && (
            <Text style={styles.coeff}>Coeff. {maree.coefficient}</Text>
          )}
        </View>
      </View>
      <View style={styles.right}>
        <Text style={styles.countdownLabel}>Dans</Text>
        <Text style={styles.countdown}>{countdown}</Text>
        <Text style={styles.hauteur}>{maree.hauteur.toFixed(2)} m</Text>
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  label: {
    ...Typography.label,
    color: 'rgba(255,255,255,0.6)',
  },
  heure: {
    ...Typography.h3,
    color: Colors.white,
  },
  coeff: {
    ...Typography.caption,
    color: Colors.sand,
  },
  right: {
    alignItems: 'flex-end',
  },
  countdownLabel: {
    ...Typography.label,
    color: 'rgba(255,255,255,0.6)',
  },
  countdown: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.sand,
  },
  hauteur: {
    ...Typography.bodyMd,
    color: 'rgba(255,255,255,0.65)',
    marginTop: 2,
  },
})

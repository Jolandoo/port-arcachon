import { View, Text, StyleSheet } from 'react-native'
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

  return (
    <View style={[styles.container, isHaute ? styles.haute : styles.basse]}>
      <View style={styles.left}>
        <Ionicons
          name={isHaute ? 'arrow-up-circle' : 'arrow-down-circle'}
          size={36}
          color={isHaute ? Colors.ocean : Colors.oceanMid}
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
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  haute: { backgroundColor: Colors.oceanLight },
  basse: { backgroundColor: Colors.sandLight },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  label: {
    ...Typography.label,
    color: Colors.gray500,
  },
  heure: {
    ...Typography.h3,
    color: Colors.gray900,
  },
  coeff: {
    ...Typography.caption,
    color: Colors.oceanMid,
  },
  right: {
    alignItems: 'flex-end',
  },
  countdownLabel: {
    ...Typography.label,
    color: Colors.gray500,
  },
  countdown: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.ocean,
  },
  hauteur: {
    ...Typography.bodyMd,
    color: Colors.gray500,
    marginTop: 2,
  },
})

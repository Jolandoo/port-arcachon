import { View, Text, StyleSheet } from 'react-native'
import { Colors, Typography, Spacing } from '@/constants'

interface InfoRowProps {
  label: string
  value: string
  last?: boolean
}

export function InfoRow({ label, value, last = false }: InfoRowProps) {
  return (
    <View style={[styles.row, !last && styles.separator]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  label: {
    ...Typography.bodyMd,
    color: Colors.gray500,
    flex: 1,
  },
  value: {
    ...Typography.bodyMd,
    color: Colors.gray900,
    fontWeight: '500',
    flexShrink: 1,
    textAlign: 'right',
  },
})

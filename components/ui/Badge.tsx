import { View, Text, StyleSheet } from 'react-native'
import { Colors, Typography } from '@/constants'

type BadgeType = 'info' | 'warning' | 'danger' | 'success' | 'default'

interface BadgeProps {
  label: string
  type?: BadgeType
}

const BG: Record<BadgeType, string> = {
  info:    Colors.info,
  warning: Colors.warning,
  danger:  Colors.danger,
  success: Colors.success,
  default: Colors.gray300,
}

const FG: Record<BadgeType, string> = {
  info:    Colors.white,
  warning: Colors.white,
  danger:  Colors.white,
  success: Colors.white,
  default: Colors.gray900,
}

export function Badge({ label, type = 'default' }: BadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor: BG[type] }]}>
      <Text style={[styles.label, { color: FG[type] }]}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  label: {
    ...Typography.label,
    textTransform: 'uppercase',
  },
})

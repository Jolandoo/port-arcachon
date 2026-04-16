import { View, StyleSheet, ViewStyle, Platform } from 'react-native'
import { Colors, Spacing } from '@/constants'

type SpacingKey = keyof typeof Spacing

interface CardProps {
  children: React.ReactNode
  style?: ViewStyle
  padding?: SpacingKey
}

export function Card({ children, style, padding = 'md' }: CardProps) {
  return (
    <View style={[styles.card, { padding: Spacing[padding] }, style]}>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: Colors.gray900,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
})

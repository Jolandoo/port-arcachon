import { ViewStyle, Platform, StyleSheet } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

type GradientColors = readonly [string, string, ...string[]]

interface GradientCardProps {
  children: React.ReactNode
  colors?: GradientColors
  start?: { x: number; y: number }
  end?: { x: number; y: number }
  style?: ViewStyle
  borderRadius?: number
}

export function GradientCard({
  children,
  colors = ['#1A3059', '#2A5499'],
  start = { x: 0, y: 0 },
  end   = { x: 1, y: 1 },
  style,
  borderRadius = 16,
}: GradientCardProps) {
  return (
    <LinearGradient
      colors={colors}
      start={start}
      end={end}
      style={[styles.card, { borderRadius }, style]}
    >
      {children}
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.18,
        shadowRadius: 12,
      },
      android: {
        elevation: 5,
      },
    }),
  },
})

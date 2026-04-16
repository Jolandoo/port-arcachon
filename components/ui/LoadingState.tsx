import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import { Colors, Typography, Spacing } from '@/constants'

interface LoadingStateProps {
  message?: string
  fullScreen?: boolean
}

export function LoadingState({ message, fullScreen = false }: LoadingStateProps) {
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <ActivityIndicator size="large" color={Colors.ocean} />
      {message != null && <Text style={styles.message}>{message}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  fullScreen: {
    flex: 1,
    backgroundColor: Colors.gray50,
  },
  message: {
    ...Typography.bodyMd,
    color: Colors.gray500,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
})

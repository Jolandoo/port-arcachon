import { View, Text, StyleSheet } from 'react-native'
import { Colors, Typography, Spacing } from '@/constants'

export default function ParametresScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Paramètres</Text>
      <Text style={styles.subtitle}>À venir — Préférences et notifications</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.gray50, padding: Spacing.md },
  title: { ...Typography.h2, color: Colors.gray900 },
  subtitle: { ...Typography.body, color: Colors.gray500, marginTop: Spacing.sm },
})

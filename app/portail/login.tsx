import { View, Text, StyleSheet } from 'react-native'
import { Colors, Typography, Spacing } from '@/constants'

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>
      <Text style={styles.subtitle}>Espace plaisanciers</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.oceanDark, padding: Spacing.md },
  title: { ...Typography.h1, color: Colors.white },
  subtitle: { ...Typography.body, color: Colors.oceanLight, marginTop: Spacing.sm },
})

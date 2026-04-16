import { Stack } from 'expo-router'
import { Colors } from '@/constants'

export default function PortailLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.oceanDark },
        headerTintColor: Colors.white,
      }}
    >
      <Stack.Screen name="login" options={{ title: 'Connexion', headerShown: false }} />
      <Stack.Screen name="dashboard" options={{ title: 'Mon espace' }} />
    </Stack>
  )
}

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Stack } from 'expo-router'
import { Colors } from '@/constants'

const queryClient = new QueryClient()

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="portail" options={{ headerShown: false }} />
        <Stack.Screen
          name="urgences"
          options={{
            title: 'Urgences',
            headerStyle: { backgroundColor: Colors.oceanDark },
            headerTintColor: Colors.white,
          }}
        />
        <Stack.Screen
          name="parametres"
          options={{
            title: 'Paramètres',
            headerStyle: { backgroundColor: Colors.oceanDark },
            headerTintColor: Colors.white,
          }}
        />
      </Stack>
    </QueryClientProvider>
  )
}

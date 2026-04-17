import { Tabs, router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { TouchableOpacity, Image, View, Text, StyleSheet } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { Colors, Typography } from '@/constants'
import { useUserStore } from '@/store/userStore'

type IoniconName = React.ComponentProps<typeof Ionicons>['name']

interface TabConfig {
  name: string
  title: string
  icon: IoniconName
  iconOutline: IoniconName
}

const TABS: TabConfig[] = [
  { name: 'index',      title: "Accueil", icon: 'home',         iconOutline: 'home-outline' },
  { name: 'meteo',      title: 'Météo',            icon: 'partly-sunny', iconOutline: 'partly-sunny-outline' },
  { name: 'port',       title: 'Plan du port',    icon: 'map',          iconOutline: 'map-outline' },
  { name: 'services',   title: 'Services',        icon: 'grid',         iconOutline: 'grid-outline' },
  { name: 'actualites', title: 'Actualités',      icon: 'newspaper',    iconOutline: 'newspaper-outline' },
]

function HeaderLogo() {
  return (
    <Image
      source={require('../../assets/images/logo.png')}
      style={{ width: 80, height: 40 }}
      resizeMode="contain"
    />
  )
}

function HeaderAccount() {
  const { user, isAuthenticated } = useUserStore()

  if (isAuthenticated && user) {
    const initiales = user.nom.split(' ').map((n) => n[0]).join('').toUpperCase()
    return (
      <TouchableOpacity
        style={styles.accountBtn}
        onPress={() => router.push('/portail/dashboard')}
        accessibilityLabel="Mon espace"
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initiales}</Text>
        </View>
        <View>
          <Text style={styles.accountLabel} numberOfLines={1}>{user.nom.split(' ')[0]}</Text>
          <Text style={styles.accountSub}>Anneau {user.anneauNumero}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <TouchableOpacity
      style={styles.accountBtn}
      onPress={() => router.push('/portail/login')}
      accessibilityLabel="Connexion"
    >
      <View style={[styles.avatar, styles.avatarGuest]}>
        <Ionicons name="person-outline" size={16} color={Colors.white} />
      </View>
      <Text style={styles.accountLabel}>Connexion</Text>
    </TouchableOpacity>
  )
}

function HeaderSettings() {
  return (
    <TouchableOpacity
      onPress={() => router.push('/parametres')}
      style={{ marginRight: 16, padding: 4 }}
      accessibilityLabel="Paramètres"
    >
      <Ionicons name="settings-outline" size={22} color={Colors.white} />
    </TouchableOpacity>
  )
}

export default function TabsLayout() {
  return (
    <>
      <StatusBar style="light" backgroundColor={Colors.oceanDark} />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor:   Colors.ocean,
          tabBarInactiveTintColor: Colors.gray500,
          headerStyle:      { backgroundColor: Colors.oceanDark },
          headerTintColor:  Colors.white,
          headerTitleAlign: 'center',
          headerTitle:  () => <HeaderLogo />,
          headerLeft:   () => <HeaderAccount />,
          headerRight:  () => <HeaderSettings />,
        }}
      >
        {TABS.map((tab) => (
          <Tabs.Screen
            key={tab.name}
            name={tab.name}
            options={{
              tabBarLabel: tab.title,
              tabBarIcon: ({ focused, color, size }) => (
                <Ionicons
                  name={focused ? tab.icon : tab.iconOutline}
                  size={size}
                  color={color}
                />
              ),
            }}
          />
        ))}
      </Tabs>
    </>
  )
}

const styles = StyleSheet.create({
  accountBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginLeft: 12,
    maxWidth: 120,
  },
  avatar: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: Colors.ocean,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: Colors.white + '40',
  },
  avatarGuest: { backgroundColor: Colors.white + '20' },
  avatarText: { ...Typography.bodySm, color: Colors.white, fontWeight: '700' },
  accountLabel: { ...Typography.bodySm, color: Colors.white, fontWeight: '600', maxWidth: 80 },
  accountSub:   { fontSize: 10, color: Colors.white + 'AA', lineHeight: 13 },
})

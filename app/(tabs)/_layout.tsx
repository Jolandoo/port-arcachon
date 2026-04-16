import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar'
import { Colors } from '@/constants'

type IoniconName = React.ComponentProps<typeof Ionicons>['name']

interface TabConfig {
  name: string
  title: string
  icon: IoniconName
  iconOutline: IoniconName
}

const TABS: TabConfig[] = [
  { name: 'index',      title: "Port d'Arcachon",  icon: 'home',         iconOutline: 'home-outline' },
  { name: 'meteo',      title: 'Météo',             icon: 'partly-sunny', iconOutline: 'partly-sunny-outline' },
  { name: 'port',       title: 'Plan du port',     icon: 'map',          iconOutline: 'map-outline' },
  { name: 'services',   title: 'Services',         icon: 'grid',         iconOutline: 'grid-outline' },
  { name: 'actualites', title: 'Actualités',       icon: 'newspaper',    iconOutline: 'newspaper-outline' },
]

export default function TabsLayout() {
  return (
    <>
      <StatusBar style="light" backgroundColor={Colors.oceanDark} />
      <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.ocean,
        tabBarInactiveTintColor: Colors.gray500,
        headerStyle: { backgroundColor: Colors.oceanDark },
        headerTintColor: Colors.white,
      }}
    >
      {TABS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
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

import { useEffect, useRef } from 'react'
import { Animated, ViewStyle, Easing } from 'react-native'

interface FadeInViewProps {
  children: React.ReactNode
  delay?: number
  style?: ViewStyle
  from?: 'bottom' | 'top' | 'left' | 'right' | 'none'
  distance?: number
}

export function FadeInView({ children, delay = 0, style, from = 'bottom', distance = 16 }: FadeInViewProps) {
  const opacity    = useRef(new Animated.Value(0)).current
  const translateY = useRef(new Animated.Value(from === 'bottom' ? distance : from === 'top' ? -distance : 0)).current
  const translateX = useRef(new Animated.Value(from === 'left' ? -distance : from === 'right' ? distance : 0)).current

  useEffect(() => {
    const easing = Easing.out(Easing.cubic)
    Animated.parallel([
      Animated.timing(opacity,    { toValue: 1, duration: 350, delay, easing, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 400, delay, easing, useNativeDriver: true }),
      Animated.timing(translateX, { toValue: 0, duration: 400, delay, easing, useNativeDriver: true }),
    ]).start()
  }, [])

  return (
    <Animated.View style={[{ opacity, transform: [{ translateY }, { translateX }] }, style]}>
      {children}
    </Animated.View>
  )
}

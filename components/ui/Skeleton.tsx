import { useEffect, useRef } from 'react'
import { View, ViewStyle, Animated, StyleSheet } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Colors } from '@/constants'

interface SkeletonProps {
  width?: number | `${number}%`
  height?: number
  borderRadius?: number
  style?: ViewStyle
}

export function Skeleton({ width = '100%', height = 16, borderRadius = 8, style }: SkeletonProps) {
  const shimmer = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmer, {
        toValue: 1,
        duration: 1100,
        useNativeDriver: true,
      }),
    ).start()
    return () => shimmer.stopAnimation()
  }, [shimmer])

  // Translate from -width to +width — we approximate with a large fixed value
  // since we don't know pixel width ahead of time. Works for most screen widths.
  const translateX = shimmer.interpolate({
    inputRange:  [0, 1],
    outputRange: [-400, 400],
  })

  return (
    <View style={[{ width, height, borderRadius, backgroundColor: Colors.gray100, overflow: 'hidden' }, style]}>
      <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ translateX }] }]}>
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.6)', 'transparent']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  )
}

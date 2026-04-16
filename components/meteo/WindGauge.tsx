import { useEffect, useRef } from 'react'
import { View, Text, StyleSheet, Animated } from 'react-native'
import { Colors, Typography } from '@/constants'
import { conditionColor, windCondition } from '@/utils/meteo'

interface WindGaugeProps {
  direction: number   // degrés 0–360
  speed: number       // nœuds
}

const SIZE = 180
const ARROW_HEIGHT = SIZE * 0.38

export function WindGauge({ direction, speed }: WindGaugeProps) {
  const rotation = useRef(new Animated.Value(direction)).current
  const condition = windCondition(speed)
  const arrowColor = conditionColor(condition)

  useEffect(() => {
    Animated.spring(rotation, {
      toValue: direction,
      damping: 14,
      stiffness: 80,
      useNativeDriver: true,
    }).start()
  }, [direction])

  const arrowStyle = {
    transform: [{
      rotate: rotation.interpolate({
        inputRange: [0, 360],
        outputRange: ['0deg', '360deg'],
      }),
    }],
  }

  return (
    <View style={styles.container}>
      {/* Cadran */}
      <View style={styles.dial}>
        {/* Points cardinaux */}
        <Text style={[styles.cardinal, styles.cardN]}>N</Text>
        <Text style={[styles.cardinal, styles.cardS]}>S</Text>
        <Text style={[styles.cardinal, styles.cardE]}>E</Text>
        <Text style={[styles.cardinal, styles.cardO]}>O</Text>

        {/* Flèche animée */}
        <Animated.View style={[styles.arrowContainer, arrowStyle] as object}>
          {/* Pointe */}
          <View style={[styles.arrowHead, { borderBottomColor: arrowColor }]} />
          {/* Corps */}
          <View style={[styles.arrowBody, { backgroundColor: arrowColor }]} />
        </Animated.View>

        {/* Vitesse au centre */}
        <View style={styles.center}>
          <Text style={[styles.speedValue, { color: arrowColor }]}>
            {Math.round(speed)}
          </Text>
          <Text style={styles.speedUnit}>kt</Text>
        </View>
      </View>

      <Text style={styles.label}>Direction du vent</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 8,
  },
  dial: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    borderWidth: 2,
    borderColor: Colors.gray100,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cardinal: {
    ...Typography.label,
    color: Colors.gray500,
    position: 'absolute',
  },
  cardN: { top: 8 },
  cardS: { bottom: 8 },
  cardE: { right: 10 },
  cardO: { left: 10 },
  arrowContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: SIZE,
    height: SIZE,
  },
  arrowHead: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: ARROW_HEIGHT * 0.45,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: Colors.ocean,
    marginBottom: -2,
    marginTop: -(ARROW_HEIGHT * 0.55),
  },
  arrowBody: {
    width: 4,
    height: ARROW_HEIGHT * 0.55,
    backgroundColor: Colors.ocean,
    borderRadius: 2,
  },
  center: {
    alignItems: 'center',
  },
  speedValue: {
    fontSize: 22,
    fontWeight: '700',
  },
  speedUnit: {
    ...Typography.label,
    color: Colors.gray500,
  },
  label: {
    ...Typography.caption,
    color: Colors.gray500,
  },
})

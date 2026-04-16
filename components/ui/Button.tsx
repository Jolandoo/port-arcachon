import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native'
import { Colors, Spacing, Typography } from '@/constants'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps {
  label: string
  onPress: () => void
  variant?: Variant
  size?: Size
  disabled?: boolean
  loading?: boolean
  accessibilityLabel?: string
}

const HEIGHT: Record<Size, number> = { sm: 36, md: 44, lg: 52 }
const FONT_SIZE: Record<Size, number> = { sm: 13, md: 15, lg: 16 }
const H_PADDING: Record<Size, number> = { sm: Spacing.sm, md: Spacing.md, lg: Spacing.lg }

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  accessibilityLabel,
}: ButtonProps) {
  const containerStyle: ViewStyle[] = [
    styles.base,
    { height: HEIGHT[size], paddingHorizontal: H_PADDING[size] },
    variant === 'primary' && styles.primary,
    variant === 'secondary' && styles.secondary,
    variant === 'ghost' && styles.ghost,
    (disabled || loading) && styles.disabled,
  ].filter(Boolean) as ViewStyle[]

  const textStyle: TextStyle = {
    fontSize: FONT_SIZE[size],
    fontWeight: '600',
    color:
      variant === 'primary'
        ? Colors.white
        : Colors.ocean,
  }

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="button"
      activeOpacity={0.75}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? Colors.white : Colors.ocean} />
      ) : (
        <Text style={textStyle}>{label}</Text>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  primary: {
    backgroundColor: Colors.ocean,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.ocean,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.45,
  },
})

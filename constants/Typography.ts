import { TextStyle } from 'react-native'

export const Typography: Record<string, TextStyle> = {
  h1: { fontSize: 28, fontWeight: '700', lineHeight: 34 },
  h2: { fontSize: 22, fontWeight: '600', lineHeight: 28 },
  h3: { fontSize: 18, fontWeight: '600', lineHeight: 24 },
  body:    { fontSize: 16, fontWeight: '400', lineHeight: 24 },
  bodyMd:  { fontSize: 14, fontWeight: '400', lineHeight: 20 },
  bodySm:  { fontSize: 12, fontWeight: '400', lineHeight: 16 },
  label:   { fontSize: 11, fontWeight: '600', letterSpacing: 0.8 },
  caption: { fontSize: 12, fontWeight: '400' },
}

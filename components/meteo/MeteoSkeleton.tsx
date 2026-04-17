import { ScrollView, View, StyleSheet } from 'react-native'
import { Colors, Spacing } from '@/constants'
import { Skeleton } from '@/components/ui'

function SkeletonCard({ children }: { children: React.ReactNode }) {
  return <View style={styles.card}>{children}</View>
}

export function MeteoSkeleton() {
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} scrollEnabled={false}>

      {/* SectionHeader */}
      <Skeleton width="40%" height={14} borderRadius={6} style={styles.header} />

      {/* MeteoCard */}
      <SkeletonCard>
        <View style={styles.row}>
          <View>
            <Skeleton width={120} height={52} borderRadius={8} />
            <Skeleton width={90}  height={14} borderRadius={6} style={styles.gap4} />
          </View>
          <Skeleton width={64} height={64} borderRadius={16} />
        </View>
        <View style={styles.divider} />
        <View style={styles.windRow}>
          {[0, 1, 2, 3].map((i) => (
            <View key={i} style={styles.windItem}>
              <Skeleton width={40} height={10} borderRadius={4} />
              <Skeleton width={48} height={22} borderRadius={6} style={styles.gap4} />
              <Skeleton width={30} height={10} borderRadius={4} style={styles.gap4} />
            </View>
          ))}
        </View>
      </SkeletonCard>

      {/* WindGauge */}
      <View style={styles.gaugeArea}>
        <Skeleton width={160} height={160} borderRadius={80} />
      </View>

      {/* SectionHeader marées */}
      <Skeleton width="30%" height={14} borderRadius={6} style={styles.header} />

      {/* ProchaineMaree */}
      <SkeletonCard>
        <View style={styles.row}>
          <Skeleton width={48} height={48} borderRadius={24} />
          <View style={{ flex: 1, gap: Spacing.xs }}>
            <Skeleton width="50%" height={12} borderRadius={5} />
            <Skeleton width="70%" height={18} borderRadius={6} />
          </View>
          <View style={{ alignItems: 'flex-end', gap: Spacing.xs }}>
            <Skeleton width={30} height={10} borderRadius={4} />
            <Skeleton width={60} height={22} borderRadius={6} />
          </View>
        </View>
      </SkeletonCard>

      {/* TideChart */}
      <View style={[styles.card, { marginTop: Spacing.sm }]}>
        <Skeleton width="100%" height={80} borderRadius={8} />
      </View>

      {/* SectionHeader prévisions */}
      <Skeleton width="45%" height={14} borderRadius={6} style={styles.header} />

      {/* Prévisions 7j */}
      <View style={styles.prevRow}>
        {[0, 1, 2, 3, 4].map((i) => (
          <View key={i} style={styles.prevItem}>
            <Skeleton width={44} height={10} borderRadius={4} />
            <Skeleton width={36} height={36} borderRadius={10} style={styles.gap4} />
            <Skeleton width={44} height={16} borderRadius={5} style={styles.gap4} />
            <Skeleton width={36} height={12} borderRadius={4} style={styles.gap4} />
          </View>
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scroll: { backgroundColor: Colors.gray50 },
  content: { padding: Spacing.md },
  header: { marginBottom: Spacing.sm, marginTop: Spacing.xs },
  gap4: { marginTop: 4 },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  divider: { height: 1, backgroundColor: Colors.gray100, marginVertical: Spacing.sm },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  windRow: { flexDirection: 'row', justifyContent: 'space-around', paddingTop: Spacing.xs },
  windItem: { alignItems: 'center', gap: 0 },
  gaugeArea: { alignItems: 'center', paddingVertical: Spacing.lg },
  prevRow: { flexDirection: 'row', gap: Spacing.sm },
  prevItem: { alignItems: 'center', gap: 0 },
})

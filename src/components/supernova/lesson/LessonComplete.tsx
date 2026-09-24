import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/supernova/PrimaryButton';
import { Radii, Space } from '@/constants/theme';
import { useTheme } from '@/lib/theme/ThemeProvider';

export interface LessonStats {
  scorePercent: number;
  wordsUsed: number;
  elapsedSeconds: number;
  mistakes: string[];
  title: string;
  subtitle: string;
}

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function LessonComplete({ stats, onDone }: { stats: LessonStats; onDone: () => void }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.celebrationEmoji}>🎉</Text>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="checkmark-circle" size={22} color={colors.healthy} />
          <Text style={styles.cardHeaderText}>Lesson Complete</Text>
        </View>
        <Text style={styles.title}>{stats.title}</Text>
        <Text style={styles.subtitle}>{stats.subtitle}</Text>

        <StatRow icon="flash" color={colors.brandOrange} label="Lesson score" value={`${stats.scorePercent}%`} styles={styles} />
        <StatRow icon="chatbubble-ellipses" color={colors.attention} label="English words used" value={`${stats.wordsUsed}`} styles={styles} />
        <StatRow icon="time" color="#F06CA0" label="Learning time" value={formatTime(stats.elapsedSeconds)} styles={styles} />
      </View>

      <Text style={styles.improvementsHeader}>IMPROVEMENTS</Text>
      {stats.mistakes.length === 0 ? (
        <View style={styles.improvementCard}>
          <Text style={styles.improvementText}>No repeated mistakes — great job! 🎯</Text>
        </View>
      ) : (
        stats.mistakes.map((m, i) => (
          <View key={i} style={styles.improvementCard}>
            <Text style={styles.improvementText}>{m}</Text>
          </View>
        ))
      )}

      <PrimaryButton label="DONE" onPress={onDone} style={styles.doneButton} />
    </ScrollView>
  );
}

function StatRow({
  icon,
  color,
  label,
  value,
  styles,
}: {
  icon: any;
  color: string;
  label: string;
  value: string;
  styles: ReturnType<typeof createStyles>;
}) {
  return (
    <View style={styles.statRow}>
      <View style={[styles.statIcon, { backgroundColor: `${color}22` }]}>
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
    </View>
  );
}

function createStyles(colors: ReturnType<typeof useTheme>['colors']) {
  return StyleSheet.create({
    container: {
      padding: Space.xl,
      gap: Space.lg,
      alignItems: 'stretch',
    },
    celebrationEmoji: {
      fontSize: 64,
      textAlign: 'center',
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: Radii.lg,
      padding: Space.xl,
      gap: Space.md,
      borderWidth: 1,
      borderColor: colors.cardBorder,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Space.sm,
    },
    cardHeaderText: {
      color: colors.healthy,
      fontWeight: '800',
      fontSize: 16,
    },
    title: {
      color: colors.graphite,
      fontSize: 18,
      fontWeight: '700',
    },
    subtitle: {
      color: colors.muted,
      marginBottom: Space.sm,
    },
    statRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Space.md,
      paddingVertical: Space.sm,
      borderTopWidth: 1,
      borderTopColor: colors.cardBorder,
    },
    statIcon: {
      width: 32,
      height: 32,
      borderRadius: Radii.sm,
      alignItems: 'center',
      justifyContent: 'center',
    },
    statLabel: {
      color: colors.graphite,
      flex: 1,
      fontSize: 15,
    },
    statValue: {
      fontWeight: '800',
      fontSize: 16,
    },
    improvementsHeader: {
      color: colors.textMuted,
      fontWeight: '800',
      fontSize: 12,
      letterSpacing: 1,
      marginTop: Space.md,
    },
    improvementCard: {
      backgroundColor: colors.card,
      borderRadius: Radii.md,
      padding: Space.lg,
      borderWidth: 1,
      borderColor: colors.cardBorder,
    },
    improvementText: {
      color: colors.graphite,
      fontSize: 15,
    },
    doneButton: {
      marginTop: Space.lg,
    },
  });
}

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/supernova/PrimaryButton';
import { Colors, Radii, Space } from '@/constants/palette';
import { fetchAvailableDays } from '@/lib/api/lessons';
import { getDaysForWeek, getWeek } from '@/lib/curriculum/data';
import { questTypeIcon } from '@/lib/curriculum/questIcons';
import type { DayRecord, QuestType } from '@/lib/curriculum/types';

const CURRENT_WEEK = 1;

export default function HomeScreen() {
  const week = getWeek(CURRENT_WEEK)!;
  const daysInWeek = getDaysForWeek(CURRENT_WEEK);
  const today = daysInWeek[0];

  // null = still loading (every day renders locked until this resolves, to
  // avoid a flash of "unlocked" before we actually know).
  const [availableDays, setAvailableDays] = useState<number[] | null>(null);
  const [serverUnreachable, setServerUnreachable] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchAvailableDays(CURRENT_WEEK)
      .then((days) => {
        if (!cancelled) setAvailableDays(days);
      })
      .catch(() => {
        if (!cancelled) {
          setAvailableDays([]);
          setServerUnreachable(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.wordmark}>Supernova</Text>
          <Text style={styles.wordmarkSubtitle}>Everyday Confidence · Beginner</Text>
        </View>

        {serverUnreachable && (
          <View style={styles.warningBanner}>
            <Ionicons name="warning" size={16} color={Colors.warning} />
            <Text style={styles.warningText}>
              Can&apos;t reach the lesson server — run `npm run server` (and Postgres) to unlock lessons.
            </Text>
          </View>
        )}

        <View style={styles.weekCard}>
          <Text style={styles.sectionLabel}>SECTION 1 · WEEK {week.week}</Text>
          <Text style={styles.weekArc}>{week.week_arc}</Text>
          <Text style={styles.weeklyOutcome}>{week.weekly_outcome}</Text>
        </View>

        <TodayCard day={today} ready={availableDays?.includes(today.day) ?? false} />

        <Text style={styles.pathHeader}>This week</Text>
        <View style={styles.path}>
          {daysInWeek.map((d) => (
            <DayRow key={d.day} day={d} ready={availableDays?.includes(d.day) ?? false} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function TodayCard({ day, ready }: { day: DayRecord; ready: boolean }) {
  const quests = [
    [day.quest_1, day.quest_1_type],
    [day.quest_2, day.quest_2_type],
    [day.quest_3, day.quest_3_type],
    [day.quest_4, day.quest_4_type],
  ].filter(([title]) => !!title) as [string, QuestType][];

  return (
    <View style={styles.todayCard}>
      <View style={styles.todayHeaderRow}>
        <Text style={styles.todayLabel}>TODAY · DAY {day.day}</Text>
        <Text style={styles.todayMinutes}>~{day.estimated_minutes} min</Text>
      </View>
      <Text style={styles.todayOutcome}>{day.daily_mini_outcome}</Text>

      <View style={styles.questChipsRow}>
        {quests.map(([title, type]) => (
          <View key={title} style={styles.questChip}>
            <Ionicons name={questTypeIcon[type]} size={14} color={Colors.primary} />
            <Text style={styles.questChipText}>{title}</Text>
          </View>
        ))}
      </View>

      <PrimaryButton
        label={ready ? 'Start Lesson' : 'Coming Soon'}
        disabled={!ready}
        onPress={() => router.push({ pathname: '/lesson', params: { week: String(day.week), day: String(day.day) } })}
        style={styles.startButton}
      />
    </View>
  );
}

function DayRow({ day, ready }: { day: DayRecord; ready: boolean }) {
  return (
    <Pressable
      disabled={!ready}
      onPress={() =>
        router.push({ pathname: '/lesson', params: { week: String(day.week), day: String(day.day) } })
      }
      style={[styles.dayRow, !ready && styles.dayRowLocked]}>
      <View style={[styles.dayCircle, ready && styles.dayCircleActive]}>
        {ready ? (
          <Text style={styles.dayCircleText}>{day.day}</Text>
        ) : (
          <Ionicons name="lock-closed" size={16} color={Colors.textMuted} />
        )}
      </View>
      <View style={styles.dayRowBody}>
        <Text style={styles.dayRowTitle}>Day {day.day}</Text>
        <Text style={styles.dayRowOutcome}>{day.daily_mini_outcome}</Text>
      </View>
      {!ready ? <Text style={styles.soonTag}>Soon</Text> : <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  content: {
    padding: Space.lg,
    gap: Space.lg,
    paddingBottom: Space.xxl,
  },
  header: {
    paddingVertical: Space.md,
  },
  wordmark: {
    color: Colors.text,
    fontSize: 26,
    fontWeight: '800',
  },
  wordmarkSubtitle: {
    color: Colors.textSecondary,
    marginTop: 2,
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.sm,
    backgroundColor: Colors.warningMuted,
    borderRadius: Radii.md,
    padding: Space.md,
  },
  warningText: {
    color: Colors.warning,
    fontSize: 12,
    flex: 1,
  },
  weekCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radii.lg,
    padding: Space.lg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    gap: Space.xs,
  },
  sectionLabel: {
    color: Colors.primary,
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  weekArc: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  weeklyOutcome: {
    color: Colors.textSecondary,
    marginTop: Space.xs,
  },
  todayCard: {
    backgroundColor: Colors.bgCardAlt,
    borderRadius: Radii.lg,
    padding: Space.lg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    gap: Space.md,
  },
  todayHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  todayLabel: {
    color: Colors.success,
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  todayMinutes: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  todayOutcome: {
    color: Colors.text,
    fontSize: 19,
    fontWeight: '700',
  },
  questChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Space.sm,
  },
  questChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.pillBg,
    borderRadius: Radii.pill,
    paddingVertical: Space.xs,
    paddingHorizontal: Space.md,
  },
  questChipText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  startButton: {
    marginTop: Space.sm,
  },
  pathHeader: {
    color: Colors.textMuted,
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 1,
    marginTop: Space.sm,
  },
  path: {
    gap: Space.sm,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.md,
    backgroundColor: Colors.bgCard,
    borderRadius: Radii.md,
    padding: Space.md,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  dayRowLocked: {
    opacity: 0.55,
  },
  dayCircle: {
    width: 40,
    height: 40,
    borderRadius: Radii.pill,
    backgroundColor: Colors.trackBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircleActive: {
    backgroundColor: Colors.primary,
  },
  dayCircleText: {
    color: '#fff',
    fontWeight: '800',
  },
  dayRowBody: {
    flex: 1,
  },
  dayRowTitle: {
    color: Colors.text,
    fontWeight: '700',
    fontSize: 14,
  },
  dayRowOutcome: {
    color: Colors.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  soonTag: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
  },
});

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { ActivityIndicator, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { LearningPath, nextPathIndex } from '@/components/supernova/LearningPath';
import { PrimaryButton } from '@/components/supernova/PrimaryButton';
import { Radii, Space } from '@/constants/theme';
import { useTheme } from '@/lib/theme/ThemeProvider';
import { fetchRoadmap, type DayRow as DayData, type RoadmapWeek } from '@/lib/api/curriculum';
import { questTypeIcon } from '@/lib/curriculum/questIcons';
import type { QuestType } from '@/lib/curriculum/types';

// Caps the page to a centered column on wide viewports (web/desktop)
// instead of stretching a mobile-shaped layout edge-to-edge.
const MAX_CONTENT_WIDTH = 640;

export default function HomeScreen() {
  const { colors } = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const contentWidth = Math.min(windowWidth, MAX_CONTENT_WIDTH);
  const styles = useMemo(() => createStyles(colors), [colors]);
  // undefined = still loading, null = the API/Postgres couldn't be reached.
  const [roadmap, setRoadmap] = useState<RoadmapWeek[] | null | undefined>(undefined);
  const [serverUnreachable, setServerUnreachable] = useState(false);
  // Bumping this re-runs the fetch effect below — used both for the manual
  // Retry button and for automatic retries while unreachable.
  const [retryTick, setRetryTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetchRoadmap()
      .then((weeks) => {
        if (cancelled) return;
        setRoadmap(weeks);
        setServerUnreachable(false);
      })
      .catch(() => {
        if (!cancelled) {
          setRoadmap(null);
          setServerUnreachable(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [retryTick]);

  // Auto-retry every few seconds while unreachable (e.g. the local API
  // server or Postgres was mid-restart) — no manual reload should be
  // needed for the app to notice it's back.
  useEffect(() => {
    if (!serverUnreachable) return;
    const id = setInterval(() => setRetryTick((t) => t + 1), 4000);
    return () => clearInterval(id);
  }, [serverUnreachable]);

  const currentWeek = roadmap?.[0];
  const futureWeeks = roadmap?.slice(1) ?? [];
  const today = currentWeek?.days[0];
  const goToDay = (d: DayData) => router.push({ pathname: '/lesson', params: { week: String(d.week), day: String(d.day) } });

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.content, { width: contentWidth }]}>
          <View style={styles.header}>
            <Text style={styles.wordmark}>SuperLearn</Text>
            <Text style={styles.wordmarkSubtitle}>Everyday Confidence · Beginner</Text>
          </View>

          {serverUnreachable && (
            <View style={styles.warningBanner}>
              <Ionicons name="warning" size={16} color={colors.attention} />
              <Text style={styles.warningText}>
                Can&apos;t reach the lesson server — run `npm run server` (and Postgres) to load the curriculum.
                Retrying automatically…
              </Text>
              <Pressable onPress={() => setRetryTick((t) => t + 1)} style={styles.retryButton}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </Pressable>
            </View>
          )}

          {roadmap === undefined ? (
            <ActivityIndicator color={colors.brandOrange} style={styles.loadingIndicator} />
          ) : roadmap === null || !currentWeek ? null : (
            <>
              <View style={styles.weekCard}>
                <Text style={styles.sectionLabel}>SECTION 1 · WEEK {currentWeek.week}</Text>
                <Text style={styles.weekArc}>{currentWeek.week_arc}</Text>
                <Text style={styles.weeklyOutcome}>{currentWeek.weekly_outcome}</Text>
              </View>

              {today && (
                <TodayCard day={today} ready={currentWeek.availableDays.includes(today.day)} styles={styles} colors={colors} />
              )}

              <Text style={styles.pathHeader}>This week</Text>
              <LearningPath
                days={currentWeek.days}
                todayDay={currentWeek.days[0].day}
                ready={(day) => currentWeek.availableDays.includes(day)}
                onSelectDay={goToDay}
                width={contentWidth - Space.lg * 2}
              />

              {/* Whatever's generated beyond the current week keeps
                  appending here, but stays locked — there's no
                  progress/unlock system yet, so only week 1 is playable.
                  Each section's startIndex continues the previous one's
                  snake pattern so the path flows across weeks instead of
                  resetting back to dead center at every boundary. */}
              {futureWeeks.reduce<{ cursor: number; nodes: ReactNode[] }>(
                (acc, w) => {
                  acc.nodes.push(
                    <View key={w.week} style={styles.lockedWeekBlock}>
                      <View style={styles.lockedWeekHeader}>
                        <Ionicons name="lock-closed" size={14} color={colors.textMuted} />
                        <Text style={styles.lockedWeekLabel}>WEEK {w.week}</Text>
                      </View>
                      <Text style={styles.lockedWeekArc}>{w.week_arc}</Text>
                      <LearningPath
                        days={w.days}
                        todayDay={-1}
                        ready={() => false}
                        onSelectDay={goToDay}
                        width={contentWidth - Space.lg * 2}
                        startIndex={acc.cursor}
                      />
                    </View>,
                  );
                  acc.cursor = nextPathIndex(w.days, acc.cursor);
                  return acc;
                },
                { cursor: nextPathIndex(currentWeek.days), nodes: [] },
              ).nodes}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

type Styles = ReturnType<typeof createStyles>;
type Colors = ReturnType<typeof useTheme>['colors'];

function TodayCard({ day, ready, styles, colors }: { day: DayData; ready: boolean; styles: Styles; colors: Colors }) {
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
            <Ionicons name={questTypeIcon[type]} size={14} color={colors.brandOrange} />
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

function createStyles(colors: ReturnType<typeof useTheme>['colors']) {
  return StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      alignItems: 'center',
      backgroundColor: colors.surface,
    },
    content: {
      padding: Space.lg,
      gap: Space.lg,
      paddingBottom: Space.xxl,
      backgroundColor: colors.background,
    },
    header: {
      paddingVertical: Space.md,
    },
    wordmark: {
      color: colors.graphite,
      fontSize: 26,
      fontWeight: '800',
    },
    wordmarkSubtitle: {
      color: colors.muted,
      marginTop: 2,
    },
    warningBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Space.sm,
      backgroundColor: colors.attentionMuted,
      borderRadius: Radii.md,
      padding: Space.md,
    },
    warningText: {
      color: colors.attention,
      fontSize: 12,
      flex: 1,
    },
    retryButton: {
      borderWidth: 1,
      borderColor: colors.attention,
      borderRadius: Radii.sm,
      paddingVertical: Space.xs,
      paddingHorizontal: Space.md,
    },
    retryButtonText: {
      color: colors.attention,
      fontSize: 12,
      fontWeight: '800',
    },
    loadingIndicator: {
      marginTop: Space.xxl,
    },
    weekCard: {
      backgroundColor: colors.card,
      borderRadius: Radii.lg,
      padding: Space.lg,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      gap: Space.xs,
    },
    sectionLabel: {
      color: colors.brandOrange,
      fontWeight: '800',
      fontSize: 12,
      letterSpacing: 0.5,
    },
    weekArc: {
      color: colors.graphite,
      fontSize: 18,
      fontWeight: '700',
    },
    weeklyOutcome: {
      color: colors.muted,
      marginTop: Space.xs,
    },
    todayCard: {
      backgroundColor: colors.card,
      borderRadius: Radii.lg,
      padding: Space.lg,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      gap: Space.md,
    },
    todayHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    todayLabel: {
      color: colors.healthy,
      fontWeight: '800',
      fontSize: 12,
      letterSpacing: 0.5,
    },
    todayMinutes: {
      color: colors.textMuted,
      fontSize: 12,
    },
    todayOutcome: {
      color: colors.graphite,
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
      backgroundColor: colors.surface,
      borderRadius: Radii.pill,
      paddingVertical: Space.xs,
      paddingHorizontal: Space.md,
    },
    questChipText: {
      color: colors.muted,
      fontSize: 12,
      fontWeight: '600',
    },
    startButton: {
      marginTop: Space.sm,
    },
    pathHeader: {
      color: colors.textMuted,
      fontWeight: '800',
      fontSize: 12,
      letterSpacing: 1,
      marginTop: Space.sm,
    },
    lockedWeekBlock: {
      opacity: 0.6,
      marginTop: Space.lg,
      gap: Space.xs,
    },
    lockedWeekHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    lockedWeekLabel: {
      color: colors.textMuted,
      fontWeight: '800',
      fontSize: 12,
      letterSpacing: 1,
    },
    lockedWeekArc: {
      color: colors.muted,
      fontWeight: '700',
      fontSize: 15,
      marginBottom: Space.xs,
    },
  });
}

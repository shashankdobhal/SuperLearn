import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { BuildCard } from '@/components/supernova/lesson/BuildCard';
import { IntroCard } from '@/components/supernova/lesson/IntroCard';
import { LessonComplete, type LessonStats } from '@/components/supernova/lesson/LessonComplete';
import { McqCard } from '@/components/supernova/lesson/McqCard';
import { RuleCard } from '@/components/supernova/lesson/RuleCard';
import { SpeakCard } from '@/components/supernova/lesson/SpeakCard';
import { LanguageToggle, type SupportLanguage } from '@/components/supernova/LanguageToggle';
import { PrimaryButton } from '@/components/supernova/PrimaryButton';
import { ProgressHeader } from '@/components/supernova/ProgressHeader';
import { Radii, Space } from '@/constants/theme';
import { useTheme } from '@/lib/theme/ThemeProvider';
import { fetchDayLesson } from '@/lib/api/lessons';
import { getSkill } from '@/lib/curriculum/data';
import type { DayLesson } from '@/lib/curriculum/lesson-types';

type Phase = 'learn' | 'transition' | 'speak' | 'complete';

interface GradedResult {
  correct: boolean;
  wordsUsed: number;
  mistake?: string;
}

export default function LessonScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const params = useLocalSearchParams<{ week?: string; day?: string }>();
  const week = Number(params.week ?? 1) || 1;
  const day = Number(params.day ?? 1) || 1;

  // undefined = still loading, null = server said this day isn't authored,
  // DayLesson = loaded. See src/lib/api/lessons.ts / server/lessons.ts.
  const [dayLesson, setDayLesson] = useState<DayLesson | null | undefined>(undefined);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [retryTick, setRetryTick] = useState(0);
  const skill = dayLesson ? getSkill(dayLesson.skillId) : undefined;
  const dailyOutcome = dayLesson?.dailyOutcome ?? '';

  const [phase, setPhase] = useState<Phase>('learn');
  const [learnIndex, setLearnIndex] = useState(0);
  const [speakIndex, setSpeakIndex] = useState(0);
  const [language, setLanguage] = useState<SupportLanguage>('hi');
  const [correctCount, setCorrectCount] = useState(0);
  const [totalGraded, setTotalGraded] = useState(0);
  const [wordsUsed, setWordsUsed] = useState(0);
  const [mistakes, setMistakes] = useState<string[]>([]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const startedAt = useRef<number | null>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  useEffect(() => {
    // Params changing while this screen stays mounted isn't a flow the app
    // currently has (Home always navigates here fresh) — so this doesn't
    // reset to a loading state first, only reports the (week, day) it was
    // asked to load.
    let cancelled = false;
    fetchDayLesson(week, day)
      .then((lesson) => {
        if (!cancelled) {
          setDayLesson(lesson);
          setLoadError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err instanceof Error ? err.message : 'Failed to load lesson');
      });
    return () => {
      cancelled = true;
    };
  }, [week, day, retryTick]);

  // Auto-retry every few seconds on a load error (e.g. the local API server
  // or Postgres was mid-restart) rather than staying stuck until reload.
  useEffect(() => {
    if (!loadError) return;
    const id = setInterval(() => setRetryTick((t) => t + 1), 4000);
    return () => clearInterval(id);
  }, [loadError]);


  function recordResult({ correct, wordsUsed: w, mistake }: GradedResult) {
    setTotalGraded((t) => t + 1);
    if (correct) setCorrectCount((c) => c + 1);
    setWordsUsed((total) => total + w);
    if (mistake) setMistakes((m) => (m.includes(mistake) ? m : [...m, mistake]));
  }

  const stats: LessonStats = useMemo(
    () => ({
      scorePercent: totalGraded > 0 ? Math.round((correctCount / totalGraded) * 100) : 100,
      wordsUsed,
      elapsedSeconds,
      mistakes: mistakes.slice(0, 5),
      title: skill?.skill ?? dailyOutcome,
      subtitle: dailyOutcome,
    }),
    [totalGraded, correctCount, wordsUsed, mistakes, skill, dailyOutcome, elapsedSeconds],
  );

  if (loadError) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Couldn&apos;t reach the lesson server</Text>
          <Text style={styles.emptyBody}>
            {loadError}
            {'\n\n'}
            Is the local API running? Start it with{' '}
            <Text style={styles.emptyCode}>npm run server</Text> (needs Postgres running too — see
            docs/CONTENT_DATABASE.md). Retrying automatically…
          </Text>
          <PrimaryButton
            label="RETRY NOW"
            onPress={() => setRetryTick((t) => t + 1)}
            style={styles.emptyButton}
          />
          <PrimaryButton label="BACK" variant="ghost" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  if (dayLesson === undefined) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.emptyState}>
          <ActivityIndicator color={colors.brandOrange} />
        </View>
      </SafeAreaView>
    );
  }

  if (dayLesson === null) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>This lesson isn&apos;t authored yet</Text>
          <Text style={styles.emptyBody}>
            Week {week} / Day {day} exists in the curriculum data, but its task content hasn&apos;t been
            written yet. Check Home for which days are unlocked.
          </Text>
          <PrimaryButton label="BACK" onPress={() => router.back()} style={styles.emptyButton} />
        </View>
      </SafeAreaView>
    );
  }

  const { learnFlow, speakFlow } = dayLesson;

  // Some days (quest_count=1, a pure "Talk with Nova" day — see
  // week-03-day-05.ts) have no learnFlow at all. `phase` still starts at
  // 'learn', so render as if we were already in 'speak' for those days
  // rather than a non-existent learn step — no state transition needed
  // since advanceLearn() is never reachable when learnFlow is empty anyway.
  const effectivePhase: Phase = phase === 'learn' && learnFlow.length === 0 ? 'speak' : phase;

  function closeLesson() {
    router.back();
  }

  function advanceLearn() {
    if (learnIndex + 1 < learnFlow.length) {
      // Functional update, but clamped against `learnFlow.length` itself
      // rather than just incrementing — several onNext calls firing in the
      // same tick (e.g. a fast double-tap) would otherwise all see this
      // same stale `learnIndex` and all take this branch, chaining past
      // the array's end and crashing renderLearnStep() on the next render.
      setLearnIndex((i) => Math.min(i + 1, learnFlow.length - 1));
    } else {
      setPhase('transition');
    }
  }

  function advanceSpeak(w: number) {
    setWordsUsed((total) => total + w);
    if (speakIndex + 1 < speakFlow.length) {
      // Same stale-closure clamp as advanceLearn() above.
      setSpeakIndex((i) => Math.min(i + 1, speakFlow.length - 1));
    } else {
      const start = startedAt.current ?? Date.now();
      setElapsedSeconds(Math.max(1, Math.round((Date.now() - start) / 1000)));
      setPhase('complete');
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <Stack.Screen options={{ headerShown: false }} />

      {effectivePhase === 'learn' && (
        <ProgressHeader progress={learnIndex / learnFlow.length} icon="book" onClose={closeLesson} />
      )}
      {effectivePhase === 'speak' && (
        <ProgressHeader progress={speakIndex / speakFlow.length} icon="chatbubbles" onClose={closeLesson} />
      )}
      {effectivePhase === 'transition' && <ProgressHeader progress={1} icon="book" onClose={closeLesson} />}

      {(effectivePhase === 'learn' || effectivePhase === 'transition') && (
        <View style={styles.langToggleWrap}>
          <LanguageToggle value={language} onChange={setLanguage} />
        </View>
      )}

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {effectivePhase === 'learn' && renderLearnStep()}
        {effectivePhase === 'transition' && renderTransition()}
        {effectivePhase === 'speak' && (
          <SpeakCard
            key={speakFlow[speakIndex].id}
            step={speakFlow[speakIndex]}
            index={speakIndex}
            total={speakFlow.length}
            language={language}
            onComplete={advanceSpeak}
          />
        )}
        {phase === 'complete' && <LessonComplete stats={stats} onDone={() => router.replace('/')} />}
      </ScrollView>
    </SafeAreaView>
  );

  function renderLearnStep() {
    const step = learnFlow[learnIndex];
    switch (step.type) {
      case 'intro':
        return <IntroCard key={step.id} step={step} language={language} onNext={advanceLearn} />;
      case 'rule':
        return <RuleCard key={step.id} step={step} language={language} onNext={advanceLearn} />;
      case 'mcq':
        return (
          <McqCard
            key={step.id}
            step={step}
            language={language}
            onComplete={(correct) => {
              recordResult({
                correct,
                wordsUsed: 0,
                mistake: correct ? undefined : `Re-check: ${step.promptEn}`,
              });
              advanceLearn();
            }}
          />
        );
      case 'build':
        return (
          <BuildCard
            key={step.id}
            step={step}
            language={language}
            onComplete={(correct, missedWord) => {
              recordResult({
                correct,
                wordsUsed: step.answer.length,
                mistake:
                  correct || !missedWord
                    ? undefined
                    : `"${step.promptHi}" → you missed the word "${missedWord}"`,
              });
              advanceLearn();
            }}
          />
        );
    }
  }

  function renderTransition() {
    return (
      <View style={styles.transitionWrap}>
        <View style={styles.novaAvatarLarge}>
          <Text style={styles.novaAvatarLargeText}>N</Text>
        </View>
        <View style={styles.transitionBubble}>
          <Text style={styles.transitionBubbleText}>
            {language === 'hi' ? 'सब done! तुम तो full form में हो!' : "All done! You're on a roll!"}
          </Text>
        </View>

        <View style={styles.transitionCard}>
          <Text style={styles.transitionTitle}>{skill?.skill ?? dailyOutcome}</Text>
          <Text style={styles.transitionSubtitle}>{dailyOutcome}</Text>

          <View style={styles.pathRow}>
            <View style={styles.pathNode}>
              <View style={[styles.pathCircle, styles.pathCircleDone]}>
                <Text style={styles.pathCircleText}>✓</Text>
              </View>
              <Text style={styles.pathLabel}>Learn</Text>
            </View>
            <View style={styles.pathConnector} />
            <View style={styles.pathNode}>
              <View style={[styles.pathCircle, styles.pathCircleActive]} />
              <Text style={styles.pathLabel}>Speak</Text>
            </View>
          </View>

          <PrimaryButton label="Start" onPress={() => setPhase('speak')} style={styles.transitionStart} />
          <PrimaryButton label="Continue Later" variant="ghost" onPress={closeLesson} />
        </View>
      </View>
    );
  }
}

function createStyles(colors: ReturnType<typeof useTheme>['colors']) {
  return StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      padding: Space.lg,
      paddingBottom: Space.xxl,
    },
    langToggleWrap: {
      paddingVertical: Space.sm,
    },
    emptyState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: Space.xl,
      gap: Space.lg,
    },
    emptyTitle: {
      color: colors.graphite,
      fontSize: 20,
      fontWeight: '800',
      textAlign: 'center',
    },
    emptyBody: {
      color: colors.muted,
      textAlign: 'center',
      lineHeight: 22,
    },
    emptyCode: {
      fontFamily: 'monospace',
      color: colors.brandOrange,
    },
    emptyButton: {
      alignSelf: 'stretch',
    },
    transitionWrap: {
      alignItems: 'center',
      gap: Space.lg,
      paddingTop: Space.xl,
    },
    novaAvatarLarge: {
      width: 88,
      height: 88,
      borderRadius: Radii.pill,
      backgroundColor: colors.brandOrange,
      alignItems: 'center',
      justifyContent: 'center',
    },
    novaAvatarLargeText: {
      color: '#FFFFFF',
      fontSize: 32,
      fontWeight: '800',
    },
    transitionBubble: {
      backgroundColor: colors.card,
      borderRadius: Radii.md,
      padding: Space.lg,
      borderWidth: 1,
      borderColor: colors.cardBorder,
    },
    transitionBubbleText: {
      color: colors.healthy,
      fontWeight: '700',
      textAlign: 'center',
    },
    transitionCard: {
      alignSelf: 'stretch',
      marginTop: Space.xl,
      gap: Space.md,
    },
    transitionTitle: {
      color: colors.graphite,
      fontSize: 20,
      fontWeight: '800',
    },
    transitionSubtitle: {
      color: colors.muted,
      marginBottom: Space.lg,
    },
    pathRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: Space.sm,
      marginBottom: Space.xl,
    },
    pathNode: {
      alignItems: 'center',
      gap: Space.xs,
    },
    pathCircle: {
      width: 56,
      height: 56,
      borderRadius: Radii.pill,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 3,
      borderColor: colors.cardBorder,
    },
    pathCircleDone: {
      backgroundColor: colors.healthy,
      borderColor: colors.healthy,
    },
    pathCircleActive: {
      borderColor: colors.brandOrange,
      backgroundColor: colors.brandOrangeMuted,
    },
    pathCircleText: {
      color: '#FFFFFF',
      fontWeight: '800',
      fontSize: 20,
    },
    pathLabel: {
      color: colors.muted,
      fontSize: 13,
    },
    pathConnector: {
      width: 40,
      height: 2,
      backgroundColor: colors.cardBorder,
      marginBottom: 20,
    },
    transitionStart: {
      marginTop: Space.sm,
    },
  });
}

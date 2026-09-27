import { Ionicons } from '@expo/vector-icons';
import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } from 'expo-speech-recognition';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/supernova/PrimaryButton';
import { Radii, Space, Typography } from '@/constants/theme';
import { useTheme } from '@/lib/theme/ThemeProvider';
import { playAudio, stopAllAudio } from '@/lib/audio/ttsAudio';
import { fetchNovaReply, fetchNovaReport, type NovaReportResult, type NovaTurn } from '@/lib/api/nova';

// v1: a fixed 10-minute, fixed-difficulty free-form conversation — not
// adaptive difficulty (see the design discussion this followed). Natural,
// responsive dialogue only.
const SESSION_SECONDS = 10 * 60;
const FALLBACK_OPENER = "Hi! I'm Nova. What's going on today?";
const FALLBACK_REPLY = "Sorry, could you say that again?";

type Phase = 'idle' | 'nova-speaking' | 'listening' | 'thinking' | 'ending' | 'report' | 'mic-error';

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

async function fallbackReport(history: NovaTurn[]): Promise<NovaReportResult> {
  const userTurns = history.filter((t) => t.role === 'user' && t.text.trim().length > 0);
  return {
    overallFeedback:
      userTurns.length > 0
        ? `You completed ${userTurns.length} turn(s) in this conversation — nice work practicing! Detailed feedback isn't available right now, try again in a bit.`
        : "You didn't say much this session — jump back in and try again!",
    grammarIssues: [],
    vocabularyNotes: [],
  };
}

export function NovaConversation() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [phase, setPhase] = useState<Phase>('idle');
  const [history, setHistory] = useState<NovaTurn[]>([]);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [remainingSeconds, setRemainingSeconds] = useState(SESSION_SECONDS);
  const [report, setReport] = useState<NovaReportResult | null>(null);
  const [micErrorMessage, setMicErrorMessage] = useState('');

  const latestTranscript = useRef('');
  const endedRef = useRef(false);
  const phaseRef = useRef<Phase>('idle');
  phaseRef.current = phase;
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    return () => {
      stopAllAudio();
      ExpoSpeechRecognitionModule.stop();
    };
  }, []);

  // Countdown — one ticking interval per active session, independent of
  // which sub-phase (speaking/listening/thinking) is current.
  useEffect(() => {
    if (phase === 'idle' || phase === 'ending' || phase === 'report') return;
    const id = setInterval(() => setRemainingSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [phase]);

  useEffect(() => {
    if (remainingSeconds === 0 && phase !== 'idle' && phase !== 'ending' && phase !== 'report') {
      endSession();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remainingSeconds]);

  useSpeechRecognitionEvent('result', (event) => {
    const text = event.results[0]?.transcript ?? '';
    latestTranscript.current = text;
    setLiveTranscript(text);
  });
  useSpeechRecognitionEvent('end', () => {
    if (phaseRef.current !== 'listening') return; // stray event after we've already moved on
    handleUserTurn(latestTranscript.current);
  });
  useSpeechRecognitionEvent('error', (event) => {
    if (phaseRef.current !== 'listening') return;
    setMicErrorMessage(
      event.error === 'not-allowed'
        ? "Microphone access was denied — check your device's settings to allow it."
        : event.error === 'no-speech'
          ? "Didn't catch that — try again."
          : `Speech recognition error: ${event.message || event.error}`,
    );
    setPhase('mic-error');
  });

  async function startSession() {
    endedRef.current = false;
    setHistory([]);
    setReport(null);
    setRemainingSeconds(SESSION_SECONDS);
    setPhase('nova-speaking');
    const opening = await fetchNovaReply([]).catch(() => ({ reply: FALLBACK_OPENER }));
    if (endedRef.current) return;
    setHistory([{ role: 'nova', text: opening.reply }]);
    await playAudio(opening.reply, 'en');
    if (endedRef.current) return;
    startListening();
  }

  async function startListening() {
    const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!result.granted) {
      setMicErrorMessage("Microphone access was denied — check your device's settings to allow it.");
      setPhase('mic-error');
      return;
    }
    latestTranscript.current = '';
    setLiveTranscript('');
    setPhase('listening');
    ExpoSpeechRecognitionModule.start({ lang: 'en-US', interimResults: true, continuous: false });
  }

  function stopListening() {
    ExpoSpeechRecognitionModule.stop();
  }

  async function handleUserTurn(text: string) {
    if (endedRef.current) return;
    const said = text.trim();
    const withUser = said ? [...history, { role: 'user' as const, text: said }] : history;
    setHistory(withUser);
    setPhase('thinking');
    const result = await fetchNovaReply(withUser).catch(() => ({ reply: FALLBACK_REPLY }));
    if (endedRef.current) return;
    const withNova = [...withUser, { role: 'nova' as const, text: result.reply }];
    setHistory(withNova);
    setPhase('nova-speaking');
    await playAudio(result.reply, 'en');
    if (endedRef.current) return;
    startListening();
  }

  async function endSession() {
    if (endedRef.current) return;
    endedRef.current = true;
    stopListening();
    stopAllAudio();
    setPhase('ending');
    const result = await fetchNovaReport(history).catch(() => fallbackReport(history));
    setReport(result);
    setPhase('report');
  }

  function startOver() {
    setPhase('idle');
    setHistory([]);
    setReport(null);
    setRemainingSeconds(SESSION_SECONDS);
    setMicErrorMessage('');
  }

  if (phase === 'idle') {
    return (
      <View style={styles.centeredWrap}>
        <Text style={styles.emoji}>🤖</Text>
        <Text style={styles.title}>Talk with Nova</Text>
        <Text style={styles.body}>
          Have a free 10-minute conversation in English. Nova will chat naturally and ask follow-up
          questions — at the end, you&apos;ll get feedback on your grammar and vocabulary.
        </Text>
        <PrimaryButton label="Start 10-Minute Conversation" onPress={startSession} style={styles.startButton} />
      </View>
    );
  }

  if (phase === 'report' && report) {
    return <NovaReportView report={report} onStartOver={startOver} styles={styles} colors={colors} />;
  }

  if (phase === 'ending') {
    return (
      <View style={styles.centeredWrap}>
        <Text style={styles.emoji}>📝</Text>
        <Text style={styles.title}>Preparing your report…</Text>
      </View>
    );
  }

  const statusLabel =
    phase === 'listening'
      ? 'Listening… tap to stop'
      : phase === 'thinking'
        ? 'Nova is thinking…'
        : phase === 'nova-speaking'
          ? 'Nova is speaking…'
          : phase === 'mic-error'
            ? micErrorMessage
            : '';

  return (
    <View style={styles.conversationWrap}>
      <View style={styles.timerRow}>
        <Ionicons name="time-outline" size={16} color={colors.textMuted} />
        <Text style={styles.timerText}>{formatTime(remainingSeconds)} remaining</Text>
        <Pressable onPress={endSession} style={styles.endButton}>
          <Text style={styles.endButtonText}>END</Text>
        </Pressable>
      </View>

      <ScrollView
        ref={scrollRef}
        style={styles.transcriptScroll}
        contentContainerStyle={styles.transcriptContent}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}>
        {history.map((turn, i) => (
          <TurnBubble key={i} turn={turn} styles={styles} colors={colors} />
        ))}
        {phase === 'listening' && liveTranscript ? (
          <View style={[styles.bubble, styles.userBubble]}>
            <Text style={styles.bubbleText}>{liveTranscript}</Text>
          </View>
        ) : null}
      </ScrollView>

      <View style={styles.micArea}>
        <Text style={[styles.statusText, phase === 'mic-error' && styles.statusTextError]}>{statusLabel}</Text>
        {phase === 'listening' ? (
          <Pressable onPress={stopListening} style={[styles.micButton, styles.micButtonRecording]}>
            <Ionicons name="stop" size={28} color="#FFFFFF" />
          </Pressable>
        ) : phase === 'mic-error' ? (
          <Pressable onPress={startListening} style={styles.micButton}>
            <Ionicons name="mic" size={32} color="#FFFFFF" />
          </Pressable>
        ) : (
          <View style={[styles.micButton, styles.micButtonBusy]}>
            <Ionicons name={phase === 'thinking' ? 'ellipsis-horizontal' : 'volume-high'} size={28} color="#FFFFFF" />
          </View>
        )}
      </View>
    </View>
  );
}

function TurnBubble({ turn, styles, colors }: { turn: NovaTurn; styles: Styles; colors: Colors }) {
  if (turn.role === 'nova') {
    return (
      <View style={styles.novaBubbleRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>N</Text>
        </View>
        <View style={[styles.bubble, styles.novaBubble]}>
          <Text style={styles.bubbleText}>{turn.text}</Text>
        </View>
      </View>
    );
  }
  return (
    <View style={styles.userBubbleRow}>
      <View style={[styles.bubble, styles.userBubble]}>
        <Text style={styles.bubbleText}>{turn.text}</Text>
      </View>
    </View>
  );
}

function NovaReportView({
  report,
  onStartOver,
  styles,
  colors,
}: {
  report: NovaReportResult;
  onStartOver: () => void;
  styles: Styles;
  colors: Colors;
}) {
  return (
    <ScrollView contentContainerStyle={styles.reportWrap}>
      <Text style={styles.emoji}>🎉</Text>
      <View style={styles.reportCard}>
        <View style={styles.reportHeaderRow}>
          <Ionicons name="chatbubbles" size={20} color={colors.healthy} />
          <Text style={styles.reportHeaderText}>Conversation Report</Text>
        </View>
        <Text style={styles.body}>{report.overallFeedback}</Text>
      </View>

      {report.grammarIssues.length > 0 && (
        <>
          <Text style={styles.sectionLabel}>GRAMMAR TO PRACTICE</Text>
          {report.grammarIssues.map((note) => (
            <View key={note} style={styles.noteCard}>
              <Text style={styles.noteText}>{note}</Text>
            </View>
          ))}
        </>
      )}

      {report.vocabularyNotes.length > 0 && (
        <>
          <Text style={styles.sectionLabel}>VOCABULARY</Text>
          {report.vocabularyNotes.map((note) => (
            <View key={note} style={styles.noteCard}>
              <Text style={styles.noteText}>{note}</Text>
            </View>
          ))}
        </>
      )}

      <PrimaryButton label="Start New Conversation" onPress={onStartOver} style={styles.startButton} />
    </ScrollView>
  );
}

type Styles = ReturnType<typeof createStyles>;
type Colors = ReturnType<typeof useTheme>['colors'];

function createStyles(colors: ReturnType<typeof useTheme>['colors']) {
  return StyleSheet.create({
    centeredWrap: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: Space.xl,
      gap: Space.md,
    },
    emoji: {
      fontSize: 48,
      textAlign: 'center',
    },
    title: {
      color: colors.graphite,
      fontSize: 20,
      fontWeight: '800',
      textAlign: 'center',
    },
    body: {
      color: colors.muted,
      textAlign: 'center',
      lineHeight: 22,
      fontFamily: Typography.fontFamily,
    },
    startButton: {
      marginTop: Space.md,
      alignSelf: 'stretch',
    },
    conversationWrap: {
      flex: 1,
      gap: Space.md,
    },
    timerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Space.xs,
      paddingHorizontal: Space.lg,
    },
    timerText: {
      color: colors.textMuted,
      fontWeight: '700',
      fontSize: 13,
      flex: 1,
    },
    endButton: {
      borderWidth: 1,
      borderColor: colors.critical,
      borderRadius: Radii.sm,
      paddingVertical: Space.xs,
      paddingHorizontal: Space.md,
    },
    endButtonText: {
      color: colors.critical,
      fontWeight: '800',
      fontSize: 12,
    },
    transcriptScroll: {
      flex: 1,
    },
    transcriptContent: {
      padding: Space.lg,
      gap: Space.md,
    },
    novaBubbleRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: Space.sm,
    },
    userBubbleRow: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    avatar: {
      width: 32,
      height: 32,
      borderRadius: Radii.pill,
      backgroundColor: colors.brandOrange,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: {
      color: '#FFFFFF',
      fontWeight: '800',
      fontSize: 13,
    },
    bubble: {
      maxWidth: '80%',
      borderRadius: Radii.md,
      padding: Space.md,
      borderWidth: 1,
    },
    novaBubble: {
      backgroundColor: colors.card,
      borderColor: colors.cardBorder,
      borderTopLeftRadius: 4,
    },
    userBubble: {
      backgroundColor: colors.brandOrangeMuted,
      borderColor: colors.brandOrangeMuted,
      borderTopRightRadius: 4,
    },
    bubbleText: {
      color: colors.graphite,
      fontSize: 15,
      lineHeight: 21,
    },
    micArea: {
      alignItems: 'center',
      gap: Space.sm,
      paddingVertical: Space.lg,
    },
    statusText: {
      color: colors.muted,
      fontSize: 13,
      fontWeight: '600',
    },
    statusTextError: {
      color: colors.critical,
      textAlign: 'center',
      paddingHorizontal: Space.xl,
    },
    micButton: {
      width: 64,
      height: 64,
      borderRadius: Radii.pill,
      backgroundColor: colors.brandOrange,
      alignItems: 'center',
      justifyContent: 'center',
    },
    micButtonRecording: {
      backgroundColor: colors.critical,
    },
    micButtonBusy: {
      opacity: 0.6,
    },
    reportWrap: {
      padding: Space.xl,
      gap: Space.md,
    },
    reportCard: {
      backgroundColor: colors.card,
      borderRadius: Radii.lg,
      padding: Space.xl,
      gap: Space.sm,
      borderWidth: 1,
      borderColor: colors.cardBorder,
    },
    reportHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Space.sm,
    },
    reportHeaderText: {
      color: colors.healthy,
      fontWeight: '800',
      fontSize: 16,
    },
    sectionLabel: {
      color: colors.textMuted,
      fontWeight: '800',
      fontSize: 12,
      letterSpacing: 1,
      marginTop: Space.md,
    },
    noteCard: {
      backgroundColor: colors.card,
      borderRadius: Radii.md,
      padding: Space.lg,
      borderWidth: 1,
      borderColor: colors.cardBorder,
    },
    noteText: {
      color: colors.graphite,
      fontSize: 15,
    },
  });
}

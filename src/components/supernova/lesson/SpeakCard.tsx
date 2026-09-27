import { Ionicons } from '@expo/vector-icons';
import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } from 'expo-speech-recognition';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { HintCard } from '@/components/supernova/HintCard';
import { PrimaryButton } from '@/components/supernova/PrimaryButton';
import { Radii, Space } from '@/constants/theme';
import { useTheme } from '@/lib/theme/ThemeProvider';
import type { SpeakStep } from '@/lib/curriculum/lesson-types';
import { playAudio, stopAllAudio } from '@/lib/audio/ttsAudio';
import { scoreSpokenAnswer } from '@/lib/audio/wordMatch';
import { gradeSpokenAnswer, type SpeakGradeResult } from '@/lib/api/speak';

type Phase = 'idle' | 'recording' | 'grading' | 'feedback' | 'mic-error';

type Feedback = { source: 'llm'; result: SpeakGradeResult } | { source: 'local'; result: ReturnType<typeof scoreSpokenAnswer> };

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function SpeakCard({
  step,
  index,
  total,
  language,
  onComplete,
}: {
  step: SpeakStep;
  index: number;
  total: number;
  language: 'hi' | 'en';
  onComplete: (wordsUsed: number) => void;
}) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [phase, setPhase] = useState<Phase>('idle');
  const [showHint, setShowHint] = useState(false);
  const [promptLang, setPromptLang] = useState<'hi' | 'en'>(language);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [micErrorMessage, setMicErrorMessage] = useState('');
  const latestTranscript = useRef('');

  // `step` changes remount this component (see key={step.id} in lesson.tsx),
  // so `phase`/`showHint`/`transcript` already reset to their initial values
  // above — no reset effect needed.

  useEffect(() => {
    return () => {
      stopAllAudio();
      ExpoSpeechRecognitionModule.stop();
    };
  }, []);

  // Auto-plays Nova's prompt as soon as this question appears — same
  // "wherever there's a play button, it should autoplay" rule as the
  // learn-flow cards (see PlayAudioButton's autoPlay docs). This card
  // doesn't use PlayAudioButton (its PLAY button also toggles recording
  // UI, not just playback), so it fires directly instead.
  useEffect(() => {
    playAudio(step.promptEn, 'en');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // expo-speech-recognition wraps iOS SFSpeechRecognizer / Android
  // SpeechRecognizer / the browser's Web SpeechRecognition behind one API —
  // this is real transcription, not a simulation.
  useSpeechRecognitionEvent('result', (event) => {
    const text = event.results[0]?.transcript ?? '';
    latestTranscript.current = text;
    setTranscript(text);
  });
  useSpeechRecognitionEvent('end', () => {
    const finalTranscript = latestTranscript.current;
    setTranscript(finalTranscript);
    setPhase('grading');
    gradeSpokenAnswer(finalTranscript, step.promptEn, step.hint)
      .then((result) => setFeedback({ source: 'llm', result }))
      // Groq unreachable/rate-limited/malformed response — fall back to the
      // local word-overlap heuristic rather than blocking the lesson on it.
      // .finally() guarantees this always resolves to 'feedback', so
      // `phase` never gets stuck on 'grading' the way an earlier version of
      // this card once got stuck on a synchronous-only 'evaluating' phase.
      .catch(() => setFeedback({ source: 'local', result: scoreSpokenAnswer(finalTranscript, step.hint?.example) }))
      .finally(() => setPhase('feedback'));
  });
  useSpeechRecognitionEvent('error', (event) => {
    setMicErrorMessage(
      event.error === 'not-allowed'
        ? "Microphone access was denied — check your device's settings to allow it."
        : event.error === 'no-speech'
          ? "Didn't catch that — try speaking a little louder."
          : `Speech recognition error: ${event.message || event.error}`,
    );
    setPhase('mic-error');
  });

  const isLast = index === total - 1;
  const headerLabel = isLast ? (step.missionLabel ?? 'Last Question!') : `${total - index} Questions Remaining`;
  const subtitle =
    index === 0
      ? "Ready to start? Let's begin the fun!"
      : isLast
        ? 'Time to bring it all together!'
        : 'Well done! Keep going.';

  function play() {
    playAudio(step.promptEn, 'en');
  }

  async function startRecording() {
    const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!result.granted) {
      setMicErrorMessage("Microphone access was denied — check your device's settings to allow it.");
      setPhase('mic-error');
      return;
    }
    latestTranscript.current = '';
    setTranscript('');
    setPhase('recording');
    ExpoSpeechRecognitionModule.start({ lang: 'en-US', interimResults: true, continuous: false });
  }

  function stopRecording() {
    ExpoSpeechRecognitionModule.stop();
  }

  const isCorrect = feedback?.result.correct ?? false;
  const feedbackLine =
    feedback?.source === 'llm'
      ? feedback.result.feedback
      : feedback?.source === 'local'
        ? feedback.result.correct
          ? 'Nice! That sounded good.'
          : feedback.result.missingWords.length > 0
            ? `Good try — see if you can also use: ${feedback.result.missingWords.join(', ')}`
            : 'Good try — say a little more next time.'
        : '';

  return (
    <View style={styles.wrap}>
      <Text style={styles.header}>{headerLabel}</Text>
      <Text style={styles.subtitle}>&ldquo;{subtitle}&rdquo;</Text>

      <View style={styles.toolbarRow}>
        <Text style={styles.toolbarLabel}>SPEAKING PRACTICE</Text>
        <View style={styles.toolbarIcons}>
          <Pressable
            onPress={() => setPromptLang((p) => (p === 'hi' ? 'en' : 'hi'))}
            style={[styles.iconButton, promptLang === 'hi' && styles.iconButtonActive]}>
            <Text style={styles.iconButtonText}>अ / A</Text>
          </Pressable>
          <Pressable
            onPress={() => setShowHint((v) => !v)}
            style={[styles.iconButton, showHint && styles.iconButtonActive]}>
            <Ionicons name="bulb" size={18} color={showHint ? colors.brandOrange : colors.muted} />
          </Pressable>
        </View>
      </View>

      <View style={styles.novaBubbleRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>N</Text>
        </View>
        <View style={styles.bubble}>
          <Pressable onPress={play} style={styles.playButton}>
            <Ionicons name="volume-high" size={16} color={colors.brandOrange} />
            <Text style={styles.playText}>PLAY</Text>
          </Pressable>
          <Text style={styles.bubbleText}>{promptLang === 'hi' ? step.promptHi : step.promptEn}</Text>
        </View>
      </View>

      {showHint && step.hint ? <HintCard hint={step.hint} /> : null}

      {phase === 'recording' && transcript ? (
        <View style={styles.bubble}>
          <Text style={styles.transcriptLabel}>WHAT WE HEARD</Text>
          <Text style={styles.bubbleText}>{transcript}</Text>
        </View>
      ) : null}

      {phase === 'grading' ? (
        <View style={styles.feedbackRow}>
          <View style={[styles.bubble, styles.feedbackBubble]}>
            <Text style={styles.transcriptLabel}>YOU SAID</Text>
            <Text style={styles.bubbleText}>{transcript || '(nothing heard)'}</Text>
            <Text style={styles.tryAgainText}>Checking your answer…</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>N</Text>
          </View>
        </View>
      ) : null}

      {phase === 'feedback' ? (
        <View style={styles.feedbackRow}>
          <View style={[styles.bubble, styles.feedbackBubble]}>
            <Text style={styles.transcriptLabel}>YOU SAID</Text>
            <Text style={styles.bubbleText}>{transcript || '(nothing heard)'}</Text>
            <Text style={[styles.bubbleText, isCorrect ? styles.correctText : styles.tryAgainText]}>{feedbackLine}</Text>
            {feedback?.source === 'llm' && feedback.result.grammarIssues.length > 0 && (
              <View style={styles.grammarNotes}>
                {feedback.result.grammarIssues.map((note) => (
                  <Text key={note} style={styles.grammarNoteText}>
                    • {note}
                  </Text>
                ))}
              </View>
            )}
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>N</Text>
          </View>
        </View>
      ) : null}

      {phase === 'mic-error' ? (
        <View style={styles.bubble}>
          <Text style={styles.tryAgainText}>{micErrorMessage}</Text>
        </View>
      ) : null}

      <View style={styles.micArea}>
        {(phase === 'idle' || phase === 'mic-error') && (
          <Pressable onPress={startRecording} style={styles.micButton}>
            <Ionicons name="mic" size={32} color="#FFFFFF" />
          </Pressable>
        )}
        {phase === 'recording' && (
          <Pressable onPress={stopRecording} style={[styles.micButton, styles.micButtonRecording]}>
            <Ionicons name="stop" size={28} color="#FFFFFF" />
          </Pressable>
        )}
        {phase === 'recording' && <Text style={styles.recordingLabel}>Recording… tap to stop</Text>}
        {phase === 'feedback' && (
          <PrimaryButton
            label={isLast ? 'FINISH' : 'CONTINUE'}
            variant="success"
            onPress={() => onComplete(wordCount(transcript))}
            style={styles.continueButton}
          />
        )}
      </View>
    </View>
  );
}

function createStyles(colors: ReturnType<typeof useTheme>['colors']) {
  return StyleSheet.create({
    wrap: {
      gap: Space.lg,
    },
    header: {
      color: colors.graphite,
      fontSize: 20,
      fontWeight: '800',
      textAlign: 'center',
    },
    subtitle: {
      color: colors.muted,
      textAlign: 'center',
      fontStyle: 'italic',
    },
    toolbarRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    toolbarLabel: {
      color: colors.textMuted,
      fontWeight: '800',
      fontSize: 12,
      letterSpacing: 0.5,
    },
    toolbarIcons: {
      flexDirection: 'row',
      gap: Space.sm,
    },
    iconButton: {
      width: 40,
      height: 36,
      borderRadius: Radii.sm,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconButtonActive: {
      borderColor: colors.brandOrange,
      backgroundColor: colors.brandOrangeMuted,
    },
    iconButtonText: {
      color: colors.muted,
      fontWeight: '700',
      fontSize: 11,
    },
    novaBubbleRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: Space.sm,
    },
    feedbackRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: Space.sm,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: Radii.pill,
      backgroundColor: colors.brandOrange,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: {
      color: '#FFFFFF',
      fontWeight: '800',
    },
    bubble: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: Radii.md,
      borderTopLeftRadius: 4,
      padding: Space.lg,
      gap: Space.sm,
      borderWidth: 1,
      borderColor: colors.cardBorder,
    },
    feedbackBubble: {
      borderTopLeftRadius: Radii.md,
      borderTopRightRadius: 4,
    },
    transcriptLabel: {
      color: colors.textMuted,
      fontWeight: '800',
      fontSize: 11,
      letterSpacing: 0.5,
    },
    correctText: {
      color: colors.healthy,
      fontWeight: '700',
    },
    tryAgainText: {
      color: colors.muted,
      fontWeight: '600',
    },
    grammarNotes: {
      gap: 2,
    },
    grammarNoteText: {
      color: colors.muted,
      fontSize: 13,
      lineHeight: 18,
    },
    playButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Space.xs,
      alignSelf: 'flex-start',
      backgroundColor: colors.brandOrangeMuted,
      borderRadius: Radii.pill,
      paddingVertical: Space.xs,
      paddingHorizontal: Space.md,
    },
    playText: {
      color: colors.brandOrange,
      fontWeight: '800',
      fontSize: 12,
    },
    bubbleText: {
      color: colors.graphite,
      fontSize: 15,
      lineHeight: 22,
    },
    micArea: {
      alignItems: 'center',
      gap: Space.md,
      paddingVertical: Space.lg,
    },
    micButton: {
      width: 72,
      height: 72,
      borderRadius: Radii.pill,
      backgroundColor: colors.brandOrange,
      alignItems: 'center',
      justifyContent: 'center',
    },
    micButtonRecording: {
      backgroundColor: colors.critical,
    },
    recordingLabel: {
      color: colors.muted,
    },
    continueButton: {
      alignSelf: 'stretch',
      width: '100%',
    },
  });
}

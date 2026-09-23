import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { HintCard } from '@/components/supernova/HintCard';
import { PrimaryButton } from '@/components/supernova/PrimaryButton';
import { Colors, Radii, Space } from '@/constants/palette';
import type { SpeakStep } from '@/lib/curriculum/lesson-types';
import { playAudio } from '@/lib/audio/ttsAudio';

type Phase = 'idle' | 'recording' | 'evaluating' | 'feedback';

const ENCOURAGEMENT = [
  'Nice! That was clear and natural.',
  'Great job — that sounded confident.',
  'Well said!',
  'Good — keep up that pace.',
];

// NOTE: this is a UI simulation of the Speak → Converse loop, not real speech
// recognition or AI grading — there's no audio capture or Nova backend yet.
// The mic button just walks through recording → evaluating → feedback so the
// interaction loop can be tried end to end.
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
  onComplete: (estimatedWords: number) => void;
}) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [showHint, setShowHint] = useState(false);
  const [promptLang, setPromptLang] = useState<'hi' | 'en'>(language);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // `step` changes remount this component (see key={step.id} in lesson.tsx),
  // so `phase`/`showHint` already reset to their initial values above.

  useEffect(() => {
    const timersAtMount = timers.current;
    return () => {
      timersAtMount.forEach(clearTimeout);
      Speech.stop();
    };
  }, []);

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

  function startRecording() {
    setPhase('recording');
  }

  function stopRecording() {
    setPhase('evaluating');
    timers.current.push(
      setTimeout(() => setPhase('feedback'), 900),
    );
  }

  function estimatedWords() {
    const base = step.hint?.example.split(' ').length ?? 4;
    return base + 2;
  }

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
            <Ionicons name="bulb" size={18} color={showHint ? Colors.primary : Colors.textSecondary} />
          </Pressable>
        </View>
      </View>

      <View style={styles.novaBubbleRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>N</Text>
        </View>
        <View style={styles.bubble}>
          <Pressable onPress={play} style={styles.playButton}>
            <Ionicons name="volume-high" size={16} color={Colors.primary} />
            <Text style={styles.playText}>PLAY</Text>
          </Pressable>
          <Text style={styles.bubbleText}>{promptLang === 'hi' ? step.promptHi : step.promptEn}</Text>
        </View>
      </View>

      {showHint && step.hint ? <HintCard hint={step.hint} /> : null}

      {phase === 'feedback' ? (
        <View style={styles.feedbackRow}>
          <View style={[styles.bubble, styles.feedbackBubble]}>
            <Text style={styles.bubbleText}>{ENCOURAGEMENT[index % ENCOURAGEMENT.length]}</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>N</Text>
          </View>
        </View>
      ) : null}

      <View style={styles.micArea}>
        {phase === 'idle' && (
          <Pressable onPress={startRecording} style={styles.micButton}>
            <Ionicons name="mic" size={32} color="#fff" />
          </Pressable>
        )}
        {phase === 'recording' && (
          <Pressable onPress={stopRecording} style={[styles.micButton, styles.micButtonRecording]}>
            <Ionicons name="stop" size={28} color="#fff" />
          </Pressable>
        )}
        {phase === 'recording' && <Text style={styles.recordingLabel}>Recording… tap to stop</Text>}
        {phase === 'evaluating' && <ActivityIndicator color={Colors.primary} />}
        {phase === 'feedback' && (
          <PrimaryButton
            label={isLast ? 'FINISH' : 'CONTINUE'}
            variant="success"
            onPress={() => onComplete(estimatedWords())}
            style={styles.continueButton}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: Space.lg,
  },
  header: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    color: Colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  toolbarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toolbarLabel: {
    color: Colors.textMuted,
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
    borderColor: Colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryMuted,
  },
  iconButtonText: {
    color: Colors.textSecondary,
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
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontWeight: '800',
  },
  bubble: {
    flex: 1,
    backgroundColor: Colors.bgCard,
    borderRadius: Radii.md,
    borderTopLeftRadius: 4,
    padding: Space.lg,
    gap: Space.sm,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  feedbackBubble: {
    borderTopLeftRadius: Radii.md,
    borderTopRightRadius: 4,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.xs,
    alignSelf: 'flex-start',
    backgroundColor: Colors.primaryMuted,
    borderRadius: Radii.pill,
    paddingVertical: Space.xs,
    paddingHorizontal: Space.md,
  },
  playText: {
    color: Colors.primary,
    fontWeight: '800',
    fontSize: 12,
  },
  bubbleText: {
    color: Colors.text,
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
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micButtonRecording: {
    backgroundColor: Colors.danger,
  },
  recordingLabel: {
    color: Colors.textSecondary,
  },
  continueButton: {
    alignSelf: 'stretch',
    width: '100%',
  },
});

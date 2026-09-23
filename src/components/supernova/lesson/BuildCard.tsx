import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FeedbackPanel } from '@/components/supernova/lesson/FeedbackPanel';
import { HintCard } from '@/components/supernova/HintCard';
import { PrimaryButton } from '@/components/supernova/PrimaryButton';
import { Colors, Radii, Space } from '@/constants/palette';
import type { BuildStep } from '@/lib/curriculum/lesson-types';

interface Chip {
  key: string;
  text: string;
}

function shuffledChips(words: string[]): Chip[] {
  const chips = words.map((text, i) => ({ key: `${text}-${i}`, text }));
  for (let i = chips.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [chips[i], chips[j]] = [chips[j], chips[i]];
  }
  return chips;
}

export function BuildCard({
  step,
  onComplete,
}: {
  step: BuildStep;
  onComplete: (correct: boolean, missedWord?: string) => void;
}) {
  // `step` changes remount this component (see key={step.id} in lesson.tsx),
  // so a lazy initializer is enough — no need to recompute on prop change.
  const [bank, setBank] = useState<Chip[]>(() => shuffledChips([...step.answer, ...(step.distractors ?? [])]));
  const [selected, setSelected] = useState<Chip[]>([]);
  const [checked, setChecked] = useState<{ correct: boolean; missedWord?: string } | null>(null);

  function moveToSelected(chip: Chip) {
    if (checked) return;
    setBank((b) => b.filter((c) => c.key !== chip.key));
    setSelected((s) => [...s, chip]);
  }

  function moveToBank(chip: Chip) {
    if (checked) return;
    setSelected((s) => s.filter((c) => c.key !== chip.key));
    setBank((b) => [...b, chip]);
  }

  function undo() {
    if (checked || selected.length === 0) return;
    const last = selected[selected.length - 1];
    moveToBank(last);
  }

  function check() {
    const attempt = selected.map((c) => c.text);
    const correct = attempt.length === step.answer.length && attempt.every((w, i) => w === step.answer[i]);
    const missedWord = correct ? undefined : step.answer.find((w) => !attempt.includes(w));
    setChecked({ correct, missedWord });
  }

  return (
    <View style={styles.card}>
      <Text style={styles.prompt}>{step.promptHi}</Text>
      <HintCard hint={step.hint} />

      <View style={styles.answerRow}>
        {selected.map((chip) => (
          <Pressable key={chip.key} onPress={() => moveToBank(chip)} style={styles.chip}>
            <Text style={styles.chipText}>{chip.text}</Text>
          </Pressable>
        ))}
        {selected.length === 0 ? <View style={styles.answerLine} /> : null}
      </View>

      <View style={styles.bankRow}>
        {bank.map((chip) => (
          <Pressable key={chip.key} onPress={() => moveToSelected(chip)} style={styles.chipOutline}>
            <Text style={styles.chipOutlineText}>{chip.text}</Text>
          </Pressable>
        ))}
      </View>

      {checked ? (
        <FeedbackPanel
          correct={checked.correct}
          missedWord={checked.missedWord}
          wrongAttempt={checked.correct ? undefined : selected.map((c) => c.text).join(' ') || '(no answer)'}
          correctAnswer={checked.correct ? undefined : step.answer.join(' ')}
        />
      ) : null}

      <View style={styles.actionsRow}>
        <Pressable onPress={undo} style={styles.undoButton} disabled={!!checked}>
          <Ionicons name="arrow-undo" size={18} color={Colors.textSecondary} />
        </Pressable>
        {checked ? (
          <PrimaryButton
            label="NEXT"
            variant="success"
            onPress={() => onComplete(checked.correct, checked.missedWord)}
            style={styles.checkButton}
          />
        ) : (
          <PrimaryButton
            label="CHECK"
            onPress={check}
            disabled={selected.length === 0}
            style={styles.checkButton}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radii.lg,
    padding: Space.xl,
    gap: Space.lg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  prompt: {
    color: Colors.text,
    fontSize: 17,
  },
  answerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Space.sm,
    minHeight: 44,
    borderBottomWidth: 2,
    borderBottomColor: Colors.cardBorder,
    paddingBottom: Space.md,
  },
  answerLine: {
    flex: 1,
    height: 2,
  },
  bankRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Space.sm,
  },
  chip: {
    backgroundColor: Colors.primaryMuted,
    borderRadius: Radii.sm,
    paddingVertical: Space.sm,
    paddingHorizontal: Space.md,
  },
  chipText: {
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 15,
  },
  chipOutline: {
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: Radii.sm,
    paddingVertical: Space.sm,
    paddingHorizontal: Space.md,
  },
  chipOutlineText: {
    color: Colors.text,
    fontWeight: '700',
    fontSize: 15,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.md,
  },
  undoButton: {
    width: 48,
    height: 48,
    borderRadius: Radii.md,
    borderWidth: 2,
    borderColor: Colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkButton: {
    flex: 1,
  },
});

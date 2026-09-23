import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { Colors, Radii, Space } from '@/constants/palette';

interface FeedbackPanelProps {
  correct: boolean;
  explanation?: string;
  missedWord?: string;
  wrongAttempt?: string;
  correctAnswer?: string;
}

export function FeedbackPanel({ correct, explanation, missedWord, wrongAttempt, correctAnswer }: FeedbackPanelProps) {
  if (correct) {
    return (
      <View style={[styles.wrap, { borderColor: Colors.success }]}>
        <View style={styles.headerRow}>
          <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
          <Text style={[styles.headerText, { color: Colors.success }]}>Correct!</Text>
        </View>
        {explanation ? <Text style={styles.explanation}>{explanation}</Text> : null}
      </View>
    );
  }

  return (
    <View style={[styles.wrap, { borderColor: Colors.warning }]}>
      <View style={styles.headerRow}>
        <Ionicons name="alert-circle" size={20} color={Colors.warning} />
        <Text style={[styles.headerText, { color: Colors.warning }]}>FEEDBACK</Text>
      </View>
      {missedWord ? (
        <Text style={styles.explanation}>
          You missed the word <Text style={styles.missedWord}>&ldquo;{missedWord}&rdquo;</Text>
        </Text>
      ) : null}
      {wrongAttempt ? (
        <View style={styles.compareRow}>
          <Ionicons name="close" size={16} color={Colors.danger} />
          <Text style={styles.wrongText}>{wrongAttempt}</Text>
        </View>
      ) : null}
      {correctAnswer ? (
        <View style={styles.compareRow}>
          <Ionicons name="checkmark" size={16} color={Colors.success} />
          <Text style={styles.correctText}>{correctAnswer}</Text>
        </View>
      ) : null}
      {explanation ? <Text style={styles.explanation}>{explanation}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: Space.lg,
    borderTopWidth: 3,
    backgroundColor: Colors.bgCard,
    borderRadius: Radii.md,
    padding: Space.lg,
    gap: Space.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.sm,
  },
  headerText: {
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  explanation: {
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  missedWord: {
    color: Colors.success,
    fontWeight: '800',
  },
  compareRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.sm,
  },
  wrongText: {
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
    fontSize: 15,
  },
  correctText: {
    color: Colors.success,
    fontWeight: '700',
    fontSize: 15,
  },
});

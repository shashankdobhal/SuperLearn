import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Radii, Space } from '@/constants/theme';
import { useTheme } from '@/lib/theme/ThemeProvider';

interface FeedbackPanelProps {
  correct: boolean;
  explanation?: string;
  missedWord?: string;
  wrongAttempt?: string;
  correctAnswer?: string;
}

export function FeedbackPanel({ correct, explanation, missedWord, wrongAttempt, correctAnswer }: FeedbackPanelProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  if (correct) {
    return (
      <View style={[styles.wrap, { borderColor: colors.healthy }]}>
        <View style={styles.headerRow}>
          <Ionicons name="checkmark-circle" size={20} color={colors.healthy} />
          <Text style={[styles.headerText, { color: colors.healthy }]}>Correct!</Text>
        </View>
        {explanation ? <Text style={styles.explanation}>{explanation}</Text> : null}
      </View>
    );
  }

  return (
    <View style={[styles.wrap, { borderColor: colors.attention }]}>
      <View style={styles.headerRow}>
        <Ionicons name="alert-circle" size={20} color={colors.attention} />
        <Text style={[styles.headerText, { color: colors.attention }]}>FEEDBACK</Text>
      </View>
      {missedWord ? (
        <Text style={styles.explanation}>
          You missed the word <Text style={styles.missedWord}>&ldquo;{missedWord}&rdquo;</Text>
        </Text>
      ) : null}
      {wrongAttempt ? (
        <View style={styles.compareRow}>
          <Ionicons name="close" size={16} color={colors.critical} />
          <Text style={styles.wrongText}>{wrongAttempt}</Text>
        </View>
      ) : null}
      {correctAnswer ? (
        <View style={styles.compareRow}>
          <Ionicons name="checkmark" size={16} color={colors.healthy} />
          <Text style={styles.correctText}>{correctAnswer}</Text>
        </View>
      ) : null}
      {explanation ? <Text style={styles.explanation}>{explanation}</Text> : null}
    </View>
  );
}

function createStyles(colors: ReturnType<typeof useTheme>['colors']) {
  return StyleSheet.create({
    wrap: {
      marginTop: Space.lg,
      borderTopWidth: 3,
      backgroundColor: colors.card,
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
      color: colors.muted,
      fontSize: 14,
      lineHeight: 20,
    },
    missedWord: {
      color: colors.healthy,
      fontWeight: '800',
    },
    compareRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Space.sm,
    },
    wrongText: {
      color: colors.textMuted,
      textDecorationLine: 'line-through',
      fontSize: 15,
    },
    correctText: {
      color: colors.healthy,
      fontWeight: '700',
      fontSize: 15,
    },
  });
}

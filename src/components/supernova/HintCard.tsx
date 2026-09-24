import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Radii, Space } from '@/constants/theme';
import { useTheme } from '@/lib/theme/ThemeProvider';
import type { LanguageHint } from '@/lib/curriculum/lesson-types';

export function HintCard({ hint }: { hint: LanguageHint }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={styles.wrap}>
      <View style={styles.tag}>
        <Text style={styles.tagText}>HINT</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.pattern}>{hint.pattern}</Text>
        <Text style={styles.example}>{hint.example}</Text>
      </View>
    </View>
  );
}

function createStyles(colors: ReturnType<typeof useTheme>['colors']) {
  return StyleSheet.create({
    wrap: {
      marginTop: Space.sm,
    },
    tag: {
      alignSelf: 'flex-start',
      backgroundColor: colors.card,
      borderTopLeftRadius: Radii.sm,
      borderTopRightRadius: Radii.sm,
      paddingHorizontal: Space.md,
      paddingVertical: Space.xs,
    },
    tagText: {
      color: colors.muted,
      fontSize: 11,
      fontWeight: '800',
      letterSpacing: 0.5,
    },
    body: {
      borderRadius: Radii.md,
      borderTopLeftRadius: 0,
      overflow: 'hidden',
    },
    pattern: {
      backgroundColor: colors.brandOrange,
      color: '#FFFFFF',
      fontWeight: '800',
      fontSize: 15,
      paddingVertical: Space.md,
      paddingHorizontal: Space.lg,
    },
    example: {
      backgroundColor: colors.brandOrangeMuted,
      color: colors.brandOrange,
      fontWeight: '700',
      fontSize: 14,
      paddingVertical: Space.md,
      paddingHorizontal: Space.lg,
    },
  });
}

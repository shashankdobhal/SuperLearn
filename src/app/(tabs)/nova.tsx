import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Space } from '@/constants/theme';
import { useTheme } from '@/lib/theme/ThemeProvider';

export default function NovaScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={styles.wrap}>
      <Text style={styles.emoji}>🤖</Text>
      <Text style={styles.title}>Nova AI</Text>
      <Text style={styles.body}>
        Free-form conversation with Nova isn&apos;t built yet — this tab is a placeholder until the AI
        speaking-evaluation backend exists.
      </Text>
    </View>
  );
}

function createStyles(colors: ReturnType<typeof useTheme>['colors']) {
  return StyleSheet.create({
    wrap: {
      flex: 1,
      backgroundColor: colors.background,
      alignItems: 'center',
      justifyContent: 'center',
      padding: Space.xl,
      gap: Space.md,
    },
    emoji: {
      fontSize: 48,
    },
    title: {
      color: colors.graphite,
      fontSize: 20,
      fontWeight: '800',
    },
    body: {
      color: colors.muted,
      textAlign: 'center',
      lineHeight: 22,
    },
  });
}

import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Radii, Space } from '@/constants/theme';
import { useTheme } from '@/lib/theme/ThemeProvider';

const OPTIONS = [
  { key: 'light', label: 'Light' },
  { key: 'dark', label: 'Dark' },
  { key: 'system', label: 'System' },
] as const;

export default function AccountScreen() {
  const { colors, preference, setPreference } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.wrap}>
      <Text style={styles.emoji}>👤</Text>
      <Text style={styles.title}>Account</Text>
      <Text style={styles.body}>
        No auth or learner profile yet — progress isn&apos;t saved between sessions in this prototype.
      </Text>

      <View style={styles.settingCard}>
        <Text style={styles.settingLabel}>APPEARANCE</Text>
        <View style={styles.segmentRow}>
          {OPTIONS.map((opt) => {
            const active = preference === opt.key;
            return (
              <Pressable
                key={opt.key}
                onPress={() => setPreference(opt.key)}
                style={[styles.segment, active && styles.segmentActive]}>
                <Text style={[styles.segmentLabel, active && styles.segmentLabelActive]}>{opt.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
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
    settingCard: {
      marginTop: Space.xl,
      alignSelf: 'stretch',
      backgroundColor: colors.card,
      borderRadius: Radii.lg,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      padding: Space.lg,
      gap: Space.md,
    },
    settingLabel: {
      color: colors.textMuted,
      fontWeight: '800',
      fontSize: 12,
      letterSpacing: 0.5,
    },
    segmentRow: {
      flexDirection: 'row',
      backgroundColor: colors.surface,
      borderRadius: Radii.pill,
      borderWidth: 1,
      borderColor: colors.hairline,
      padding: 4,
      gap: 4,
    },
    segment: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: Space.sm,
      borderRadius: Radii.pill,
    },
    segmentActive: {
      backgroundColor: colors.brandOrange,
    },
    segmentLabel: {
      color: colors.muted,
      fontWeight: '700',
      fontSize: 13,
    },
    segmentLabelActive: {
      color: '#FFFFFF',
    },
  });
}

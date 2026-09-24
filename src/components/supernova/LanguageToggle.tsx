import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Radii, Space } from '@/constants/theme';
import { useTheme } from '@/lib/theme/ThemeProvider';

export type SupportLanguage = 'hi' | 'en';

interface LanguageToggleProps {
  value: SupportLanguage;
  onChange: (value: SupportLanguage) => void;
}

export function LanguageToggle({ value, onChange }: LanguageToggleProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={styles.wrap}>
      <Segment label="Hindi" active={value === 'hi'} onPress={() => onChange('hi')} styles={styles} />
      <Segment label="English" active={value === 'en'} onPress={() => onChange('en')} styles={styles} />
    </View>
  );
}

function Segment({
  label,
  active,
  onPress,
  styles,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  styles: ReturnType<typeof createStyles>;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.segment, active && styles.segmentActive]}>
      <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
    </Pressable>
  );
}

function createStyles(colors: ReturnType<typeof useTheme>['colors']) {
  return StyleSheet.create({
    wrap: {
      flexDirection: 'row',
      backgroundColor: colors.surface,
      borderRadius: Radii.pill,
      borderWidth: 1,
      borderColor: colors.hairline,
      padding: 4,
      alignSelf: 'center',
      gap: 4,
    },
    segment: {
      paddingVertical: Space.sm,
      paddingHorizontal: Space.lg,
      borderRadius: Radii.pill,
    },
    segmentActive: {
      backgroundColor: colors.brandOrange,
    },
    label: {
      color: colors.muted,
      fontWeight: '700',
      fontSize: 13,
    },
    labelActive: {
      color: '#FFFFFF',
    },
  });
}

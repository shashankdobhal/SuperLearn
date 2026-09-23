import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors, Radii, Space } from '@/constants/palette';

export type SupportLanguage = 'hi' | 'en';

interface LanguageToggleProps {
  value: SupportLanguage;
  onChange: (value: SupportLanguage) => void;
}

export function LanguageToggle({ value, onChange }: LanguageToggleProps) {
  return (
    <View style={styles.wrap}>
      <Segment label="Hindi" active={value === 'hi'} onPress={() => onChange('hi')} />
      <Segment label="English" active={value === 'en'} onPress={() => onChange('en')} />
    </View>
  );
}

function Segment({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.segment, active && { backgroundColor: Colors.primary }]}>
      <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    backgroundColor: Colors.pillBg,
    borderRadius: Radii.pill,
    padding: 4,
    alignSelf: 'center',
    gap: 4,
  },
  segment: {
    paddingVertical: Space.sm,
    paddingHorizontal: Space.lg,
    borderRadius: Radii.pill,
  },
  label: {
    color: Colors.textSecondary,
    fontWeight: '700',
    fontSize: 13,
  },
  labelActive: {
    color: '#fff',
  },
});

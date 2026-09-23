import { StyleSheet, Text, View } from 'react-native';

import { Colors, Radii, Space } from '@/constants/palette';
import type { LanguageHint } from '@/lib/curriculum/lesson-types';

export function HintCard({ hint }: { hint: LanguageHint }) {
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

const styles = StyleSheet.create({
  wrap: {
    marginTop: Space.sm,
  },
  tag: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.bgCard,
    borderTopLeftRadius: Radii.sm,
    borderTopRightRadius: Radii.sm,
    paddingHorizontal: Space.md,
    paddingVertical: Space.xs,
  },
  tagText: {
    color: Colors.textSecondary,
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
    backgroundColor: Colors.primary,
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
    paddingVertical: Space.md,
    paddingHorizontal: Space.lg,
  },
  example: {
    backgroundColor: Colors.primaryMuted,
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 14,
    paddingVertical: Space.md,
    paddingHorizontal: Space.lg,
  },
});

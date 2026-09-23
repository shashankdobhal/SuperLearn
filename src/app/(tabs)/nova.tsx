import { StyleSheet, Text, View } from 'react-native';

import { Colors, Space } from '@/constants/palette';

export default function NovaScreen() {
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

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Space.xl,
    gap: Space.md,
  },
  emoji: {
    fontSize: 48,
  },
  title: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  body: {
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});

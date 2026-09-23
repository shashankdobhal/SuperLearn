import { StyleSheet, Text, View } from 'react-native';

import { Colors, Space } from '@/constants/palette';

export default function AccountScreen() {
  return (
    <View style={styles.wrap}>
      <Text style={styles.emoji}>👤</Text>
      <Text style={styles.title}>Account</Text>
      <Text style={styles.body}>
        No auth or learner profile yet — progress isn&apos;t saved between sessions in this prototype.
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

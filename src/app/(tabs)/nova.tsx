import { SafeAreaView, StyleSheet } from 'react-native';

import { NovaConversation } from '@/components/supernova/nova/NovaConversation';
import { useTheme } from '@/lib/theme/ThemeProvider';

export default function NovaScreen() {
  const { colors } = useTheme();
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <NovaConversation />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
});

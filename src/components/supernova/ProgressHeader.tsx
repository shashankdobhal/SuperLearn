import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { Colors, Radii, Space } from '@/constants/palette';

interface ProgressHeaderProps {
  progress: number; // 0..1
  icon: keyof typeof Ionicons.glyphMap;
  onClose: () => void;
}

export function ProgressHeader({ progress, icon, onClose }: ProgressHeaderProps) {
  const clamped = Math.max(0, Math.min(1, progress));
  return (
    <View style={styles.row}>
      <Pressable onPress={onClose} hitSlop={12}>
        <Ionicons name="close" size={26} color={Colors.textSecondary} />
      </Pressable>
      <View style={styles.iconBox}>
        <Ionicons name={icon} size={20} color={Colors.primary} />
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${clamped * 100}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.md,
    paddingHorizontal: Space.lg,
    paddingTop: Space.md,
    paddingBottom: Space.sm,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: Radii.sm,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryMuted,
  },
  track: {
    flex: 1,
    height: 14,
    borderRadius: Radii.pill,
    backgroundColor: Colors.trackBg,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: Radii.pill,
    backgroundColor: Colors.success,
  },
});

import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Radii, Space } from '@/constants/theme';
import { useTheme } from '@/lib/theme/ThemeProvider';

interface ProgressHeaderProps {
  progress: number; // 0..1
  icon: keyof typeof Ionicons.glyphMap;
  onClose: () => void;
}

export function ProgressHeader({ progress, icon, onClose }: ProgressHeaderProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const clamped = Math.max(0, Math.min(1, progress));
  return (
    <View style={styles.row}>
      <Pressable onPress={onClose} hitSlop={12}>
        <Ionicons name="close" size={26} color={colors.muted} />
      </Pressable>
      <View style={styles.iconBox}>
        <Ionicons name={icon} size={20} color={colors.brandOrange} />
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${clamped * 100}%` }]} />
      </View>
    </View>
  );
}

function createStyles(colors: ReturnType<typeof useTheme>['colors']) {
  return StyleSheet.create({
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
      borderColor: colors.brandOrange,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.brandOrangeMuted,
    },
    track: {
      flex: 1,
      height: 14,
      borderRadius: Radii.pill,
      backgroundColor: colors.semanticTrack,
      overflow: 'hidden',
    },
    fill: {
      height: '100%',
      borderRadius: Radii.pill,
      backgroundColor: colors.healthy,
    },
  });
}

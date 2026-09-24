import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';

import { Radii, Space, Typography } from '@/constants/theme';
import { useTheme } from '@/lib/theme/ThemeProvider';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'success' | 'ghost';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function PrimaryButton({ label, onPress, variant = 'primary', disabled, style }: PrimaryButtonProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const isGhost = variant === 'ghost';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' && { backgroundColor: pressed && !disabled ? colors.brandOrangeActive : colors.brandOrange },
        variant === 'success' && { backgroundColor: colors.healthy },
        isGhost && styles.ghost,
        disabled && styles.disabled,
        pressed && !disabled && variant !== 'primary' && styles.pressed,
        style,
      ]}>
      <Text style={[styles.label, isGhost && styles.ghostLabel]}>{label}</Text>
    </Pressable>
  );
}

function createStyles(colors: ReturnType<typeof useTheme>['colors']) {
  return StyleSheet.create({
    base: {
      borderRadius: Radii.md,
      paddingVertical: Space.lg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    ghost: {
      backgroundColor: 'transparent',
    },
    disabled: {
      opacity: 0.4,
    },
    pressed: {
      opacity: 0.85,
    },
    label: {
      color: '#FFFFFF',
      fontSize: 16,
      fontFamily: Typography.fontFamilyMedium,
      fontWeight: '700',
      letterSpacing: 0.3,
    },
    ghostLabel: {
      color: colors.muted,
      fontWeight: '600',
    },
  });
}

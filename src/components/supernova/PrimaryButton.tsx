import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';

import { Colors, Radii, Space } from '@/constants/palette';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'success' | 'ghost';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function PrimaryButton({ label, onPress, variant = 'primary', disabled, style }: PrimaryButtonProps) {
  const isGhost = variant === 'ghost';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' && { backgroundColor: Colors.primary },
        variant === 'success' && { backgroundColor: Colors.success },
        isGhost && styles.ghost,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}>
      <Text style={[styles.label, isGhost && styles.ghostLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
    color: '#0A0B14',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  ghostLabel: {
    color: Colors.textSecondary,
    fontWeight: '600',
  },
});

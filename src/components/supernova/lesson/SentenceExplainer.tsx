import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import Svg, { Path as SvgPath } from 'react-native-svg';

import type { SupportLanguage } from '@/components/supernova/LanguageToggle';
import { PrimaryButton } from '@/components/supernova/PrimaryButton';
import { Radii, Space } from '@/constants/theme';
import type { SentencePart } from '@/lib/curriculum/lesson-types';
import { useTheme } from '@/lib/theme/ThemeProvider';

const BRACE_HEIGHT = 14;

interface PartBox {
  x: number;
  width: number;
}

/** Walks through a sentence one chunk at a time: the active chunk is
 * highlighted, a curly brace slides under it, and a short label says what it
 * does. Calls `onDone` after the last chunk. */
export function SentenceExplainer({
  parts,
  language,
  onDone,
}: {
  parts: SentencePart[];
  language: SupportLanguage;
  onDone: () => void;
}) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [active, setActive] = useState(0);
  const boxes = useRef<Record<number, PartBox>>({});
  const [braceX] = useState(() => new Animated.Value(0));
  const [braceW] = useState(() => new Animated.Value(0));
  const [measured, setMeasured] = useState(0);

  const moveBrace = (index: number, animate: boolean) => {
    const box = boxes.current[index];
    if (!box) return;
    const config = { duration: animate ? 250 : 0, useNativeDriver: false };
    Animated.timing(braceX, { toValue: box.x, ...config }).start();
    Animated.timing(braceW, { toValue: box.width, ...config }).start();
  };

  useEffect(() => {
    moveBrace(active, measured === parts.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, measured]);

  const part = parts[active];
  const label = language === 'en' ? part.labelEn : part.labelHi;
  const isLast = active === parts.length - 1;

  return (
    <View style={styles.wrap}>
      <View style={styles.sentence}>
        {parts.map((p, i) => (
          <View
            key={i}
            style={styles.partWrap}
            onLayout={(e) => {
              const { x, width } = e.nativeEvent.layout;
              boxes.current[i] = { x, width };
              setMeasured(Object.keys(boxes.current).length);
            }}
          >
            <Text style={[styles.word, i === active ? styles.wordActive : styles.wordDim]}>{p.text}</Text>
          </View>
        ))}
        <Animated.View style={[styles.brace, { left: braceX, width: braceW, opacity: measured === parts.length ? 1 : 0 }]}>
          <Svg width="100%" height={BRACE_HEIGHT} viewBox="0 0 100 14" preserveAspectRatio="none">
            <SvgPath
              d="M 1 1 Q 1 9 9 9 L 42 9 Q 50 9 50 13 Q 50 9 58 9 L 91 9 Q 99 9 99 1"
              stroke={colors.brandOrange}
              strokeWidth={2}
              fill="none"
              strokeLinecap="round"
            />
          </Svg>
        </Animated.View>
      </View>
      <Text style={styles.label}>{label}</Text>
      <PrimaryButton
        label={isLast ? 'NEXT!' : 'NEXT PART'}
        onPress={() => (isLast ? onDone() : setActive(active + 1))}
        style={styles.button}
      />
    </View>
  );
}

function createStyles(colors: ReturnType<typeof useTheme>['colors']) {
  return StyleSheet.create({
    wrap: { gap: Space.md, alignItems: 'center' },
    sentence: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      columnGap: 8,
      paddingBottom: BRACE_HEIGHT + 4,
      position: 'relative',
    },
    partWrap: {},
    word: { fontSize: 24, fontWeight: '700' },
    wordActive: { color: colors.brandOrange },
    wordDim: { color: colors.muted, opacity: 0.55 },
    brace: { position: 'absolute', bottom: 0, height: BRACE_HEIGHT },
    label: {
      color: colors.graphite,
      fontSize: 18,
      fontWeight: '600',
      textAlign: 'center',
      backgroundColor: colors.surface,
      borderRadius: Radii.md,
      paddingVertical: Space.sm,
      paddingHorizontal: Space.lg,
      overflow: 'hidden',
    },
    button: { marginTop: Space.md, alignSelf: 'stretch' },
  });
}

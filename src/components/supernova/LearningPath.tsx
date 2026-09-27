import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path as SvgPath } from 'react-native-svg';

import { Radii, Space, Typography } from '@/constants/theme';
import { useTheme } from '@/lib/theme/ThemeProvider';
import type { DayRow } from '@/lib/api/curriculum';
import { questTypeIcon } from '@/lib/curriculum/questIcons';

const NODE_SIZE = 60;
const TODAY_NODE_SIZE = 72;
const ROW_HEIGHT = 108;
const AMPLITUDE = 64;
// A short repeating zigzag (in units of AMPLITUDE) so the path curves left
// and right down the screen instead of a straight vertical line — same
// snaking-path idea as Duolingo's unit map, built from our own nodes/colors
// rather than copying its artwork.
const OFFSET_PATTERN = [0, 1, 1.7, 1, 0, -1, -1.7, -1];

interface LearningPathProps {
  days: DayRow[];
  todayDay: number;
  ready: (day: number) => boolean;
  onSelectDay: (day: DayRow) => void;
  width: number;
  /** Where in the zigzag cycle this path's first node falls — pass the
   * previous section's `nextStartIndex` so consecutive week sections
   * continue the same snake instead of every section resetting back to
   * dead center, which reads as a broken jump where one section meets the
   * next (see docs/CONTENT_GENERATION.md's Home-screen roadmap section). */
  startIndex?: number;
}

/** The index the *next* section's `startIndex` should use to continue this
 * one's snake seamlessly (accounts for the trailing trophy node too). */
export function nextPathIndex(days: DayRow[], startIndex = 0): number {
  return startIndex + days.length + 1;
}

export function LearningPath({ days, todayDay, ready, onSelectDay, width, startIndex = 0 }: LearningPathProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const centerX = width / 2;
  const offsetAt = (i: number) => OFFSET_PATTERN[(startIndex + i) % OFFSET_PATTERN.length] * AMPLITUDE;
  // One point per day, plus a trailing point for the trophy so the same
  // curve flows through it instead of it floating disconnected.
  const points = [...days, null].map((_, i) => ({
    x: centerX + offsetAt(i),
    y: i * ROW_HEIGHT + TODAY_NODE_SIZE / 2,
  }));
  const trophyPoint = points[points.length - 1];
  const height = points.length * ROW_HEIGHT + Space.xxl;

  const pathD = useMemo(() => {
    if (points.length < 2) return '';
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const cur = points[i];
      const midY = (prev.y + cur.y) / 2;
      d += ` C ${prev.x} ${midY}, ${cur.x} ${midY}, ${cur.x} ${cur.y}`;
    }
    return d;
  }, [points]);

  return (
    <View style={[styles.wrap, { width, height }]}>
      <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
        <SvgPath d={pathD} stroke={colors.hairline} strokeWidth={4} strokeDasharray="1,14" strokeLinecap="round" fill="none" />
      </Svg>

      {days.map((day, i) => {
        const isToday = day.day === todayDay;
        const isReady = ready(day.day);
        const point = points[i];
        const size = isToday ? TODAY_NODE_SIZE : NODE_SIZE;

        return (
          <View key={day.day} style={{ position: 'absolute', left: point.x - size / 2, top: point.y - size / 2 }}>
            {isToday && isReady && (
              <View style={styles.startBubble}>
                <Text style={styles.startBubbleText}>START</Text>
                <View style={styles.startBubbleTail} />
              </View>
            )}
            <Pressable
              disabled={!isReady}
              onPress={() => onSelectDay(day)}
              style={({ pressed }) => [
                styles.node,
                { width: size, height: size, borderRadius: size / 2 },
                isReady && isToday && styles.nodeToday,
                isReady && !isToday && styles.nodeUnlocked,
                !isReady && styles.nodeLocked,
                pressed && isReady && styles.nodePressed,
              ]}>
              {isReady ? (
                <Ionicons
                  name={isToday ? 'play' : questTypeIcon[day.quest_1_type ?? 'practice']}
                  size={isToday ? 26 : 20}
                  color={isToday ? '#FFFFFF' : colors.brandOrange}
                />
              ) : (
                <Ionicons name="lock-closed" size={18} color={colors.textMuted} />
              )}
            </Pressable>
            <Text style={[styles.dayLabel, !isReady && styles.dayLabelLocked]}>Day {day.day}</Text>
          </View>
        );
      })}

      <View style={[styles.trophyNode, { left: trophyPoint.x - 22, top: trophyPoint.y - 22 }]}>
        <Ionicons name="trophy" size={22} color={colors.attention} />
      </View>
    </View>
  );
}

function createStyles(colors: ReturnType<typeof useTheme>['colors']) {
  return StyleSheet.create({
    wrap: {
      alignSelf: 'center',
    },
    node: {
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
    },
    nodeToday: {
      backgroundColor: colors.brandOrange,
      borderColor: colors.brandOrange,
      ...cardShadow(colors),
    },
    nodeUnlocked: {
      backgroundColor: colors.card,
      borderColor: colors.brandOrangeMuted,
      ...cardShadow(colors),
    },
    nodeLocked: {
      backgroundColor: colors.semanticTrack,
      borderColor: colors.semanticTrack,
    },
    nodePressed: {
      opacity: 0.85,
    },
    dayLabel: {
      marginTop: Space.xs,
      textAlign: 'center',
      color: colors.muted,
      fontSize: Typography.caption.fontSize,
      fontFamily: Typography.fontFamily,
    },
    dayLabelLocked: {
      color: colors.textMuted,
    },
    startBubble: {
      position: 'absolute',
      top: -40,
      alignSelf: 'center',
      backgroundColor: colors.card,
      borderRadius: Radii.md,
      paddingVertical: Space.xs,
      paddingHorizontal: Space.md,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      zIndex: 2,
    },
    startBubbleText: {
      color: colors.brandOrange,
      fontWeight: '800',
      fontSize: 12,
      letterSpacing: 0.5,
    },
    startBubbleTail: {
      position: 'absolute',
      bottom: -6,
      alignSelf: 'center',
      width: 12,
      height: 12,
      backgroundColor: colors.card,
      borderRightWidth: 1,
      borderBottomWidth: 1,
      borderColor: colors.cardBorder,
      transform: [{ rotate: '45deg' }],
    },
    trophyNode: {
      position: 'absolute',
      width: 44,
      height: 44,
      borderRadius: Radii.pill,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.attentionMuted,
    },
  });
}

function cardShadow(colors: ReturnType<typeof useTheme>['colors']) {
  return {
    shadowColor: colors.graphite,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  };
}

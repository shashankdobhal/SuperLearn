import type { Ionicons } from '@expo/vector-icons';

import type { QuestType } from './types';

type IconName = keyof typeof Ionicons.glyphMap;

export const questTypeIcon: Record<QuestType, IconName> = {
  learn: 'book',
  translation: 'swap-horizontal',
  listening: 'ear',
  reading: 'reader',
  writing: 'create',
  practice: 'flash',
  speaking: 'mic',
  conversation: 'chatbubbles',
  review: 'refresh',
  mission: 'flag',
  mixed: 'apps',
};

import { NewsType } from '../types';

export const NEWS_CATEGORY_MAPPER = {
  'K-POP': '🎧K-POP',
  'K-DRAMA': '💖K-Drama',
  'K-BEAUTY': '💄K-Beauty',
  'K-FASHION': '🧢K-Fashion',
  'K-CULTURE': '🇰🇷K-Culture',
} as const;

export const NEWS_CATEGORIES = Object.keys(NEWS_CATEGORY_MAPPER) as NewsType[];

export const NEWS_SORT_MAPPER = {
  TRENDING: 'Trending',
  NEW: 'New',
} as const;

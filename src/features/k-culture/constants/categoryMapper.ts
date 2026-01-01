import { NewsType } from '../types';

export const NEWS_CATEGORY_MAPPER = {
  K_POP: '🎧K-POP',
  K_DRAMA: '💖K-Drama',
  K_BEAUTY: '💄K-Beauty',
  K_FASHION: '🧢K-Fashion',
  K_CULTURE: '🇰🇷K-Culture',
} as const;

export const NEWS_CATEGORIES = Object.keys(NEWS_CATEGORY_MAPPER) as NewsType[];

export const NEW_CATEGORY_MAPPER_NO_EMOJI = {
  K_POP: 'K-POP',
  K_DRAMA: 'K-Drama',
  K_BEAUTY: 'K-Beauty',
  K_FASHION: 'K-Fashion',
  K_CULTURE: 'K-Culture',
} as const;

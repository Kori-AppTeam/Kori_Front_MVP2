// components/UserProfileCard/constants.ts

import type { IconType } from '@/components/common/Icon';
import type { Gender } from './types';

// Layout constants
export const CARD_RADIUS = 22;
export const CARD_MAX_WIDTH = 388;
export const PADDING_HORIZONTAL = 20;
export const PADDING_TOP = 22;
export const PADDING_BOTTOM = 18;

export const NAME_MARGIN_TOP = 14;
export const META_MARGIN_TOP = 6;
export const BIO_MARGIN_TOP = 14;
export const BIO_MARGIN_BOTTOM = 18;

export const DIVIDER_COLOR = '#EAEAEA';
export const CHEVRON = { size: 28, ring: 1, lift: 13 };

export const SECTION_GAP_TOP = 16;
export const COLUMN_GAP = 18;
export const BUTTON_GAP = 14;
export const CARD_OUTER_GAP = 16;

// Gender icon mapping
export const GENDER_ICON_MAP: Record<Gender, IconType> = {
  Male: 'maleColored',
  Female: 'femaleColored',
  Unspecified: 'nogender',
};

// Image URL base
export const getImageUrl = (imageKey?: string): string | undefined => {
  if (!imageKey) return undefined;
  if (/^https?:\/\//i.test(imageKey)) return imageKey;

  // Try different config keys
  const bases = [
    (global as any).EXPO_PUBLIC_NCP_PUBLIC_BASE_URL,
    (global as any).NCP_PUBLIC_BASE_URL,
    (global as any).EXPO_PUBLIC_IMAGE_BASE_URL,
    (global as any).IMAGE_BASE_URL,
  ];

  const base = bases.find(Boolean);
  if (!base) return undefined;

  return `${String(base).replace(/\/+$/, '')}/${String(imageKey).replace(/^\/+/, '')}`;
};

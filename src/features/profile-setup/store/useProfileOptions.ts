import { create } from 'zustand';
import { useEffect } from 'react';
import { getProfileOptions } from '@/src/features/profile-setup/api/options';

type InterestCategory = {
  category: string;
  items: string[];
};

type ProfileOptionsPayload = {
  introductions?: unknown;
  interests?: {
    categories?: unknown;
  };
};

type ProfileOptionsState = {
  introductions: string[];
  interestCategories: InterestCategory[];
  isLoading: boolean;
  isLoaded: boolean;
  error: string | null;
  fetchProfileOptions: () => Promise<void>;
};

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is string => typeof v === 'string' && v.trim().length > 0);
}

function toInterestCategories(value: unknown): InterestCategory[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((v) => {
      const obj = v as any;
      const category = typeof obj?.category === 'string' ? obj.category : '';
      const items = toStringArray(obj?.items);
      if (!category || items.length === 0) return null;
      return { category, items } satisfies InterestCategory;
    })
    .filter((v): v is InterestCategory => v !== null);
}

function extractPayload(raw: any): ProfileOptionsPayload {
  const payload = raw?.data ?? raw;
  return (payload ?? {}) as ProfileOptionsPayload;
}

// 프로필 옵션 store
export const useProfileOptionsStore = create<ProfileOptionsState>((set, get) => ({
  introductions: [],
  interestCategories: [],
  isLoading: false,
  isLoaded: false,
  error: null,
  fetchProfileOptions: async () => {
    const { isLoading, isLoaded } = get();
    if (isLoading || isLoaded) return;

    set({ isLoading: true, error: null });
    try {
      const raw = await getProfileOptions();
      const payload = extractPayload(raw);

      set({
        introductions: toStringArray(payload.introductions),
        interestCategories: toInterestCategories(payload.interests?.categories),
        isLoaded: true,
        isLoading: false,
        error: null,
      });
    } catch (e: any) {
      set({
        isLoading: false,
        error: e?.message ? String(e.message) : 'Failed to fetch profile options',
      });
    }
  },
}));

// profile-setup 진입 시 프로필 옵션을 1회 초기화하는 훅
export function useInitProfileOptions() {
  const isLoaded = useProfileOptionsStore((s) => s.isLoaded);
  const fetchProfileOptions = useProfileOptionsStore((s) => s.fetchProfileOptions);

  useEffect(() => {
    if (isLoaded) return;
    fetchProfileOptions();
  }, [isLoaded, fetchProfileOptions]);
}

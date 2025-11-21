// src/features/chat/room/stores/useSearchStore.ts
import { create } from 'zustand';
import { ChatMessage } from '../types/index';

interface SearchState {
  // 상태
  isActive: boolean;
  isSearching: boolean;
  searchText: string;
  searchResults: ChatMessage[];
  currentIndex: number;
  totalCount: number;
  error: Error | null;

  // 액션
  toggleSearch: () => void;
  activateSearch: () => void;
  deactivateSearch: () => void;
  setSearchText: (text: string) => void;
  setSearchResults: (results: ChatMessage[]) => void;
  setCurrentIndex: (index: number) => void;
  setIsSearching: (isSearching: boolean) => void;
  setError: (error: Error | null) => void;
  clearSearch: () => void;
  incrementIndex: () => void;
  decrementIndex: () => void;
}

export const useSearchStore = create<SearchState>((set, get) => ({
  // 초기 상태
  isActive: false,
  isSearching: false,
  searchText: '',
  searchResults: [],
  currentIndex: 0,
  totalCount: 0,
  error: null,

  // 액션
  toggleSearch: () => {
    const { isActive } = get();
    if (isActive) {
      get().deactivateSearch();
    } else {
      get().activateSearch();
    }
  },

  activateSearch: () => set({
    isActive: true,
    searchText: '',
    searchResults: [],
    currentIndex: 0,
    totalCount: 0,
    isSearching: false,
    error: null,
  }),

  deactivateSearch: () => set({
    isActive: false,
    isSearching: false,
    searchText: '',
    searchResults: [],
    currentIndex: 0,
    totalCount: 0,
    error: null,
  }),

  setSearchText: (text: string) => set({
    searchText: text,
    isSearching: false,
  }),

  setSearchResults: (results: ChatMessage[]) => set({
    searchResults: results,
    totalCount: results.length,
    currentIndex: 0,
    isSearching: true,
    error: null,
  }),

  setCurrentIndex: (index: number) => set({ currentIndex: index }),

  setIsSearching: (isSearching: boolean) => set({ isSearching }),

  setError: (error: Error | null) => set({
    error,
    isSearching: false,
  }),

  clearSearch: () => set({
    searchText: '',
    isSearching: false,
    searchResults: [],
    currentIndex: 0,
    totalCount: 0,
    error: null,
  }),

  incrementIndex: () => {
    const { currentIndex, searchResults } = get();
    if (currentIndex + 1 < searchResults.length) {
      set({ currentIndex: currentIndex + 1 });
    }
  },

  decrementIndex: () => {
    const { currentIndex } = get();
    if (currentIndex - 1 >= 0) {
      set({ currentIndex: currentIndex - 1 });
    }
  },
}));
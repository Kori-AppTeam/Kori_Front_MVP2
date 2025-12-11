import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface StartCountStore {
  startCount: number;
  addStartCount: () => void;
  resetStartCount: () => void;
}

// 앱의 실행 횟수를 저장하는 store (AsyncStorage에 영구 저장)
export const useStartCountStore = create<StartCountStore>()(
  persist(
    (set) => ({
      startCount: 0,
      addStartCount: () => set((state) => ({ startCount: state.startCount + 1 })),
      resetStartCount: () => set({ startCount: 0 }),
    }),
    {
      name: 'start-count',
      storage: {
        getItem: async (name) => {
          const value = await AsyncStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name, value) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name) => {
          await AsyncStorage.removeItem(name);
        },
      },
    },
  ),
);

import { create } from 'zustand';

interface AuthStore {
  currentUserId: number | null;
  setCurrentUserId: (userId: number | null) => void;
}

const useAuthStore = create<AuthStore>((set) => ({
  currentUserId: null,
  setCurrentUserId: (userId: number | null) => set({ currentUserId: userId }),
}));

export default useAuthStore;

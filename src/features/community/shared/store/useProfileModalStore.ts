import { create } from 'zustand';

interface ProfileModalStore {
  profileModalVisible: boolean;
  setProfileModalVisible: (visible: boolean) => void;
}

export const useProfileModalStore = create<ProfileModalStore>((set) => ({
  profileModalVisible: false,
  setProfileModalVisible: (visible: boolean) => set({ profileModalVisible: visible }),
}));

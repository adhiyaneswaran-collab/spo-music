import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  userId: string | null;
  phoneNumber: string | null;
  name: string | null;
  setUser: (user: { userId: string; phoneNumber: string; name: string }) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userId: null,
      phoneNumber: null,
      name: null,
      setUser: (user) => set({ ...user }),
      clearUser: () => set({ userId: null, phoneNumber: null, name: null }),
    }),
    {
      name: 'user-storage',
    }
  )
);

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { createJSONStorage } from "zustand/middleware";
//
const userStore = (set) => ({
  user: {},
  userRole: null,
  isHydrated: false,

  setUser: (user) => set({ user }, false, "setUser"),

  getUser: () => set((store) => ({ user: store.user }), false, "getUser"),

  updateUser: (user) => set({ user }, false, "updateUser"),

  setUserRole: (role) => set({ userRole: role }, false, "setUserRole"),

  getUserRole: () => set((store) => ({ userRole: store.userRole }), false, "getUserRole"),

  clearUserRole: () => set({ userRole: null }, false, "clearUserRole"),

  clearUser: () => set({ user: {}, userRole: null }, false, "clearUser"),

  setHydrated: () => set({ isHydrated: true }, false, "setHydrated"),

  login: (email, role = 'admin') => {
      const mockUser = {
          uid: 'mock-user-id',
          name: 'Demo User',
          email: email,
          role: role,
          photoURL: '',
      };
      set({ user: mockUser, userRole: role }, false, "login");
  }
});

export const useUserStore = create(
  persist(devtools(userStore), {
    name: "user-storage",
    storage: createJSONStorage(() => localStorage),
    onRehydrateStorage: () => (state) => {
      state?.setHydrated();
    },
  })
);

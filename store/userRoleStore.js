import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

const userRoleStore = (set) => ({
  userRole: null,
  setUserRole: (role) =>
    set((store) => ({ userRole: role }), false, "setUserRole"),
  removeUserRole: () => set((store) => ({ userRole: null })),
});

export const useUserRoleStore = create(devtools(userRoleStore));

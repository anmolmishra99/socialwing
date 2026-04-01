import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  getConnectedAccounts,
  saveConnectedAccount,
  deleteConnectedAccount,
} from "@/lib/firestore/accounts";

const accountsStore = (set, get) => ({
  accounts: [],
  loading: false,
  error: null,

  /**
   * Load all connected accounts from Firestore for a user.
   */
  fetchAccounts: async (userId) => {
    if (!userId) return;
    set({ loading: true, error: null }, false, "fetchAccounts/start");
    try {
      const accounts = await getConnectedAccounts(userId);
      set({ accounts, loading: false }, false, "fetchAccounts/success");
    } catch (err) {
      console.error("Failed to fetch accounts:", err);
      set({ loading: false, error: err.message }, false, "fetchAccounts/error");
    }
  },

  /**
   * Save a connected account to Firestore and update state.
   */
  addAccount: async (userId, accountData) => {
    if (!userId || !accountData) return;
    try {
      await saveConnectedAccount(userId, accountData);
      // Refresh the list to get the server timestamp
      const accounts = await getConnectedAccounts(userId);
      set({ accounts }, false, "addAccount");
    } catch (err) {
      console.error("Failed to save account:", err);
      set({ error: err.message }, false, "addAccount/error");
      throw err;
    }
  },

  /**
   * Disconnect (remove) a social account.
   */
  removeAccount: async (userId, platform) => {
    if (!userId || !platform) return;
    try {
      await deleteConnectedAccount(userId, platform);
      set(
        (state) => ({
          accounts: state.accounts.filter((a) => a.platform !== platform),
        }),
        false,
        "removeAccount"
      );
    } catch (err) {
      console.error("Failed to remove account:", err);
      set({ error: err.message }, false, "removeAccount/error");
      throw err;
    }
  },

  /**
   * Get account data for a specific platform.
   */
  getAccountByPlatform: (platformId) => {
    return get().accounts.find(
      (a) => a.platform === platformId || a.id === platformId
    );
  },

  /**
   * Clear the store (e.g. on logout).
   */
  clearAccounts: () => {
    set({ accounts: [], loading: false, error: null }, false, "clearAccounts");
  },
});

export const useAccountsStore = create(devtools(accountsStore));

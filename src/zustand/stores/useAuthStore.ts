import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { clearStorageExcept, STORAGE_KEYS } from '../../lib/commons/asyncStorage';
import { _hasActiveClinic, _hasActiveSubscription } from '../../lib/commons/auth.Utils';
import { IMyProfileDoc } from '../../typescripts/interfaces/profile.interfaces';

type TAuthState = {
  userData: IMyProfileDoc | null;
  isLoggedIn: boolean;
  isDoctor?: boolean;
  hasActiveSubscription: boolean;
  hasActiveClinic: boolean;
  setUserData: (user: IMyProfileDoc | null) => void;
  logout: () => Promise<void>;
};

const accessFromUser = (user: IMyProfileDoc | null) => ({
  hasActiveSubscription: _hasActiveSubscription(user),
  hasActiveClinic: _hasActiveClinic(user),
});

export const useAuthStore = create<TAuthState>()(
  persist(
    set => ({
      userData: null,
      isLoggedIn: false,
      hasActiveSubscription: false,
      hasActiveClinic: false,
      activeWorkspace: null,
      setUserData: (user: IMyProfileDoc | null) => {
        if (!user) {
          set({
            userData: null,
            isLoggedIn: false,
            isDoctor: false,
            hasActiveSubscription: false,
            hasActiveClinic: false,
          });
          return;
        }
        set({
          userData: user,
          isLoggedIn: true,
          isDoctor: user?.role === 'doctor' ? true : false,
          ...accessFromUser(user),
        });
      },

      logout: async () => {
        set({
          userData: null,
          isLoggedIn: false,
          isDoctor: false,
          hasActiveSubscription: false,
          hasActiveClinic: false,
        });
        await clearStorageExcept([STORAGE_KEYS.FCM_TOKEN]);
      },
    }),
    {
      name: STORAGE_KEYS.USER_DATA,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        userData: state.userData,
        isLoggedIn: state.isLoggedIn,
      }),
      onRehydrateStorage: () => state => {
        if (!state) return;
        useAuthStore.setState(accessFromUser(state.userData));
      },
    }
  )
);

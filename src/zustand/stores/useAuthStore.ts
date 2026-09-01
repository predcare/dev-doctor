import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { clearStorageExcept, STORAGE_KEYS } from '../../lib/common/asyncStorage';
import { IMyProfileDoc } from '../../typescripts/interfaces/profile.interfaces';

type TAuthState = {
  userData: any;
  isLoggedIn: boolean;
  isDoctor?: boolean;
  setUserData: (user: any) => void;
  logout: () => Promise<void>;
};

export const useAuthStore = create<TAuthState>()(
  persist(
    set => ({
      userData: null,
      isLoggedIn: false,
      activeWorkspace: null,
      setUserData: (user: IMyProfileDoc) => {
        if (!user) {
          set({
            userData: null,
            isLoggedIn: false,
            isDoctor: false,
          });
          return;
        }
        set({
          userData: user,
          isLoggedIn: true,
          isDoctor: user?.role === 'doctor' ? true : false,
        });
      },

      logout: async () => {
        set({
          userData: null,
          isLoggedIn: false,
          isDoctor: false,
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
    }
  )
);

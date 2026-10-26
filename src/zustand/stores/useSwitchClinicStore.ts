import { create } from 'zustand';

type SwitchClinicState = {
  visible: boolean;
  open: () => void;
  close: () => void;
};

export const useSwitchClinicStore = create<SwitchClinicState>(set => ({
  visible: false,
  open: () => set({ visible: true }),
  close: () => set({ visible: false }),
}));

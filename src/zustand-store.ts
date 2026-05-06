import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SecuritySettingsSheetStore = {
  isOpen: boolean;
  setIsOpen: (state: boolean) => void;
};

export const useSecuritySettingsSheetStore = create<SecuritySettingsSheetStore>()((set) => ({
  isOpen: false,
  setIsOpen: (state) => set(() => ({ isOpen: state })),
}));

export type PasswordResetStore = {
  passwordResetState: boolean;
  setPasswordResetState: (state: boolean) => void;
};

export const usePasswordResetStore = create<PasswordResetStore>()(
  persist(
    (set) => ({
      passwordResetState: false,
      setPasswordResetState: (state) => set(() => ({ passwordResetState: state })),
    }),
    {
      name: "password-recovery",
    }
  )
);
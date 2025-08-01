import { create } from "zustand";

interface AuthState {
  email: string;
  token: string;
  resetToken: string;
  setEmail: (email: string) => void;
  setToken: (token: string) => void;
  setResetToken: (resetToken: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  email: "",
  token: "",
  resetToken: "",
  setEmail: (email) => set({ email }),
  setToken: (token) => set({ token }),
  setResetToken: (resetToken) => set({ resetToken }),
}));

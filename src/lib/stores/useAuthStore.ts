import { create } from "zustand";

type UserPayload = {
  id: number;
  memberId: string;
  userName: string;
  role: string;
  iat: number;
  exp: number;
};

interface AuthState {
  isLogin: boolean;
  userPayload: UserPayload | null;
  token: string | null;
  setIsLogin: (flag: boolean) => void;
  setUserPayload: (payload: UserPayload | null) => void;
  setToken: (token: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  setToken: (token: string | null) => set({ token }),
  isLogin: false,
  userPayload: null,
  setIsLogin: (flag) => set({ isLogin: flag }),
  setUserPayload: (payload: UserPayload | null) =>
    set({ userPayload: payload }),
}));

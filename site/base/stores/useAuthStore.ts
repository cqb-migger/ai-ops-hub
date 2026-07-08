import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface User {
  id: number;
  email: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  role: string;
  is_active: boolean;
}

export interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  login: (token: string, refreshToken: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        token: null,
        refreshToken: null,
        user: null,
        login: (token, refreshToken, user) => set({ token, refreshToken, user }),
        logout: () => set({ token: null, refreshToken: null, user: null }),
        updateUser: (user) => set({ user }),
      }),
      {
        name: 'auth-storage',
      }
    ),
    { name: 'auth' }
  )
);

export default useAuthStore;

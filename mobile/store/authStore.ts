import { create } from 'zustand';
import { router } from 'expo-router';
import api from '../lib/api';
import { saveToken, getToken, deleteToken } from '../lib/storage';
import type { User } from '../constants/types';

interface AuthState {
  user: User | null;
  token: string | null;
  initialized: boolean;
  login: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  initialized: false,

  login: async (user: User, token: string) => {
    await saveToken(token);
    set({ user, token });
  },

  logout: async () => {
    await deleteToken();
    set({ user: null, token: null });
    router.replace('/(auth)');
  },

  initialize: async () => {
    try {
      const token = await getToken();
      if (!token) {
        set({ initialized: true });
        return;
      }
      // Hydrate user from stored token.
      // The /profile endpoint returns { profile: { user_id, email, role, ... } }
      // so we map those fields onto the User shape.
      const response = await api.get<{ profile: { user_id: string; email: string; role: string } }>('/profile');
      const p = response.data.profile;
      const user: User = { id: p.user_id, email: p.email, role: p.role as User['role'] };
      set({ user, token, initialized: true });
    } catch {
      // Token invalid or expired
      await deleteToken();
      set({ user: null, token: null, initialized: true });
    }
  },
}));

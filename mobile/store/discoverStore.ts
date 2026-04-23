import { create } from 'zustand';
import api from '../lib/api';
import type { SwipeCard, SwipeResult, Company } from '../constants/types';

interface DiscoverState {
  cards: SwipeCard[];
  loading: boolean;
  dailySwipesUsed: number;
  selectedCompany: Company | null;
  fetchCards: () => Promise<void>;
  swipe: (userId: string, direction: 'like' | 'pass') => Promise<SwipeResult>;
  setSelectedCompany: (company: Company | null) => void;
  reset: () => void;
}

export const useDiscoverStore = create<DiscoverState>((set, get) => ({
  cards: [],
  loading: false,
  dailySwipesUsed: 0,
  selectedCompany: null,
  setSelectedCompany: (company) => set({ selectedCompany: company }),

  fetchCards: async () => {
    const { loading } = get();
    if (loading) return;
    set({ loading: true });
    try {
      const response = await api.get<{ cards: SwipeCard[]; daily_swipes_used: number }>('/discover');
      const { cards: newCards, daily_swipes_used } = response.data;
      set((state) => ({
        cards: [...state.cards, ...newCards],
        dailySwipesUsed: daily_swipes_used ?? state.dailySwipesUsed,
      }));
    } catch (err) {
      console.error('fetchCards error:', err);
    } finally {
      set({ loading: false });
    }
  },

  swipe: async (userId: string, direction: 'like' | 'pass'): Promise<SwipeResult> => {
    // Remove top card immediately for responsiveness
    set((state) => ({
      cards: state.cards.slice(1),
      dailySwipesUsed: state.dailySwipesUsed + 1,
    }));

    let result: SwipeResult = { matched: false };

    try {
      const response = await api.post<SwipeResult>('/swipe', {
        target_user_id: userId,
        direction,
      });
      result = response.data;
    } catch (err) {
      console.error('swipe error:', err);
    }

    // Fetch more cards if queue is running low
    const { cards } = get();
    if (cards.length < 3) {
      get().fetchCards();
    }

    return result;
  },

  reset: () => {
    set({ cards: [], loading: false, dailySwipesUsed: 0, selectedCompany: null });
  },
}));

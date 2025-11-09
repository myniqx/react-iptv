import { create } from 'zustand';
import type { WatchableItem } from '@zenith-tv/types';
import { db } from '../services/database';

export type CategoryType = 'all' | 'movies' | 'series' | 'live' | 'favorites' | 'recent';

interface ContentState {
  items: WatchableItem[];
  recentItems: WatchableItem[];
  favoritesItems: WatchableItem[];
  currentCategory: CategoryType;
  isLoading: boolean;
  currentProfileId: number | null;

  // Actions
  loadItemsForProfile: (profileId: number) => Promise<void>;
  loadRecent: (profileId: number) => Promise<void>;
  loadFavorites: (profileId: number) => Promise<void>;
  setCategory: (category: CategoryType) => void;
  getFilteredItems: () => WatchableItem[];
  toggleFavorite: (url: string) => Promise<void>;
  clearItems: () => void;
}

export const useContentStore = create<ContentState>((set, get) => ({
  items: [],
  recentItems: [],
  favoritesItems: [],
  currentCategory: 'all',
  isLoading: false,
  currentProfileId: null,

  loadItemsForProfile: async (profileId) => {
    set({ isLoading: true, currentProfileId: profileId });
    try {
      const items = await db.getItemsByProfile(profileId);
      set({ items });

      // Also load recent and favorites
      await get().loadRecent(profileId);
      await get().loadFavorites(profileId);
    } catch (error) {
      console.error('Failed to load items:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  loadRecent: async (profileId) => {
    try {
      const recentItems = await db.getRecentItems(profileId);
      set({ recentItems });
    } catch (error) {
      console.error('Failed to load recent items:', error);
    }
  },

  loadFavorites: async (profileId) => {
    try {
      const favoritesItems = await db.getFavorites(profileId);
      set({ favoritesItems });
    } catch (error) {
      console.error('Failed to load favorites:', error);
    }
  },

  setCategory: (category) => set({ currentCategory: category }),

  getFilteredItems: () => {
    const { items, recentItems, favoritesItems, currentCategory } = get();

    switch (currentCategory) {
      case 'all':
        return items;
      case 'movies':
        return items.filter((item) => item.category.type === 'movie');
      case 'series':
        return items.filter((item) => item.category.type === 'series');
      case 'live':
        return items.filter((item) => item.category.type === 'live_stream');
      case 'favorites':
        return favoritesItems;
      case 'recent':
        return recentItems;
      default:
        return items;
    }
  },

  toggleFavorite: async (url) => {
    const { currentProfileId } = get();
    if (!currentProfileId) return;

    try {
      const isFavorite = await db.toggleFavorite(url);

      // Update local state
      set((state) => ({
        items: state.items.map((item) =>
          item.url === url ? { ...item, isFavorite } : item
        ),
      }));

      // Reload favorites list
      await get().loadFavorites(currentProfileId);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  },

  clearItems: () => {
    set({
      items: [],
      recentItems: [],
      favoritesItems: [],
      currentProfileId: null,
    });
  },
}));

import { create } from 'zustand';
import type { WatchableItem } from '@zenith-tv/types';
import { db } from '../services/database';
import { useToastStore } from './toast';

export type CategoryType = 'all' | 'movies' | 'series' | 'live' | 'favorites' | 'recent';
export type SortBy = 'name' | 'date' | 'recent';
export type SortOrder = 'asc' | 'desc';

interface ContentState {
  items: WatchableItem[];
  recentItems: WatchableItem[];
  favoritesItems: WatchableItem[];
  currentCategory: CategoryType;
  searchQuery: string;
  sortBy: SortBy;
  sortOrder: SortOrder;
  isLoading: boolean;
  currentProfileId: number | null;

  // Actions
  loadItemsForProfile: (profileId: number) => Promise<void>;
  loadRecent: (profileId: number) => Promise<void>;
  loadFavorites: (profileId: number) => Promise<void>;
  setCategory: (category: CategoryType) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sortBy: SortBy) => void;
  setSortOrder: (order: SortOrder) => void;
  getFilteredItems: () => WatchableItem[];
  toggleFavorite: (url: string) => Promise<void>;
  clearItems: () => void;
}

export const useContentStore = create<ContentState>((set, get) => ({
  items: [],
  recentItems: [],
  favoritesItems: [],
  currentCategory: 'all',
  searchQuery: '',
  sortBy: 'name',
  sortOrder: 'asc',
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

  setSearchQuery: (query) => set({ searchQuery: query }),

  setSortBy: (sortBy) => set({ sortBy }),

  setSortOrder: (order) => set({ sortOrder: order }),

  getFilteredItems: () => {
    const { items, recentItems, favoritesItems, currentCategory, searchQuery, sortBy, sortOrder } = get();

    // Step 1: Filter by category
    let filtered: WatchableItem[] = [];
    switch (currentCategory) {
      case 'all':
        filtered = items;
        break;
      case 'movies':
        filtered = items.filter((item) => item.category.type === 'movie');
        break;
      case 'series':
        filtered = items.filter((item) => item.category.type === 'series');
        break;
      case 'live':
        filtered = items.filter((item) => item.category.type === 'live_stream');
        break;
      case 'favorites':
        filtered = favoritesItems;
        break;
      case 'recent':
        filtered = recentItems;
        break;
      default:
        filtered = items;
    }

    // Step 2: Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((item) =>
        item.title.toLowerCase().includes(query) ||
        item.group?.toLowerCase().includes(query)
      );
    }

    // Step 3: Sort items
    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'name':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'date':
          comparison = new Date(a.addedDate).getTime() - new Date(b.addedDate).getTime();
          break;
        case 'recent':
          if (a.watchHistory && b.watchHistory) {
            comparison = new Date(b.watchHistory.lastWatched).getTime() - new Date(a.watchHistory.lastWatched).getTime();
          } else if (a.watchHistory) {
            comparison = -1;
          } else if (b.watchHistory) {
            comparison = 1;
          }
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return sorted;
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

      // Show toast notification
      if (isFavorite) {
        useToastStore.getState().success('Added to favorites');
      } else {
        useToastStore.getState().info('Removed from favorites');
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      useToastStore.getState().error('Failed to update favorite');
    }
  },

  clearItems: () => {
    set({
      items: [],
      recentItems: [],
      favoritesItems: [],
      currentProfileId: null,
      searchQuery: '',
      sortBy: 'name',
      sortOrder: 'asc',
    });
  },
}));

import { create } from 'zustand';
import type { WatchableItem } from '@zenith-tv/types';

type CategoryType = 'all' | 'movies' | 'series' | 'live' | 'favorites' | 'recent';

interface ContentState {
  items: WatchableItem[];
  currentCategory: CategoryType;
  isLoading: boolean;

  // Actions
  setItems: (items: WatchableItem[]) => void;
  setCategory: (category: CategoryType) => void;
  getFilteredItems: () => WatchableItem[];
  toggleFavorite: (url: string) => void;
}

// Mock data for demonstration
const mockItems: WatchableItem[] = [
  {
    title: 'Action Movie 2024',
    url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    group: 'Action Movies',
    logo: undefined,
    category: { type: 'movie' },
    profileId: 1,
    addedDate: new Date(),
    isFavorite: false,
  },
  {
    title: 'Breaking Bad S01E01',
    url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    group: 'TV Series',
    category: {
      type: 'series',
      episode: { seriesName: 'Breaking Bad', season: 1, episode: 1 },
    },
    profileId: 1,
    addedDate: new Date(),
    isFavorite: true,
  },
  {
    title: 'News Channel HD',
    url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    group: 'News',
    category: { type: 'live_stream' },
    profileId: 1,
    addedDate: new Date(),
    isFavorite: false,
  },
];

export const useContentStore = create<ContentState>((set, get) => ({
  items: mockItems,
  currentCategory: 'all',
  isLoading: false,

  setItems: (items) => set({ items }),

  setCategory: (category) => set({ currentCategory: category }),

  getFilteredItems: () => {
    const { items, currentCategory } = get();

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
        return items.filter((item) => item.isFavorite);
      case 'recent':
        return [...items].sort(
          (a, b) => b.addedDate.getTime() - a.addedDate.getTime()
        ).slice(0, 20);
      default:
        return items;
    }
  },

  toggleFavorite: (url) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.url === url ? { ...item, isFavorite: !item.isFavorite } : item
      ),
    }));
  },
}));

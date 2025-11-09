export interface ElectronAPI {
  platform: NodeJS.Platform;
  version: string;
  db: {
    // Profiles
    getProfiles: () => Promise<DBProfile[]>;
    addProfile: (name: string, url: string) => Promise<number>;
    deleteProfile: (id: number) => Promise<void>;

    // Items
    getItemsByProfile: (profileId: number) => Promise<DBItem[]>;
    upsertItems: (profileId: number, items: any[]) => Promise<string[]>;
    updateProfileSync: (profileId: number, count: number) => Promise<void>;

    // Recent
    getRecentItems: (profileId: number) => Promise<DBItem[]>;
    addToRecent: (itemUrls: string[]) => Promise<void>;

    // Favorites
    toggleFavorite: (itemUrl: string) => Promise<boolean>;
    getFavorites: (profileId: number) => Promise<DBItem[]>;

    // Watch History
    saveWatchProgress: (itemUrl: string, position: number, duration: number) => Promise<void>;
    getWatchHistory: (itemUrl: string) => Promise<DBWatchHistory | undefined>;
  };
}

export interface DBProfile {
  id: number;
  name: string;
  m3u_url: string;
  last_sync: string | null;
  item_count: number;
  created_at: string;
}

export interface DBItem {
  url: string;
  title: string;
  group_name: string | null;
  logo: string | null;
  category_type: 'movie' | 'series' | 'live_stream';
  profile_id: number;
  added_date: string;

  // Series info (if applicable)
  series_name?: string;
  season?: number;
  episode?: number;

  // Favorite status
  is_favorite: number; // SQLite boolean (0 or 1)

  // Watch history (if exists)
  position?: number;
  duration?: number;
  last_watched?: string;
  completed?: number;
}

export interface DBWatchHistory {
  item_url: string;
  position: number;
  duration: number;
  last_watched: string;
  completed: number;
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}

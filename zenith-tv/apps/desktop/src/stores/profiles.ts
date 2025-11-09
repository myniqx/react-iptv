import { create } from 'zustand';
import type { Profile } from '@zenith-tv/types';

interface ProfilesState {
  profiles: Profile[];
  currentProfile: Profile | null;
  isLoading: boolean;

  // Actions
  addProfile: (url: string, name: string) => void;
  selectProfile: (profile: Profile) => void;
  deleteProfile: (id: number) => void;
  loadProfiles: () => void;
  updateProfileItemCount: (id: number, count: number) => void;
}

// Mock storage for now (will be replaced with SQLite)
const STORAGE_KEY = 'zenith_tv_profiles';

const loadFromStorage = (): Profile[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveToStorage = (profiles: Profile[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
  } catch (e) {
    console.error('Failed to save profiles:', e);
  }
};

export const useProfilesStore = create<ProfilesState>((set, get) => ({
  profiles: [],
  currentProfile: null,
  isLoading: false,

  loadProfiles: () => {
    const profiles = loadFromStorage();
    set({ profiles });
  },

  addProfile: (url, name) => {
    const profiles = get().profiles;
    const maxId = profiles.length > 0
      ? Math.max(...profiles.map(p => p.id))
      : 0;

    const newProfile: Profile = {
      id: maxId + 1,
      name,
      m3uUrl: url,
    };

    const updated = [...profiles, newProfile];
    set({ profiles: updated });
    saveToStorage(updated);
  },

  selectProfile: (profile) => {
    set({ currentProfile: profile });
  },

  deleteProfile: (id) => {
    const { profiles, currentProfile } = get();
    const updated = profiles.filter(p => p.id !== id);

    set({
      profiles: updated,
      currentProfile: currentProfile?.id === id ? null : currentProfile,
    });

    saveToStorage(updated);
  },

  updateProfileItemCount: (id, count) => {
    const profiles = get().profiles.map(p =>
      p.id === id ? { ...p, itemCount: count } : p
    );
    set({ profiles });
    saveToStorage(profiles);
  },
}));

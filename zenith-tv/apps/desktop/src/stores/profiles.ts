import { create } from 'zustand';
import type { Profile } from '@zenith-tv/types';
import { db } from '../services/database';
import { fetchAndParseM3U } from '../services/m3u-parser';
import { useContentStore } from './content';

interface ProfilesState {
  profiles: Profile[];
  currentProfile: Profile | null;
  isLoading: boolean;
  syncProgress: {
    stage: string;
    percent: number;
  } | null;

  // Actions
  addProfile: (url: string, name: string) => Promise<void>;
  selectProfile: (profile: Profile) => void;
  deleteProfile: (id: number) => Promise<void>;
  loadProfiles: () => Promise<void>;
  syncProfile: (profile: Profile, force?: boolean) => Promise<void>;
}

export const useProfilesStore = create<ProfilesState>((set, get) => ({
  profiles: [],
  currentProfile: null,
  isLoading: false,
  syncProgress: null,

  loadProfiles: async () => {
    set({ isLoading: true });
    try {
      const profiles = await db.getProfiles();
      set({ profiles });
    } catch (error) {
      console.error('Failed to load profiles:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  addProfile: async (url, name) => {
    set({ isLoading: true });
    try {
      await db.addProfile(name, url);
      await get().loadProfiles();
    } catch (error) {
      console.error('Failed to add profile:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  selectProfile: (profile) => {
    set({ currentProfile: profile });

    // Load items for this profile
    useContentStore.getState().loadItemsForProfile(profile.id);
  },

  deleteProfile: async (id) => {
    set({ isLoading: true });
    try {
      await db.deleteProfile(id);

      const { currentProfile } = get();
      if (currentProfile?.id === id) {
        set({ currentProfile: null });
        useContentStore.getState().clearItems();
      }

      await get().loadProfiles();
    } catch (error) {
      console.error('Failed to delete profile:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  syncProfile: async (profile, force = false) => {
    set({ isLoading: true, syncProgress: { stage: 'Starting...', percent: 0 } });

    try {
      // Fetch and parse M3U
      const items = await fetchAndParseM3U(
        profile.m3uUrl,
        profile.id,
        (stage, percent) => {
          set({ syncProgress: { stage, percent: percent || 0 } });
        }
      );

      // Save to database
      set({ syncProgress: { stage: 'Saving to database...', percent: 0 } });
      const newItemUrls = await db.upsertItems(profile.id, items);

      // Add new items to recent
      if (newItemUrls.length > 0) {
        await db.addToRecent(newItemUrls);
      }

      // Update profile sync time and item count
      await db.updateProfileSync(profile.id, items.length);

      // Reload profiles to update counts
      await get().loadProfiles();

      // Reload items if this is the current profile
      if (get().currentProfile?.id === profile.id) {
        await useContentStore.getState().loadItemsForProfile(profile.id);
      }

      set({ syncProgress: { stage: 'Complete!', percent: 100 } });

      // Clear progress after 2 seconds
      setTimeout(() => {
        set({ syncProgress: null });
      }, 2000);

    } catch (error) {
      console.error('Failed to sync profile:', error);
      set({ syncProgress: null });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));

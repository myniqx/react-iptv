"use client"

import { useCallback } from "react"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { ProfileData } from "@/lib/types"
import { useDataStorage } from "@/lib/hooks/useDataStorage"

interface IptvContextType {
  profiles: ProfileData[]
  currentProfileId: number | null
  isLoading: boolean
  addProfile: (profileData: Omit<ProfileData, "id">) => Promise<void>
  updateProfile: (profileData: ProfileData) => Promise<void>
  deleteProfile: (profileId: number) => Promise<void>
  loadProfile: (profileData: ProfileData, forceReload?: boolean) => Promise<boolean>
  clearProfile: () => void
}

const IptvContext = createContext<IptvContextType | undefined>(undefined)

interface IptvProviderProps {
  children: ReactNode
}

export function IptvProvider({ children }: IptvProviderProps) {
  const [profiles, setProfiles] = useState<ProfileData[]>([])
  const [currentProfileId, setCurrentProfileId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const storage = useDataStorage("localStorage")

  // Load profiles on mount
  useEffect(() => {
    loadProfiles()
  }, [])

  // Helper function to get next available ID
  const getNextProfileId = useCallback((profileList: ProfileData[]): number => {
    return profileList.length > 0 ? Math.max(...profileList.map((p) => p.id)) + 1 : 1
  }, [])

  // Load profiles from storage
  const loadProfiles = useCallback(async () => {
    try {
      const profileList = await storage.getItem<ProfileData[]>("profiles")
      setProfiles(profileList || [])
    } catch (error) {
      console.error("Failed to load profiles:", error)
      setProfiles([])
    }
  }, [storage])

  // Save profiles to storage
  const saveProfiles = useCallback(
    async (profileList: ProfileData[]) => {
      try {
        await storage.setItem("profiles", profileList)
        setProfiles(profileList)
      } catch (error) {
        console.error("Failed to save profiles:", error)
        throw error
      }
    },
    [storage],
  )

  // Add new profile
  const addProfile = useCallback(
    async (profileData: Omit<ProfileData, "id">): Promise<void> => {
      try {
        const existingProfiles = (await storage.getItem<ProfileData[]>("profiles")) || []

        // Check if URL already exists
        const existingProfile = existingProfiles.find((p) => p.url === profileData.url)
        if (existingProfile) {
          throw new Error("Profile with this URL already exists")
        }

        const newProfile: ProfileData = {
          ...profileData,
          id: getNextProfileId(existingProfiles),
          createdDate: Date.now(),
        }

        const updatedProfiles = [...existingProfiles, newProfile]
        await saveProfiles(updatedProfiles)
      } catch (error) {
        console.error("Failed to add profile:", error)
        throw error
      }
    },
    [storage, getNextProfileId, saveProfiles],
  )

  // Update existing profile
  const updateProfile = useCallback(
    async (profileData: ProfileData): Promise<void> => {
      try {
        const existingProfiles = (await storage.getItem<ProfileData[]>("profiles")) || []
        const profileIndex = existingProfiles.findIndex((p) => p.id === profileData.id)

        if (profileIndex === -1) {
          throw new Error("Profile not found")
        }

        existingProfiles[profileIndex] = profileData
        await saveProfiles(existingProfiles)
      } catch (error) {
        console.error("Failed to update profile:", error)
        throw error
      }
    },
    [storage, saveProfiles],
  )

  // Delete profile
  const deleteProfile = useCallback(
    async (profileId: number): Promise<void> => {
      try {
        const existingProfiles = (await storage.getItem<ProfileData[]>("profiles")) || []
        const filteredProfiles = existingProfiles.filter((p) => p.id !== profileId)

        await saveProfiles(filteredProfiles)

        // Clean up catalog data
        const catalogKeys = [
          `profile#${profileId}#m3u`,
          `profile#${profileId}#pinnedGroups`,
          `profile#${profileId}#latelyAdded`,
          `profile#${profileId}#bannedGroups`,
          `profile#${profileId}#listedItems`,
        ]

        for (const key of catalogKeys) {
          await storage.removeItem(key)
        }

        // Clear current profile if it belongs to deleted profile
        if (currentProfileId === profileId) {
          setCurrentProfileId(null)
        }
      } catch (error) {
        console.error("Failed to delete profile:", error)
        throw error
      }
    },
    [storage, saveProfiles, currentProfileId],
  )

  // Load profile
  const loadProfile = useCallback(async (profileData: ProfileData, forceReload = false): Promise<boolean> => {
    setIsLoading(true)
    try {
      setCurrentProfileId(profileData.id)
      return true
    } catch (error) {
      console.error("Failed to load profile:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Clear profile
  const clearProfile = useCallback(() => {
    setCurrentProfileId(null)
  }, [])

  const value: IptvContextType = {
    profiles,
    currentProfileId,
    isLoading,
    addProfile,
    updateProfile,
    deleteProfile,
    loadProfile,
    clearProfile,
  }

  return <IptvContext.Provider value={value}>{children}</IptvContext.Provider>
}

export function useIptv() {
  const context = useContext(IptvContext)
  if (context === undefined) {
    throw new Error("useIptv must be used within an IptvProvider")
  }
  return context
}

// Export useCatalog for direct use
export { useCatalog } from "@/lib/hooks/useCatalog"

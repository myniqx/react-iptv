"use client"

import { useState, useCallback, useRef } from "react"
import type { CatalogData, GroupObjectData, WatchableObjectData, M3UObjectData } from "@/lib/types"
import { useDataStorage } from "./useDataStorage"
import { M3UFileParser } from "@/lib/utils/m3u-file-parser"
import { EList } from "../utils/e-list"

interface UseCatalogReturn {
  catalog: CatalogData | null
  isLoading: boolean
  loadCatalog: (profileId: number, profileUrl: string, forceReload?: boolean) => Promise<boolean>
  setWatchableList: (watchable: WatchableObjectData, list: EList) => Promise<void>
  addM3UList: (list: M3UObjectData[]) => Promise<void>
  findByUrl: (url: string) => WatchableObjectData | undefined
  startSearch: (text: string) => Promise<GroupObjectData | null>
  clearCatalog: () => void
}

export function useCatalog(catalogId: number): UseCatalogReturn {
  const [catalog, setCatalog] = useState<CatalogData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const storage = useDataStorage("localStorage")
  const abortControllerRef = useRef<AbortController | null>(null)

  // Helper function to create profile key
  const getProfileKey = useCallback((profileId: number, suffix: string): string => {
    return `profile#${profileId}#${suffix}`
  }, [])

  // Create empty catalog
  const createEmptyCatalog = useCallback((profileId: number): CatalogData => {
    const createEmptyGroup = (name: string, icon: string): GroupObjectData => ({
      name,
      logo: "",
      logoPercent: 0,
      isSticky: false,
      titleIcon: icon,
      title: "Group",
      watchables: [],
      groups: [],
      getListIcon: icon,
      totalCount: 0,
      liveStreamCount: 0,
      tvShowSeasonCount: 0,
      tvShowEpisodeCount: 0,
      movieCount: 0,
      tvShowCount: 0,
      localCount: 0,
    })

    return {
      name: "Catalog",
      logo: "",
      logoPercent: 0,
      isSticky: false,
      titleIcon: "folder",
      title: "Catalog",
      watchables: [],
      groups: [],
      getListIcon: "folder",
      totalCount: 0,
      liveStreamCount: 0,
      tvShowSeasonCount: 0,
      tvShowEpisodeCount: 0,
      movieCount: 0,
      tvShowCount: 0,
      localCount: 0,
      profileId,
      recentlyAdded: createEmptyGroup("Recently", "clock"),
      watchedList: createEmptyGroup("Watched", "check"),
      watchList: createEmptyGroup("Favorites", "heart"),
      movieList: createEmptyGroup("Movies", "film"),
      tvShowList: createEmptyGroup("TV Shows", "tv"),
      liveStreamList: createEmptyGroup("Live Streams", "radio"),
      isLoaded: false,
      listedItems: new Map(),
      bannedGroups: new Set(),
      pinnedGroups: new Set(),
      latelyAdded: new Map(),
      m3uMap: null,
      groupCount: 0,
    }
  }, [])

  // Load catalog data from storage
  const loadFromStorage = useCallback(
    async (profileId: number): Promise<void> => {
      try {
        const keys = {
          pinnedGroups: getProfileKey(profileId, "pinnedGroups"),
          latelyAdded: getProfileKey(profileId, "latelyAdded"),
          bannedGroups: getProfileKey(profileId, "bannedGroups"),
          listedItems: getProfileKey(profileId, "listedItems"),
        }

        const [pinnedGroups, latelyAdded, bannedGroups, listedItems] = await Promise.all([
          storage.getItem<string[]>(keys.pinnedGroups),
          storage.getItem<[Date, string[]][]>(keys.latelyAdded),
          storage.getItem<string[]>(keys.bannedGroups),
          storage.getItem<[string, EList][]>(keys.listedItems),
        ])

        setCatalog((prev) =>
          prev
            ? {
              ...prev,
              pinnedGroups: new Set(pinnedGroups || []),
              latelyAdded: new Map(latelyAdded || []),
              bannedGroups: new Set(bannedGroups || []),
              listedItems: new Map(listedItems || []),
            }
            : null,
        )
      } catch (error) {
        console.error("Failed to load catalog data from storage:", error)
      }
    },
    [storage, getProfileKey],
  )

  // Save catalog data to storage
  const saveToStorage = useCallback(
    async (catalogData: CatalogData): Promise<void> => {
      try {
        const keys = {
          pinnedGroups: getProfileKey(catalogData.profileId, "pinnedGroups"),
          latelyAdded: getProfileKey(catalogData.profileId, "latelyAdded"),
          bannedGroups: getProfileKey(catalogData.profileId, "bannedGroups"),
          listedItems: getProfileKey(catalogData.profileId, "listedItems"),
        }

        const data = {
          pinnedGroups: catalogData.pinnedGroups.size > 0 ? Array.from(catalogData.pinnedGroups) : undefined,
          latelyAdded: catalogData.latelyAdded.size > 0 ? Array.from(catalogData.latelyAdded) : undefined,
          bannedGroups: catalogData.bannedGroups.size > 0 ? Array.from(catalogData.bannedGroups) : undefined,
          listedItems: catalogData.listedItems.size > 0 ? Array.from(catalogData.listedItems) : undefined,
        }

        await Promise.all([
          data.pinnedGroups
            ? storage.setItem(keys.pinnedGroups, data.pinnedGroups)
            : storage.removeItem(keys.pinnedGroups),
          data.latelyAdded ? storage.setItem(keys.latelyAdded, data.latelyAdded) : storage.removeItem(keys.latelyAdded),
          data.bannedGroups
            ? storage.setItem(keys.bannedGroups, data.bannedGroups)
            : storage.removeItem(keys.bannedGroups),
          data.listedItems ? storage.setItem(keys.listedItems, data.listedItems) : storage.removeItem(keys.listedItems),
        ])
      } catch (error) {
        console.error("Failed to save catalog data to storage:", error)
      }
    },
    [storage, getProfileKey],
  )

  // Fetch M3U content from URL
  const fetchM3UContent = useCallback(async (url: string): Promise<string> => {
    const apiUrl = "/check-m3u/" + encodeURIComponent(url)
    const response = await fetch(apiUrl)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const reader = response.body?.getReader()
    if (!reader) {
      throw new Error("Failed to get response reader")
    }

    let receivedLength = 0
    const contentLength = Number.parseInt(response.headers.get("Content-Length") || "0", 10)
    const chunks: Uint8Array[] = []

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      if (!value) continue

      chunks.push(value)
      receivedLength += value.length
    }

    const chunksAll = new Uint8Array(receivedLength)
    let position = 0
    for (const chunk of chunks) {
      chunksAll.set(chunk, position)
      position += chunk.length
    }

    return new TextDecoder("utf-8").decode(chunksAll)
  }, [])

  // Load catalog
  const loadCatalog = useCallback(
    async (profileId: number, profileUrl: string, forceReload = false): Promise<boolean> => {
      setIsLoading(true)
      try {
        let catalogData = catalog

        if (!catalogData) {
          catalogData = createEmptyCatalog(profileId)
          setCatalog(catalogData)
          await loadFromStorage(profileId)
        }

        if (catalogData.isLoaded && !forceReload) {
          return true
        }

        // Try to load from cache first
        if (!forceReload) {
          const cachedM3U = await storage.getItem<string>(getProfileKey(profileId, "m3u"))
          if (cachedM3U) {
            const parser = new M3UFileParser(cachedM3U)
            const m3uObjects = await parser.loadM3U()
            if (m3uObjects) {
              await addM3UList(m3uObjects)
              return true
            }
          }
        }

        // Download and parse M3U content
        const m3uContent = await fetchM3UContent(profileUrl)
        const parser = new M3UFileParser(m3uContent)
        const m3uObjects = await parser.loadM3U()

        if (m3uObjects) {
          // Save to cache
          await storage.setItem(getProfileKey(profileId, "m3u"), m3uContent)
          await addM3UList(m3uObjects)
          return true
        }

        return false
      } catch (error) {
        console.error("Failed to load catalog:", error)
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [catalog, createEmptyCatalog, loadFromStorage, storage, getProfileKey, fetchM3UContent],
  )

  // Set watchable list
  const setWatchableList = useCallback(
    async (watchable: WatchableObjectData, list: EList): Promise<void> => {
      if (!catalog) return

      if (watchable.listed === list) return

      const updatedCatalog = { ...catalog }

      if (list === EList.NONE) {
        updatedCatalog.listedItems.delete(watchable.url)
      } else {
        updatedCatalog.listedItems.set(watchable.url, list)
      }

      // Update watchable
      watchable.listed = list

      // Update lists
      if (list !== EList.WATCH) {
        updatedCatalog.watchList.watchables = updatedCatalog.watchList.watchables.filter((w) => w.url !== watchable.url)
      }
      if (list !== EList.WATCHED) {
        updatedCatalog.watchedList.watchables = updatedCatalog.watchedList.watchables.filter(
          (w) => w.url !== watchable.url,
        )
      }
      if (list === EList.WATCH) {
        updatedCatalog.watchList.watchables.push(watchable)
      }
      if (list === EList.WATCHED) {
        updatedCatalog.watchedList.watchables.push(watchable)
      }

      setCatalog(updatedCatalog)
      await saveToStorage(updatedCatalog)
    },
    [catalog, saveToStorage],
  )

  // Add M3U list
  const addM3UList = useCallback(
    async (list: M3UObjectData[]): Promise<void> => {
      if (!catalog) return

      const updatedCatalog = { ...catalog }

      if (list.length > 0) {
        updatedCatalog.isLoaded = true
      }

      // Process M3U objects and add to appropriate lists
      for (const m3uObject of list) {
        // Convert M3UObjectData to WatchableObjectData
        const watchable: WatchableObjectData = {
          name: m3uObject.name,
          url: m3uObject.url,
          logo: m3uObject.logo,
          logoPercent: 0,
          isSticky: false,
          addedDate: new Date(),
          titleIcon: "film",
          title: "Movie",
          group: m3uObject.group,
          possibleLiveStream: null,
          listed: EList.NONE,
          listIcon: "",
          dateDiff: "0 days ago",
          isHot: true,
        }

        // Determine type and add to appropriate list
        if (m3uObject.type === "livestream") {
          updatedCatalog.liveStreamList.watchables.push(watchable)
        } else if (m3uObject.type === "tvshow") {
          updatedCatalog.tvShowList.watchables.push(watchable)
        } else {
          updatedCatalog.movieList.watchables.push(watchable)
        }

        updatedCatalog.recentlyAdded.watchables.push(watchable)
      }

      // Update counts
      updatedCatalog.totalCount =
        updatedCatalog.movieList.watchables.length +
        updatedCatalog.tvShowList.watchables.length +
        updatedCatalog.liveStreamList.watchables.length

      setCatalog(updatedCatalog)
      await saveToStorage(updatedCatalog)
    },
    [catalog, saveToStorage],
  )

  // Find watchable by URL
  const findByUrl = useCallback(
    (url: string): WatchableObjectData | undefined => {
      if (!catalog) return undefined

      const searchInGroup = (group: GroupObjectData): WatchableObjectData | undefined => {
        const found = group.watchables.find((w) => w.url === url)
        if (found) return found

        for (const subGroup of group.groups) {
          const result = searchInGroup(subGroup)
          if (result) return result
        }
        return undefined
      }

      return searchInGroup(catalog)
    },
    [catalog],
  )

  // Start search
  const startSearch = useCallback(
    async (text: string): Promise<GroupObjectData | null> => {
      if (!catalog) return null

      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      abortControllerRef.current = new AbortController()
      const abortController = abortControllerRef.current

      return new Promise((resolve) => {
        const parts = text
          .toLowerCase()
          .split(" ")
          .map((x) => x.trim())
        const results: GroupObjectData = {
          name: "Search Results",
          logo: "",
          logoPercent: 0,
          isSticky: false,
          titleIcon: "search",
          title: "Search",
          watchables: [],
          groups: [],
          getListIcon: "search",
          totalCount: 0,
          liveStreamCount: 0,
          tvShowSeasonCount: 0,
          tvShowEpisodeCount: 0,
          movieCount: 0,
          tvShowCount: 0,
          localCount: 0,
        }

        const searchInGroup = (group: GroupObjectData) => {
          if (abortController.signal.aborted) return

          for (const watchable of group.watchables) {
            if (abortController.signal.aborted) return
            if (parts.every((part) => watchable.name.toLowerCase().includes(part))) {
              results.watchables.push(watchable)
            }
          }

          for (const subGroup of group.groups) {
            if (abortController.signal.aborted) return
            searchInGroup(subGroup)
          }
        }

        searchInGroup(catalog)
        resolve(abortController.signal.aborted ? null : results)
      })
    },
    [catalog],
  )

  // Clear catalog
  const clearCatalog = useCallback(() => {
    setCatalog(null)
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
  }, [])

  return {
    catalog,
    isLoading,
    loadCatalog,
    setWatchableList,
    addM3UList,
    findByUrl,
    startSearch,
    clearCatalog,
  }
}

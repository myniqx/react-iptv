// Profile veri tipi
export interface ProfileData {
  id: number
  name: string
  url: string
  createdDate: number
  updatedDate: number
  groupCount: number
  totalCount: number
  tvShowSeasonCount: number
  tvShowEpisodeCount: number
  liveStreamCount: number
  movieCount: number
  tvShowCount: number
}

// M3U Object veri tipi
export interface M3UObjectData {
  id: number
  name: string
  url: string
  logo: string
  group: string
  type: string
  language: string
  country: string
  tvgId: string
  tvgName: string
  tvgLogo: string
  tvgShift: string
  radioFlag: boolean
  attributes: Record<string, string>
}

// Catalog veri tipi
export interface CatalogData {
  id: number
  name: string
  groups: GroupObjectData[]
  totalCount: number
  groupCount: number
  movieCount: number
  tvShowCount: number
  liveStreamCount: number
}

// Group Object veri tipi
export interface GroupObjectData {
  id: number
  name: string
  type: "group" | "movie" | "tvshow" | "livestream"
  children: GroupObjectData[]
  watchables: WatchableObjectData[]
  parent?: GroupObjectData
}

// Watchable Object veri tipi
export interface WatchableObjectData {
  id: number
  name: string
  url: string
  logo: string
  type: "movie" | "tvshow" | "livestream"
  group: string
  language: string
  country: string
  attributes: Record<string, string>
}

// Storage key types
export type StorageKey = string
export type StorageValue = any

// Storage interface
export interface DataStorage {
  getItem<T = any>(key: StorageKey): Promise<T | null>
  setItem<T = any>(key: StorageKey, value: T): Promise<void>
  removeItem(key: StorageKey): Promise<void>
  clear(): Promise<void>
  getAllKeys(): Promise<StorageKey[]>
  exists(key: StorageKey): Promise<boolean>
}

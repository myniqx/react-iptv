"use client"

import { useLocalStorage } from "./useLocalStorage"
import { useIndexedDBStorage } from "./useIndexedDBStorage"
import type { DataStorage } from "@/lib/types"

type StorageType = "localStorage" | "indexedDB"

export function useDataStorage(type: StorageType = "localStorage"): DataStorage {
  const localStorage = useLocalStorage()
  const indexedDBStorage = useIndexedDBStorage()

  switch (type) {
    case "indexedDB":
      return indexedDBStorage
    case "localStorage":
    default:
      return localStorage
  }
}

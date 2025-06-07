"use client"

import { useCallback } from "react"
import type { DataStorage, StorageKey } from "@/lib/types"

const DB_NAME = "IptvStorage"
const DB_VERSION = 1
const STORE_NAME = "data"

export function useIndexedDBStorage(): DataStorage {
  const openDB = useCallback((): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      if (typeof window === "undefined") {
        reject(new Error("IndexedDB not available"))
        return
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME)
        }
      }
    })
  }, [])

  const getItem = useCallback(
    async <T = any>(key: StorageKey): Promise<T | null> => {
      try {
        const db = await openDB()
        const transaction = db.transaction([STORE_NAME], "readonly")
        const store = transaction.objectStore(STORE_NAME)
        const request = store.get(key)

        return new Promise((resolve, reject) => {
          request.onerror = () => reject(request.error)
          request.onsuccess = () => resolve(request.result || null)
        })
      } catch (error) {
        console.error(`Error getting item ${key} from IndexedDB:`, error)
        return null
      }
    },
    [openDB],
  )

  const setItem = useCallback(
    async <T = any>(key: StorageKey, value: T): Promise<void> => {
      try {
        const db = await openDB()
        const transaction = db.transaction([STORE_NAME], "readwrite")
        const store = transaction.objectStore(STORE_NAME)
        const request = store.put(value, key)

        return new Promise((resolve, reject) => {
          request.onerror = () => reject(request.error)
          request.onsuccess = () => resolve()
        })
      } catch (error) {
        console.error(`Error setting item ${key} to IndexedDB:`, error)
        throw error
      }
    },
    [openDB],
  )

  const removeItem = useCallback(
    async (key: StorageKey): Promise<void> => {
      try {
        const db = await openDB()
        const transaction = db.transaction([STORE_NAME], "readwrite")
        const store = transaction.objectStore(STORE_NAME)
        const request = store.delete(key)

        return new Promise((resolve, reject) => {
          request.onerror = () => reject(request.error)
          request.onsuccess = () => resolve()
        })
      } catch (error) {
        console.error(`Error removing item ${key} from IndexedDB:`, error)
        throw error
      }
    },
    [openDB],
  )

  const clear = useCallback(async (): Promise<void> => {
    try {
      const db = await openDB()
      const transaction = db.transaction([STORE_NAME], "readwrite")
      const store = transaction.objectStore(STORE_NAME)
      const request = store.clear()

      return new Promise((resolve, reject) => {
        request.onerror = () => reject(request.error)
        request.onsuccess = () => resolve()
      })
    } catch (error) {
      console.error("Error clearing IndexedDB:", error)
      throw error
    }
  }, [openDB])

  const getAllKeys = useCallback(async (): Promise<StorageKey[]> => {
    try {
      const db = await openDB()
      const transaction = db.transaction([STORE_NAME], "readonly")
      const store = transaction.objectStore(STORE_NAME)
      const request = store.getAllKeys()

      return new Promise((resolve, reject) => {
        request.onerror = () => reject(request.error)
        request.onsuccess = () => resolve(request.result as StorageKey[])
      })
    } catch (error) {
      console.error("Error getting all keys from IndexedDB:", error)
      return []
    }
  }, [openDB])

  const exists = useCallback(
    async (key: StorageKey): Promise<boolean> => {
      try {
        const db = await openDB()
        const transaction = db.transaction([STORE_NAME], "readonly")
        const store = transaction.objectStore(STORE_NAME)
        const request = store.count(key)

        return new Promise((resolve, reject) => {
          request.onerror = () => reject(request.error)
          request.onsuccess = () => resolve(request.result > 0)
        })
      } catch (error) {
        console.error(`Error checking if ${key} exists in IndexedDB:`, error)
        return false
      }
    },
    [openDB],
  )

  return {
    getItem,
    setItem,
    removeItem,
    clear,
    getAllKeys,
    exists,
  }
}

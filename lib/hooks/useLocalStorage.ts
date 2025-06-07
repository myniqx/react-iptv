"use client"

import { useCallback } from "react"
import type { DataStorage, StorageKey } from "@/lib/types"

export function useLocalStorage(): DataStorage {
  const getItem = useCallback(async <T = any>(key: StorageKey): Promise<T | null> => {
    try {
      if (typeof window === "undefined") return null
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error(`Error getting item ${key} from localStorage:`, error)
      return null
    }
  }, [])

  const setItem = useCallback(async <T = any>(key: StorageKey, value: T): Promise<void> => {
    try {
      if (typeof window === "undefined") return
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Error setting item ${key} to localStorage:`, error)
      throw error
    }
  }, [])

  const removeItem = useCallback(async (key: StorageKey): Promise<void> => {
    try {
      if (typeof window === "undefined") return
      localStorage.removeItem(key)
    } catch (error) {
      console.error(`Error removing item ${key} from localStorage:`, error)
      throw error
    }
  }, [])

  const clear = useCallback(async (): Promise<void> => {
    try {
      if (typeof window === "undefined") return
      localStorage.clear()
    } catch (error) {
      console.error("Error clearing localStorage:", error)
      throw error
    }
  }, [])

  const getAllKeys = useCallback(async (): Promise<StorageKey[]> => {
    try {
      if (typeof window === "undefined") return []
      return Object.keys(localStorage)
    } catch (error) {
      console.error("Error getting all keys from localStorage:", error)
      return []
    }
  }, [])

  const exists = useCallback(async (key: StorageKey): Promise<boolean> => {
    try {
      if (typeof window === "undefined") return false
      return localStorage.getItem(key) !== null
    } catch (error) {
      console.error(`Error checking if ${key} exists in localStorage:`, error)
      return false
    }
  }, [])

  return {
    getItem,
    setItem,
    removeItem,
    clear,
    getAllKeys,
    exists,
  }
}

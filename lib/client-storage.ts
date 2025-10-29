/**
 * Client-side storage utilities
 * Manages localStorage for user data persistence
 */

export interface StoredUserData {
  inventory: any[]
  cards: any[]
  collectedSpawnIds: string[]
}

const STORAGE_KEY = 'qora_user_data'

/**
 * Load user data from localStorage
 */
export function loadUserData(userId: string): StoredUserData {
  if (typeof window === 'undefined') {
    return { inventory: [], cards: [], collectedSpawnIds: [] }
  }

  try {
    const stored = localStorage.getItem(`${STORAGE_KEY}_${userId}`)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (e) {
    console.error('Failed to load user data:', e)
  }

  return { inventory: [], cards: [], collectedSpawnIds: [] }
}

/**
 * Save user data to localStorage
 */
export function saveUserData(userId: string, data: StoredUserData): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(`${STORAGE_KEY}_${userId}`, JSON.stringify(data))
  } catch (e) {
    console.error('Failed to save user data:', e)
  }
}

/**
 * Add collected spawn ID
 */
export function addCollectedSpawnId(userId: string, spawnId: string): void {
  const data = loadUserData(userId)
  if (!data.collectedSpawnIds.includes(spawnId)) {
    data.collectedSpawnIds.push(spawnId)
    saveUserData(userId, data)
  }
}

/**
 * Check if spawn is collected
 */
export function isSpawnCollected(userId: string, spawnId: string): boolean {
  const data = loadUserData(userId)
  return data.collectedSpawnIds.includes(spawnId)
}

/**
 * Get all collected spawn IDs
 */
export function getCollectedSpawnIds(userId: string): string[] {
  const data = loadUserData(userId)
  return data.collectedSpawnIds
}

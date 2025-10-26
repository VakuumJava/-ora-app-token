// Fragment types for card assembly
export type FragmentType = "A" | "B" | "C"

export type Rarity = "common" | "rare" | "epic" | "legendary"

export interface Collection {
  id: string
  name: string
  description: string
  totalCards: number
  image: string
  active: boolean
}

export interface Card {
  id: string
  collectionId: string
  name: string
  description: string
  rarity: Rarity
  image: string
  totalSupply: number
  minted: number
}

export interface Fragment {
  id: string
  cardId: string
  type: FragmentType // A, B, or C
  name: string
  image: string
  spawnPointId: string
}

export interface SpawnPoint {
  id: string
  fragmentId: string
  latitude: number
  longitude: number
  radius: number // default 5m
  active: boolean
  collectedBy: string[] // user IDs who collected this
}

export interface UserFragment {
  id: string
  userId: string
  fragmentId: string
  cardId: string
  type: FragmentType
  collectedAt: Date
  used: boolean // true if assembled into card
}

export interface UserCard {
  id: string
  userId: string
  cardId: string
  assembledAt: Date
  listedForSale: boolean
}

export interface CheckInResult {
  success: boolean
  fragment?: Fragment
  error?: string
  distance?: number
  accuracy?: number
}

export interface MarketListing {
  id: string
  userCardId: string
  sellerId: string
  price: number
  currency: "SHD" | "GEM"
  createdAt: Date
  active: boolean
}

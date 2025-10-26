// Admin types for the admin panel

export type AdminRole = 'owner' | 'manager'

export interface AdminUser {
  id: string
  user_id: string
  role: AdminRole
  created_at: string
  created_by?: string
}

export interface Collection {
  id: string
  name: string
  description?: string
  cover_url?: string
  chain: string
  royalty_pct: number
  active: boolean
  created_at: string
  created_by?: string
}

export interface Card {
  id: string
  collection_id: string
  name: string
  description?: string
  supply_cap: number
  minted_count: number
  image_url?: string
  rarity: string
  active: boolean
  created_at: string
}

export interface Shard {
  id: string
  card_id: string
  shard_index: 1 | 2 | 3
  name?: string
  image_url: string
  icon_url?: string
  created_at: string
}

export interface SpawnPoint {
  id: string
  shard_id: string
  lat: number
  lng: number
  qty_total: number
  qty_left: number
  starts_at: string
  ends_at?: string
  active: boolean
  radius_m: number
  hold_seconds: number
  created_at: string
  created_by?: string
}

export interface Drop {
  id: string
  name: string
  description?: string
  starts_at: string
  ends_at: string
  active: boolean
  created_at: string
  created_by?: string
  spawn_points?: SpawnPoint[]
}

export interface UserShard {
  id: string
  user_id: string
  shard_id: string
  obtained_at: string
  spawn_point_id?: string
  used: boolean
}

export interface UserCard {
  id: string
  user_id: string
  card_id: string
  token_id?: string
  minted_tx?: string
  minted_at?: string
  assembled_at: string
}

export type ListingStatus = 'active' | 'sold' | 'cancelled' | 'banned'

export interface Listing {
  id: string
  user_id: string
  card_id: string
  user_card_id: string
  price_wei: string
  status: ListingStatus
  created_at: string
  sold_at?: string
  banned_at?: string
  banned_by?: string
}

export interface Setting {
  key: string
  value: string
  description?: string
  updated_at: string
  updated_by?: string
}

export interface Web3Config {
  id: string
  chain: string
  rpc_url: string
  contract_address: string
  abi?: string
  mint_function: string
  active: boolean
  created_at: string
  updated_at: string
}

export interface AuditLog {
  id: string
  actor_id?: string
  action: string
  entity: string
  entity_id?: string
  before?: any
  after?: any
  ts: string
}

export interface DashboardStats {
  today_checkins: number
  today_cards_collected: number
  active_listings: number
  today_deals: number
}

export interface UserSearchResult {
  id: string
  email?: string
  nickname?: string
  wallet?: string
  created_at: string
}

export interface SpawnPointCSVRow {
  lat: number
  lng: number
  count: number
  from?: string
  to?: string
}

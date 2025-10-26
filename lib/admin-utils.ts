import { createClient } from '@/lib/supabase/server'
import type { AdminRole, AuditLog } from './admin-types'

/**
 * Проверка прав администратора
 */
export async function checkAdminRole(requiredRole?: AdminRole): Promise<{ authorized: boolean; role?: AdminRole }> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { authorized: false }
  }

  const { data: adminRole } = await supabase
    .from('admin_roles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (!adminRole) {
    return { authorized: false }
  }

  // Owner имеет доступ ко всему
  if (adminRole.role === 'owner') {
    return { authorized: true, role: 'owner' }
  }

  // Если требуется конкретная роль
  if (requiredRole && adminRole.role !== requiredRole) {
    return { authorized: false, role: adminRole.role as AdminRole }
  }

  return { authorized: true, role: adminRole.role as AdminRole }
}

/**
 * Логирование действий администратора
 */
export async function logAdminAction(params: {
  action: string
  entity: string
  entity_id?: string
  before?: any
  after?: any
}): Promise<void> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return

  await supabase.from('audit_log').insert({
    actor_id: user.id,
    action: params.action,
    entity: params.entity,
    entity_id: params.entity_id,
    before: params.before,
    after: params.after,
  })
}

/**
 * Получение настройки системы
 */
export async function getSetting(key: string): Promise<string | null> {
  const supabase = await createClient()
  
  const { data } = await supabase
    .from('settings')
    .select('value')
    .eq('key', key)
    .single()

  return data?.value || null
}

/**
 * Обновление настройки системы
 */
export async function updateSetting(key: string, value: string): Promise<boolean> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return false

  // Получаем старое значение для аудита
  const oldValue = await getSetting(key)

  const { error } = await supabase
    .from('settings')
    .upsert({
      key,
      value,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    })

  if (!error) {
    await logAdminAction({
      action: 'update_setting',
      entity: 'settings',
      entity_id: key,
      before: { value: oldValue },
      after: { value },
    })
  }

  return !error
}

/**
 * Проверка лимита сбора осколков (1 шт одного типа в минуту)
 */
export async function checkShardCollectionLimit(
  userId: string,
  shardId: string
): Promise<{ allowed: boolean; message?: string }> {
  const supabase = await createClient()

  const oneMinuteAgo = new Date(Date.now() - 60 * 1000).toISOString()

  const { data, error } = await supabase
    .from('user_shards')
    .select('id')
    .eq('user_id', userId)
    .eq('shard_id', shardId)
    .gte('obtained_at', oneMinuteAgo)

  if (error) {
    return { allowed: false, message: 'Ошибка проверки лимита' }
  }

  if (data && data.length > 0) {
    return { allowed: false, message: 'Вы уже собрали этот осколок в последнюю минуту' }
  }

  return { allowed: true }
}

/**
 * Проверка возможности сборки карточки (3 осколка)
 */
export async function checkCardAssembly(
  userId: string,
  cardId: string
): Promise<{ canAssemble: boolean; shardIds?: string[] }> {
  const supabase = await createClient()

  // Получаем все неиспользованные осколки пользователя для этой карточки
  const { data: shards } = await supabase
    .from('shards')
    .select('id, shard_index')
    .eq('card_id', cardId)

  if (!shards || shards.length !== 3) {
    return { canAssemble: false }
  }

  const shardIds = shards.map((s: { id: string }) => s.id)

  const { data: userShards } = await supabase
    .from('user_shards')
    .select('shard_id')
    .eq('user_id', userId)
    .eq('used', false)
    .in('shard_id', shardIds)

  if (!userShards || userShards.length !== 3) {
    return { canAssemble: false }
  }

  return { canAssemble: true, shardIds: userShards.map((s: { shard_id: string }) => s.shard_id) }
}

/**
 * Сборка карточки из 3 осколков
 */
export async function assembleCard(
  userId: string,
  cardId: string
): Promise<{ success: boolean; userCardId?: string; error?: string }> {
  const supabase = await createClient()

  // Проверяем возможность сборки
  const { canAssemble, shardIds } = await checkCardAssembly(userId, cardId)

  if (!canAssemble) {
    return { success: false, error: 'Недостаточно осколков для сборки карточки' }
  }

  // Создаем карточку пользователя
  const { data: userCard, error: cardError } = await supabase
    .from('user_cards')
    .insert({
      user_id: userId,
      card_id: cardId,
      assembled_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (cardError || !userCard) {
    return { success: false, error: 'Ошибка создания карточки' }
  }

  // Отмечаем осколки как использованные
  await supabase
    .from('user_shards')
    .update({ used: true })
    .eq('user_id', userId)
    .in('shard_id', shardIds!)

  // Увеличиваем счетчик минтов
  await supabase.rpc('increment_minted_count', { card_id: cardId })

  await logAdminAction({
    action: 'assemble_card',
    entity: 'user_cards',
    entity_id: userCard.id,
    after: { card_id: cardId, user_id: userId },
  })

  return { success: true, userCardId: userCard.id }
}

/**
 * Расчет расстояния между двумя точками (формула Haversine)
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3 // Радиус Земли в метрах
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lon2 - lon1) * Math.PI) / 180

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}

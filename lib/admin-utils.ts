import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this'

export type AdminRole = 'owner' | 'manager'

/**
 * Проверка прав администратора
 */
export async function checkAdminRole(requiredRole?: AdminRole): Promise<{ authorized: boolean; role?: AdminRole; userId?: string }> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('access_token')?.value
    
    if (!token) {
      return { authorized: false }
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    
    const adminRole = await prisma.adminRole.findUnique({
      where: { userId: decoded.userId },
      select: { role: true }
    })

    if (!adminRole) {
      return { authorized: false }
    }

    // Owner имеет доступ ко всему
    if (adminRole.role === 'owner') {
      return { authorized: true, role: 'owner', userId: decoded.userId }
    }

    // Если требуется конкретная роль
    if (requiredRole && adminRole.role !== requiredRole) {
      return { authorized: false, role: adminRole.role as AdminRole, userId: decoded.userId }
    }

    return { authorized: true, role: adminRole.role as AdminRole, userId: decoded.userId }
  } catch (error) {
    return { authorized: false }
  }
}

/**
 * Логирование действий администратора
 */
export async function logAdminAction(params: {
  action: string
  entity: string
  entityId?: string
  before?: any
  after?: any
}): Promise<void> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('access_token')?.value
    
    if (!token) return

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }

    await prisma.auditLog.create({
      data: {
        adminId: decoded.userId,
        action: params.action,
        entity: params.entity,
        entityId: params.entityId,
        before: params.before ? JSON.stringify(params.before) : null,
        after: params.after ? JSON.stringify(params.after) : null,
      }
    })
  } catch (error) {
    console.error('Error logging admin action:', error)
  }
}

/**
 * Получение настройки системы
 */
export async function getSetting(key: string): Promise<string | null> {
  const setting = await prisma.setting.findUnique({
    where: { key }
  })

  return setting?.value || null
}

/**
 * Обновление настройки системы
 */
export async function updateSetting(key: string, value: string): Promise<boolean> {
  try {
    const oldValue = await getSetting(key)

    await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value }
    })

    await logAdminAction({
      action: 'update_setting',
      entity: 'settings',
      entityId: key,
      before: { value: oldValue },
      after: { value },
    })

    return true
  } catch (error) {
    return false
  }
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
  const R = 6371e3 // метры
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

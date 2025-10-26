import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this'

export type AdminRole = 'owner' | 'manager'

/**
 * Получить ID текущего пользователя из JWT токена
 */
async function getCurrentUserId(): Promise<string | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('access_token')?.value
    
    if (!token) {
      return null
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    return decoded.userId
  } catch (error) {
    return null
  }
}

/**
 * Проверка прав администратора
 */
export async function checkAdminRole(requiredRole?: AdminRole): Promise<{ 
  authorized: boolean
  role?: AdminRole
  adminId?: string 
}> {
  const userId = await getCurrentUserId()
  
  if (!userId) {
    return { authorized: false }
  }

  const adminRole = await prisma.adminRole.findUnique({
    where: { userId }
  })

  if (!adminRole) {
    return { authorized: false }
  }

  // Owner имеет доступ ко всему
  if (adminRole.role === 'owner') {
    return { authorized: true, role: 'owner', adminId: userId }
  }

  // Если требуется конкретная роль
  if (requiredRole && adminRole.role !== requiredRole) {
    return { authorized: false, role: adminRole.role as AdminRole, adminId: userId }
  }

  return { authorized: true, role: adminRole.role as AdminRole, adminId: userId }
}

/**
 * Логирование действий администратора
 */
export async function logAdminAction(
  adminId: string,
  params: {
    action: string
    entity: string
    entity_id?: string
    before?: any
    after?: any
  }
): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        adminId,
        action: params.action,
        entity: params.entity,
        entityId: params.entity_id,
        before: params.before ? JSON.stringify(params.before) : null,
        after: params.after ? JSON.stringify(params.after) : null,
      }
    })
  } catch (error) {
    console.error('Failed to log admin action:', error)
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
  const adminId = await getCurrentUserId()
  
  if (!adminId) return false

  try {
    // Получаем старое значение для аудита
    const oldValue = await getSetting(key)

    await prisma.setting.upsert({
      where: { key },
      create: { key, value },
      update: { value }
    })

    await logAdminAction(adminId, {
      action: 'update_setting',
      entity: 'settings',
      entity_id: key,
      before: { value: oldValue },
      after: { value },
    })

    return true
  } catch (error) {
    console.error('Failed to update setting:', error)
    return false
  }
}

/**
 * Получение всех настроек
 */
export async function getAllSettings(): Promise<Record<string, string>> {
  const settings = await prisma.setting.findMany()
  
  return settings.reduce((acc, setting) => {
    acc[setting.key] = setting.value
    return acc
  }, {} as Record<string, string>)
}

/**
 * Проверка, является ли пользователь админом
 */
export async function isAdmin(userId: string): Promise<boolean> {
  const adminRole = await prisma.adminRole.findUnique({
    where: { userId }
  })
  
  return !!adminRole
}

/**
 * Добавление роли админа пользователю
 */
export async function grantAdminRole(
  targetUserId: string,
  role: AdminRole = 'manager'
): Promise<boolean> {
  const adminId = await getCurrentUserId()
  
  if (!adminId) return false

  const { authorized, role: currentRole } = await checkAdminRole()
  
  // Только owner может назначать админов
  if (!authorized || currentRole !== 'owner') {
    return false
  }

  try {
    await prisma.adminRole.create({
      data: {
        userId: targetUserId,
        role
      }
    })

    await logAdminAction(adminId, {
      action: 'grant_admin_role',
      entity: 'admin_roles',
      entity_id: targetUserId,
      after: { role },
    })

    return true
  } catch (error) {
    console.error('Failed to grant admin role:', error)
    return false
  }
}

/**
 * Удаление роли админа у пользователя
 */
export async function revokeAdminRole(targetUserId: string): Promise<boolean> {
  const adminId = await getCurrentUserId()
  
  if (!adminId) return false

  const { authorized, role: currentRole } = await checkAdminRole()
  
  // Только owner может удалять админов
  if (!authorized || currentRole !== 'owner') {
    return false
  }

  try {
    const adminRole = await prisma.adminRole.findUnique({
      where: { userId: targetUserId }
    })

    if (!adminRole) return false

    await prisma.adminRole.delete({
      where: { userId: targetUserId }
    })

    await logAdminAction(adminId, {
      action: 'revoke_admin_role',
      entity: 'admin_roles',
      entity_id: targetUserId,
      before: { role: adminRole.role },
    })

    return true
  } catch (error) {
    console.error('Failed to revoke admin role:', error)
    return false
  }
}

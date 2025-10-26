import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-change-this'
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'default-refresh-secret-change-this'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m'
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d'

export interface JWTPayload {
  userId: string
  email: string
  nickname: string
}

/**
 * Генерация access token
 */
export function generateAccessToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as jwt.SignOptions)
}

/**
 * Генерация refresh token
 */
export function generateRefreshToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
  } as jwt.SignOptions)
}

/**
 * Верификация access token
 */
export function verifyAccessToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch (error) {
    console.error('Access token verification failed:', error)
    return null
  }
}

/**
 * Верификация refresh token
 */
export function verifyRefreshToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET) as JWTPayload
  } catch (error) {
    console.error('Refresh token verification failed:', error)
    return null
  }
}

/**
 * Получить пользователя из cookie (server-side)
 */
export async function getUserFromCookies(): Promise<JWTPayload | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('access_token')?.value

    if (!token) {
      return null
    }

    return verifyAccessToken(token)
  } catch (error) {
    console.error('Error getting user from cookies:', error)
    return null
  }
}

/**
 * Получить текущего пользователя (для API routes)
 */
export async function getCurrentUser(): Promise<JWTPayload | null> {
  return getUserFromCookies()
}

/**
 * Проверка авторизации (для middleware)
 */
export async function requireAuth(): Promise<JWTPayload> {
  const user = await getUserFromCookies()
  
  if (!user) {
    throw new Error('Unauthorized')
  }
  
  return user
}

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { isTokenExpired } from '@/lib/email'
import { generateAccessToken, generateRefreshToken } from '@/lib/jwt'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get('token')

    if (!token) {
      
      const redirectUrl = getRedirectUrl(request, '/login?error=invalid_token')
      return NextResponse.redirect(redirectUrl)
    }

    // Поиск пользователя по токену
    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token,
      },
    })

    if (!user) {
      
      const redirectUrl = getRedirectUrl(request, '/login?error=invalid_token')
      return NextResponse.redirect(redirectUrl)
    }

    

    // Проверка истечения токена
    if (user.verificationTokenExpiry && isTokenExpired(user.verificationTokenExpiry)) {
      
      const redirectUrl = getRedirectUrl(request, '/login?error=token_expired')
      return NextResponse.redirect(redirectUrl)
    }

    // Подтверждение email
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationToken: null,
        verificationTokenExpiry: null,
      },
    })

    

    // Генерируем JWT токены для автоматического входа
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      nickname: user.nickname,
    })

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
      nickname: user.nickname,
    })

    

    // Создаем ответ с редиректом
    const redirectUrl = getRedirectUrl(request, '/?email_verified=true')
    const response = NextResponse.redirect(redirectUrl)

    // Устанавливаем cookies с токенами
    response.cookies.set('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 15, // 15 минут
      path: '/',
    })

    response.cookies.set('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 дней
      path: '/',
    })

    

    return response
  } catch (error) {
    console.error('❌ Email verification error:', error)
    const redirectUrl = getRedirectUrl(request, '/login?error=verification_failed')
    return NextResponse.redirect(redirectUrl)
  }
}

/**
 * Получает правильный URL для редиректа с учетом окружения
 */
function getRedirectUrl(request: NextRequest, path: string): URL {
  // Используем заголовки для определения правильного хоста
  const host = request.headers.get('host')
  const protocol = request.headers.get('x-forwarded-proto') || 
                  (host?.includes('localhost') ? 'http' : 'https')
  
  // Если есть APP_URL в переменных окружения - используем его
  const baseUrl = process.env.APP_URL || 
                  process.env.NEXT_PUBLIC_APP_URL || 
                  `${protocol}://${host}`
  
  
  
  return new URL(path, baseUrl)
}

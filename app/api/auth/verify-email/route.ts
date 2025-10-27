import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { isTokenExpired } from '@/lib/email'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get('token')

    console.log('🔍 Email verification attempt:', { 
      token: token ? `${token.substring(0, 10)}...` : 'missing',
      url: request.url 
    })

    if (!token) {
      console.log('❌ No token provided')
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
      console.log('❌ User not found for token')
      const redirectUrl = getRedirectUrl(request, '/login?error=invalid_token')
      return NextResponse.redirect(redirectUrl)
    }

    console.log('✅ User found:', { userId: user.id, email: user.email })

    // Проверка истечения токена
    if (user.verificationTokenExpiry && isTokenExpired(user.verificationTokenExpiry)) {
      console.log('❌ Token expired:', user.verificationTokenExpiry)
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

    console.log('✅ Email verified successfully for user:', user.email)

    // Редирект на главную страницу с уведомлением об успехе
    const redirectUrl = getRedirectUrl(request, '/?email_verified=true')
    return NextResponse.redirect(redirectUrl)
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
  
  console.log('🔗 Redirect URL info:', { baseUrl, path, host, protocol })
  
  return new URL(path, baseUrl)
}

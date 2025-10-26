import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { isTokenExpired } from '@/lib/email'

/**
 * GET /api/auth/verify-email?token=xxx
 * Подтверждение email пользователя
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.redirect(new URL('/login?error=invalid_token', request.url))
    }

    // Поиск пользователя по токену
    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token,
      },
    })

    if (!user) {
      return NextResponse.redirect(new URL('/login?error=invalid_token', request.url))
    }

    // Проверка истечения токена
    if (user.verificationTokenExpiry && isTokenExpired(user.verificationTokenExpiry)) {
      return NextResponse.redirect(new URL('/login?error=token_expired', request.url))
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

    // Редирект на главную страницу с уведомлением об успехе
    return NextResponse.redirect(new URL('/?email_verified=true', request.url))
  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.redirect(new URL('/login?error=verification_failed', request.url))
  }
}

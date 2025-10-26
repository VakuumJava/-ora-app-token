import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';
import { verifyRefreshToken, generateAccessToken, generateRefreshToken } from '@/lib/jwt';

/**
 * POST /api/auth/refresh
 * Обновляет access token используя refresh token
 */
export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refresh_token')?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Refresh token not found' },
        { status: 401 }
      );
    }

    // Верифицируем refresh token
    const payload = verifyRefreshToken(refreshToken);
    
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid refresh token' },
        { status: 401 }
      );
    }

    // Проверяем, существует ли сессия в базе
    const session = await prisma.session.findUnique({
      where: { refreshToken },
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 401 }
      );
    }

    // Проверяем, не истек ли refresh token
    if (session.expiresAt < new Date()) {
      // Удаляем истекшую сессию
      await prisma.session.delete({
        where: { id: session.id },
      });

      return NextResponse.json(
        { error: 'Refresh token expired' },
        { status: 401 }
      );
    }

    // Генерируем новый access token
    const newAccessToken = generateAccessToken({
      userId: payload.userId,
      email: payload.email,
      nickname: payload.nickname,
    });

    // Опционально: можно также генерировать новый refresh token (rotation)
    const newRefreshToken = generateRefreshToken({
      userId: payload.userId,
      email: payload.email,
      nickname: payload.nickname,
    });

    // Обновляем сессию с новым refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 дней

    await prisma.session.update({
      where: { id: session.id },
      data: {
        refreshToken: newRefreshToken,
        expiresAt,
      },
    });

    // Устанавливаем новые токены в cookies
    cookieStore.set('access_token', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 15, // 15 минут
    });

    cookieStore.set('refresh_token', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 дней
    });

    return NextResponse.json(
      { 
        message: 'Tokens refreshed successfully',
        accessToken: newAccessToken, // Опционально: можно вернуть токен клиенту
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Refresh token error:', error);
    
    return NextResponse.json(
      { error: 'Failed to refresh token' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';
import { verifyRefreshToken } from '@/lib/jwt';

/**
 * POST /api/auth/logout
 * Удаляет JWT токены из cookies и сессию из базы данных
 */
export async function POST() {
  try {
    const cookieStore = await cookies();
    
    // Получаем refresh token из cookies
    const refreshToken = cookieStore.get('refresh_token')?.value;

    // Если есть refresh token, удаляем сессию из базы
    if (refreshToken) {
      try {
        // Проверяем и декодируем токен
        const payload = verifyRefreshToken(refreshToken);
        
        if (payload) {
          // Удаляем сессию из базы данных
          await prisma.session.deleteMany({
            where: {
              userId: payload.userId,
              refreshToken: refreshToken,
            },
          });
        }
      } catch (error) {
        // Игнорируем ошибки верификации токена при logout
        console.error('Error verifying refresh token during logout:', error);
      }
    }

    // Удаляем cookies
    cookieStore.delete('access_token');
    cookieStore.delete('refresh_token');

    return NextResponse.json(
      { message: 'Logged out successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Logout error:', error);
    
    return NextResponse.json(
      { error: 'Failed to logout' },
      { status: 500 }
    );
  }
}

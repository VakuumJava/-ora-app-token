import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyAccessToken } from '@/lib/jwt'

/**
 * DELETE /api/user/delete-account
 * Удаление аккаунта пользователя (освобождает nickname и email)
 */
export async function DELETE(request: NextRequest) {
  try {
    // Проверяем оба варианта названия cookie (accessToken и access_token)
    const token = request.cookies.get('access_token')?.value || 
                  request.cookies.get('accessToken')?.value

    if (!token) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
    }

    // Проверяем токен
    const payload = verifyAccessToken(token)
    if (!payload) {
      
      return NextResponse.json({ error: 'Невалидный токен' }, { status: 401 })
    }

    const userId = payload.userId

    // Удаляем все связанные данные в транзакции
    await prisma.$transaction(async (tx) => {
      // Удаляем сессии
      await tx.session.deleteMany({
        where: { userId },
      })

      // Удаляем фрагменты пользователя
      await tx.userFragment.deleteMany({
        where: { userId },
      })

      // Удаляем профиль
      await tx.profile.deleteMany({
        where: { userId },
      })

      // Удаляем самого пользователя (освобождает email и nickname)
      await tx.user.delete({
        where: { id: userId },
      })
    })

    // Очищаем cookies (оба варианта названий)
    const response = NextResponse.json(
      { message: 'Аккаунт успешно удалён' },
      { status: 200 }
    )

    response.cookies.delete('access_token')
    response.cookies.delete('refresh_token')
    response.cookies.delete('accessToken')
    response.cookies.delete('refreshToken')

    return response
  } catch (error) {
    console.error('❌ Error deleting account:', error)
    return NextResponse.json(
      { error: 'Ошибка при удалении аккаунта' },
      { status: 500 }
    )
  }
}

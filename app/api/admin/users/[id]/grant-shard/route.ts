import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { checkAdminRole, logAdminAction } from '@/lib/admin-utils'

const prisma = new PrismaClient()

/**
 * POST /api/admin/users/[id]/grant-shard - Выдать осколок пользователю
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { authorized, adminId } = await checkAdminRole()
  
  if (!authorized || !adminId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { shard_id } = body

    if (!shard_id) {
      return NextResponse.json({ error: 'Shard ID is required' }, { status: 400 })
    }

    // Проверяем, существует ли пользователь
    const user = await prisma.user.findUnique({
      where: { id: params.id }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Проверяем, существует ли осколок
    const shard = await prisma.shard.findUnique({
      where: { id: shard_id }
    })

    if (!shard) {
      return NextResponse.json({ error: 'Shard not found' }, { status: 404 })
    }

    // Выдаем осколок пользователю
    const userShard = await prisma.userShard.create({
      data: {
        userId: params.id,
        shardId: shard_id,
      },
      include: {
        shard: {
          include: {
            card: true
          }
        }
      }
    })

    // Обновляем счетчик осколков пользователя
    await prisma.user.update({
      where: { id: params.id },
      data: {
        totalShards: {
          increment: 1
        }
      }
    })

    await logAdminAction(adminId!, {
      action: 'grant_shard',
      entity: 'user_shards',
      entity_id: userShard.id,
      after: { user_id: params.id, shard_id },
    })

    return NextResponse.json(userShard)
  } catch (error) {
    console.error('Error granting shard:', error)
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

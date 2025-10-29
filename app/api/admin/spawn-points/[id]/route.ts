import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * DELETE /api/admin/spawn-points/[id] - Удаление точки спавна
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    
    // Удаляем из БД
    await prisma.spawnPoint.delete({
      where: { id }
    })
    
    console.log('🗑️ Точка спавна удалена:', id)

    return NextResponse.json({ success: true, message: 'Spawn point deleted' })
  } catch (error: any) {
    console.error('Error deleting spawn point:', error)
    
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Spawn point not found' }, { status: 404 })
    }
    
    return NextResponse.json({ error: 'Failed to delete spawn point' }, { status: 500 })
  }
}

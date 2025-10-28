import { NextRequest, NextResponse } from 'next/server'
import { tempSpawnPoints } from '@/lib/spawn-storage'

/**
 * DELETE /api/admin/spawn-points/[id] - Удаление точки спавна
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    const index = tempSpawnPoints.findIndex((sp: any) => sp.id === id)
    
    if (index === -1) {
      return NextResponse.json({ error: 'Spawn point not found' }, { status: 404 })
    }

    tempSpawnPoints.splice(index, 1)
    
    console.log('🗑️ Точка спавна удалена:', id)
    console.log('📍 Осталось точек:', tempSpawnPoints.length)

    return NextResponse.json({ success: true, message: 'Spawn point deleted' })
  } catch (error) {
    console.error('Error deleting spawn point:', error)
    return NextResponse.json({ error: 'Failed to delete spawn point' }, { status: 500 })
  }
}

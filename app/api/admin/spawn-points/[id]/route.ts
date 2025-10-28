import { NextRequest, NextResponse } from 'next/server'import { NextRequest, NextResponse } from 'next/server'import { NextRequest, NextResponse } from 'next/server'

import { tempSpawnPoints } from '@/lib/spawn-storage'

import { createClient } from '@/lib/supabase/server'

/**

 * DELETE /api/admin/spawn-points/[id] - Удаление точки спавна/**import { checkAdminRole, logAdminAction } from '@/lib/admin-utils'

 */

export async function DELETE( * DELETE /api/admin/spawn-points/[id] - Удаление точки спавна

  request: NextRequest,

  { params }: { params: { id: string } } *//**

) {

  try {export async function DELETE( * PATCH /api/admin/spawn-points/[id] - Обновление точки спавна

    const { id } = params

      request: NextRequest, */

    const index = tempSpawnPoints.findIndex((sp: any) => sp.id === id)

      { params }: { params: { id: string } }export async function PATCH(

    if (index === -1) {

      return NextResponse.json({ error: 'Spawn point not found' }, { status: 404 })) {  request: NextRequest,

    }

  try {  { params }: { params: { id: string } }

    tempSpawnPoints.splice(index, 1)

        const { id } = params) {

    console.log('🗑️ Точка спавна удалена:', id)

    console.log('📍 Осталось точек:', tempSpawnPoints.length)  const { authorized, adminId } = await checkAdminRole()



    return NextResponse.json({ success: true, message: 'Spawn point deleted' })    // Импортируем хранилище  

  } catch (error) {

    console.error('Error deleting spawn point:', error)    const module = await import('../route')  if (!authorized || !adminId) {

    return NextResponse.json({ error: 'Failed to delete spawn point' }, { status: 500 })

  }    const storage = module.tempSpawnPoints    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

}

      }

    const index = storage.findIndex((sp: any) => sp.id === id)

      try {

    if (index === -1) {    const body = await request.json()

      return NextResponse.json({ error: 'Spawn point not found' }, { status: 404 })    const { active } = body

    }

    const supabase = await createClient()

    storage.splice(index, 1)

    // Получаем старое значение

    return NextResponse.json({ success: true, message: 'Spawn point deleted' })    const { data: oldData } = await supabase

  } catch (error) {      .from('spawn_points')

    console.error('Error deleting spawn point:', error)      .select('*')

    return NextResponse.json({ error: 'Failed to delete spawn point' }, { status: 500 })      .eq('id', params.id)

  }      .single()

}

    const { data, error } = await supabase
      .from('spawn_points')
      .update({ active })
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    await logAdminAction(adminId, {
      action: 'toggle_spawn_point',
      entity: 'spawn_points',
      entity_id: data.id,
      before: oldData,
      after: data,
    })

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkAdminRole, logAdminAction } from '@/lib/admin-utils'

/**
 * PATCH /api/admin/spawn-points/[id] - Обновление точки спавна
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { authorized, adminId } = await checkAdminRole()
  
  if (!authorized || !adminId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { active } = body

    const supabase = await createClient()

    // Получаем старое значение
    const { data: oldData } = await supabase
      .from('spawn_points')
      .select('*')
      .eq('id', params.id)
      .single()

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

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkAdminRole, logAdminAction } from '@/lib/admin-utils'

/**
 * POST /api/admin/drops - Создание дропа
 */
export async function POST(request: NextRequest) {
  const { authorized } = await checkAdminRole()
  
  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { name, description, starts_at, ends_at, spawn_point_ids } = body

    if (!name || !starts_at || !ends_at) {
      return NextResponse.json(
        { error: 'Name, start and end dates are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data, error } = await supabase
      .from('drops')
      .insert({
        name,
        description,
        starts_at,
        ends_at,
        created_by: user?.id,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Если указаны точки спавна, добавляем их к дропу
    if (spawn_point_ids && Array.isArray(spawn_point_ids) && spawn_point_ids.length > 0) {
      const dropPoints = spawn_point_ids.map((spId: string) => ({
        drop_id: data.id,
        spawn_point_id: spId,
      }))

      await supabase.from('drop_spawn_points').insert(dropPoints)
    }

    await logAdminAction({
      action: 'create_drop',
      entity: 'drops',
      entity_id: data.id,
      after: data,
    })

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

/**
 * GET /api/admin/drops - Получение всех дропов
 */
export async function GET() {
  const { authorized } = await checkAdminRole()
  
  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('drops')
      .select('*, drop_spawn_points(spawn_points(*))')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

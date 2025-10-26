import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkAdminRole, logAdminAction, getSetting } from '@/lib/admin-utils'

/**
 * POST /api/admin/spawn-points/import - Импорт точек из CSV
 */
export async function POST(request: NextRequest) {
  const { authorized } = await checkAdminRole()
  
  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { shard_id, points } = body

    if (!shard_id || !Array.isArray(points) || points.length === 0) {
      return NextResponse.json(
        { error: 'Shard ID and points array are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Получаем дефолтные настройки
    const radiusM = parseInt(await getSetting('radius_m') || '5')
    const holdSeconds = parseInt(await getSetting('hold_seconds') || '3')

    const insertData = points.map((point: any) => ({
      shard_id,
      lat: point.lat,
      lng: point.lng,
      qty_total: point.count || 1,
      qty_left: point.count || 1,
      starts_at: point.from || new Date().toISOString(),
      ends_at: point.to,
      radius_m: radiusM,
      hold_seconds: holdSeconds,
      created_by: user?.id,
    }))

    const { data, error } = await supabase
      .from('spawn_points')
      .insert(insertData)
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    await logAdminAction({
      action: 'import_spawn_points',
      entity: 'spawn_points',
      after: { count: data.length, shard_id },
    })

    return NextResponse.json({ success: true, count: data.length, points: data })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

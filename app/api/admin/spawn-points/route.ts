import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkAdminRole, logAdminAction, getSetting } from '@/lib/admin-utils'

/**
 * POST /api/admin/spawn-points - Создание точки спавна
 */
export async function POST(request: NextRequest) {
  const { authorized, adminId } = await checkAdminRole()
  
  if (!authorized || !adminId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { shard_id, lat, lng, qty_total, starts_at, ends_at } = body

    if (!shard_id || lat === undefined || lng === undefined) {
      return NextResponse.json(
        { error: 'Shard ID, latitude and longitude are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Получаем дефолтные настройки
    const radiusM = parseInt(await getSetting('radius_m') || '5')
    const holdSeconds = parseInt(await getSetting('hold_seconds') || '3')

    const { data, error } = await supabase
      .from('spawn_points')
      .insert({
        shard_id,
        lat,
        lng,
        qty_total: qty_total || 1,
        qty_left: qty_total || 1,
        starts_at: starts_at || new Date().toISOString(),
        ends_at,
        radius_m: radiusM,
        hold_seconds: holdSeconds,
        created_by: user?.id,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    await logAdminAction(adminId, {
      action: 'create_spawn_point',
      entity: 'spawn_points',
      entity_id: data.id,
      after: data,
    })

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

/**
 * GET /api/admin/spawn-points - Получение точек спавна
 */
export async function GET(request: NextRequest) {
  const { authorized, adminId } = await checkAdminRole()
  
  if (!authorized || !adminId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const shardId = searchParams.get('shard_id')
    const active = searchParams.get('active')

    const supabase = await createClient()

    let query = supabase
      .from('spawn_points')
      .select('*, shards(*, cards(name))')
      .order('created_at', { ascending: false })

    if (shardId) {
      query = query.eq('shard_id', shardId)
    }

    if (active !== null) {
      query = query.eq('active', active === 'true')
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

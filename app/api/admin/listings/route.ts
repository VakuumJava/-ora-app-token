import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkAdminRole, updateSetting } from '@/lib/admin-utils'

/**
 * GET /api/admin/listings - Получение листингов
 */
export async function GET(request: NextRequest) {
  const { authorized } = await checkAdminRole()
  
  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const supabase = await createClient()

    let query = supabase
      .from('listings')
      .select('*, user_cards(*, cards(name)), users:user_id(*)')
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
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

/**
 * PATCH /api/admin/listings - Обновление настроек маркетплейса
 */
export async function PATCH(request: NextRequest) {
  const { authorized, role } = await checkAdminRole()
  
  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { platform_fee_pct, min_price_floor } = body

    if (platform_fee_pct !== undefined) {
      await updateSetting('platform_fee_pct', platform_fee_pct.toString())
    }

    if (min_price_floor !== undefined) {
      await updateSetting('min_price_floor', min_price_floor.toString())
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

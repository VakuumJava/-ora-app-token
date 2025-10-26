import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkAdminRole } from '@/lib/admin-utils'

/**
 * GET /api/admin/dashboard - Получение статистики дашборда
 */
export async function GET() {
  const { authorized, adminId } = await checkAdminRole()
  
  if (!authorized || !adminId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = await createClient()
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Чек-ины сегодня
    const { count: todayCheckins } = await supabase
      .from('user_shards')
      .select('*', { count: 'exact', head: true })
      .gte('obtained_at', today.toISOString())

    // Собранные карточки сегодня
    const { count: todayCards } = await supabase
      .from('user_cards')
      .select('*', { count: 'exact', head: true })
      .gte('assembled_at', today.toISOString())

    // Активные листинги
    const { count: activeListings } = await supabase
      .from('listings')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')

    // Сделки сегодня
    const { count: todayDeals } = await supabase
      .from('listings')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'sold')
      .gte('sold_at', today.toISOString())

    // Активные точки спавна для карты
    const { data: spawnPoints } = await supabase
      .from('spawn_points')
      .select('id, lat, lng, qty_left, shards(card_id, cards(name))')
      .eq('active', true)
      .gt('qty_left', 0)
      .limit(100)

    return NextResponse.json({
      stats: {
        today_checkins: todayCheckins || 0,
        today_cards_collected: todayCards || 0,
        active_listings: activeListings || 0,
        today_deals: todayDeals || 0,
      },
      spawn_points: spawnPoints || [],
    })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkAdminRole } from '@/lib/admin-utils'

/**
 * GET /api/admin/users - Поиск пользователей
 */
export async function GET(request: NextRequest) {
  const { authorized, adminId } = await checkAdminRole()
  
  if (!authorized || !adminId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')

    const supabase = await createClient()

    let query = supabase
      .from('users')
      .select('*, user_shards(*), user_cards(*), listings(*)')
      .limit(50)

    if (q) {
      query = query.or(`email.ilike.%${q}%,nickname.ilike.%${q}%,wallet.ilike.%${q}%`)
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

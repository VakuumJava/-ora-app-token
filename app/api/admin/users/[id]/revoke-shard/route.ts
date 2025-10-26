import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkAdminRole, logAdminAction } from '@/lib/admin-utils'

/**
 * POST /api/admin/users/[id]/revoke-shard - Забрать осколок у пользователя
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { authorized, adminId } = await checkAdminRole()
  
  if (!authorized || !adminId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { user_shard_id } = body

    if (!user_shard_id) {
      return NextResponse.json({ error: 'User shard ID is required' }, { status: 400 })
    }

    const supabase = await createClient()

    // Получаем данные перед удалением
    const { data: oldData } = await supabase
      .from('user_shards')
      .select('*')
      .eq('id', user_shard_id)
      .eq('user_id', params.id)
      .single()

    if (!oldData) {
      return NextResponse.json({ error: 'Shard not found' }, { status: 404 })
    }

    if (oldData.used) {
      return NextResponse.json(
        { error: 'Cannot revoke used shard' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('user_shards')
      .delete()
      .eq('id', user_shard_id)
      .eq('user_id', params.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    await logAdminAction(adminId, {
      action: 'revoke_shard',
      entity: 'user_shards',
      entity_id: user_shard_id,
      before: oldData,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

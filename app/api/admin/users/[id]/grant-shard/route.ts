import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkAdminRole, logAdminAction } from '@/lib/admin-utils'

/**
 * POST /api/admin/users/[id]/grant-shard - Выдать осколок пользователю
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { authorized } = await checkAdminRole()
  
  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { shard_id } = body

    if (!shard_id) {
      return NextResponse.json({ error: 'Shard ID is required' }, { status: 400 })
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from('user_shards')
      .insert({
        user_id: params.id,
        shard_id,
        obtained_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    await logAdminAction({
      action: 'grant_shard',
      entity: 'user_shards',
      entity_id: data.id,
      after: { user_id: params.id, shard_id },
    })

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

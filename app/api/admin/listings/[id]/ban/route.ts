import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkAdminRole, logAdminAction } from '@/lib/admin-utils'

/**
 * POST /api/admin/listings/[id]/ban - Бан листинга
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
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Получаем старое значение
    const { data: oldData } = await supabase
      .from('listings')
      .select('*')
      .eq('id', params.id)
      .single()

    if (!oldData) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }

    const { data, error } = await supabase
      .from('listings')
      .update({
        status: 'banned',
        banned_at: new Date().toISOString(),
        banned_by: user?.id,
      })
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    await logAdminAction(adminId, {
      action: 'ban_listing',
      entity: 'listings',
      entity_id: data.id,
      before: oldData,
      after: data,
    })

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

/**
 * DELETE /api/admin/listings/[id]/ban - Разбан листинга
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { authorized, adminId } = await checkAdminRole()
  
  if (!authorized || !adminId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = await createClient()

    // Получаем старое значение
    const { data: oldData } = await supabase
      .from('listings')
      .select('*')
      .eq('id', params.id)
      .single()

    if (!oldData) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }

    const { data, error } = await supabase
      .from('listings')
      .update({
        status: 'active',
        banned_at: null,
        banned_by: null,
      })
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    await logAdminAction(adminId, {
      action: 'unban_listing',
      entity: 'listings',
      entity_id: data.id,
      before: oldData,
      after: data,
    })

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

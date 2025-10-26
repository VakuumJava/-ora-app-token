import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkAdminRole, logAdminAction } from '@/lib/admin-utils'

/**
 * POST /api/admin/collections - Создание коллекции
 */
export async function POST(request: NextRequest) {
  const { authorized, adminId } = await checkAdminRole()
  
  if (!authorized || !adminId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { name, description, cover_url, chain, royalty_pct } = body

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data, error } = await supabase
      .from('collections')
      .insert({
        name,
        description,
        cover_url,
        chain: chain || 'ethereum',
        royalty_pct: royalty_pct || 0,
        created_by: user?.id,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    await logAdminAction(adminId, {
      action: 'create_collection',
      entity: 'collections',
      entity_id: data.id,
      after: data,
    })

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

/**
 * GET /api/admin/collections - Получение всех коллекций
 */
export async function GET() {
  const { authorized, adminId } = await checkAdminRole()
  
  if (!authorized || !adminId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

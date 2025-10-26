import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkAdminRole, logAdminAction } from '@/lib/admin-utils'

/**
 * POST /api/admin/cards - Создание карточки
 */
export async function POST(request: NextRequest) {
  const { authorized, adminId } = await checkAdminRole()
  
  if (!authorized || !adminId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { collection_id, name, description, supply_cap, image_url, rarity } = body

    if (!collection_id || !name) {
      return NextResponse.json({ error: 'Collection ID and name are required' }, { status: 400 })
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from('cards')
      .insert({
        collection_id,
        name,
        description,
        supply_cap: supply_cap || 1000,
        image_url,
        rarity: rarity || 'common',
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Автоматически создаем 3 осколка для карточки
    const shards = [
      { card_id: data.id, shard_index: 1, name: `${name} - Осколок 1` },
      { card_id: data.id, shard_index: 2, name: `${name} - Осколок 2` },
      { card_id: data.id, shard_index: 3, name: `${name} - Осколок 3` },
    ]

    await supabase.from('shards').insert(shards)

    await logAdminAction(adminId, {
      action: 'create_card',
      entity: 'cards',
      entity_id: data.id,
      after: data,
    })

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

/**
 * GET /api/admin/cards - Получение всех карточек
 */
export async function GET(request: NextRequest) {
  const { authorized, adminId } = await checkAdminRole()
  
  if (!authorized || !adminId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const collectionId = searchParams.get('collection_id')

    const supabase = await createClient()

    let query = supabase
      .from('cards')
      .select('*, collections(name), shards(*)')
      .order('created_at', { ascending: false })

    if (collectionId) {
      query = query.eq('collection_id', collectionId)
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

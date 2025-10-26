import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkAdminRole, logAdminAction } from '@/lib/admin-utils'

/**
 * PATCH /api/admin/drops/[id]/toggle - Включение/выключение дропа
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { authorized, adminId } = await checkAdminRole()
  
  if (!authorized || !adminId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = await createClient()

    // Получаем текущее состояние
    const { data: oldData } = await supabase
      .from('drops')
      .select('*')
      .eq('id', params.id)
      .single()

    if (!oldData) {
      return NextResponse.json({ error: 'Drop not found' }, { status: 404 })
    }

    // Переключаем состояние
    const { data, error } = await supabase
      .from('drops')
      .update({ active: !oldData.active })
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    await logAdminAction(adminId, {
      action: 'toggle_drop',
      entity: 'drops',
      entity_id: data.id,
      before: { active: oldData.active },
      after: { active: data.active },
    })

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

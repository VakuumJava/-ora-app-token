import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkAdminRole, logAdminAction } from '@/lib/admin-utils'

/**
 * GET /api/admin/web3 - Получение конфигурации Web3
 */
export async function GET() {
  const { authorized, adminId } = await checkAdminRole('owner')
  
  if (!authorized || !adminId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('web3_config')
      .select('*')
      .eq('active', true)
      .single()

    if (error && error.code !== 'PGRST116') {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data || {})
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

/**
 * PATCH /api/admin/web3 - Обновление конфигурации Web3
 */
export async function PATCH(request: NextRequest) {
  const { authorized, adminId } = await checkAdminRole('owner')
  
  if (!authorized || !adminId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { chain, rpc_url, contract_address, abi, mint_function } = body

    if (!chain || !rpc_url || !contract_address) {
      return NextResponse.json(
        { error: 'Chain, RPC URL and contract address are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Получаем старую конфигурацию для аудита
    const { data: oldData } = await supabase
      .from('web3_config')
      .select('*')
      .eq('active', true)
      .single()

    // Деактивируем все старые конфиги
    await supabase
      .from('web3_config')
      .update({ active: false })
      .eq('active', true)

    // Создаем новую конфигурацию
    const { data, error } = await supabase
      .from('web3_config')
      .insert({
        chain,
        rpc_url,
        contract_address,
        abi,
        mint_function: mint_function || 'mintTo',
        active: true,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    await logAdminAction(adminId, {
      action: 'update_web3_config',
      entity: 'web3_config',
      entity_id: data.id,
      before: oldData,
      after: data,
    })

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkAdminRole, logAdminAction } from '@/lib/admin-utils'

/**
 * POST /api/admin/web3/test-mint - Тестовый минт NFT
 */
export async function POST(request: NextRequest) {
  const { authorized, adminId } = await checkAdminRole('owner')
  
  if (!authorized || !adminId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { image_url, to_address } = body

    if (!image_url) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 })
    }

    const supabase = await createClient()

    // Получаем активную Web3 конфигурацию
    const { data: config } = await supabase
      .from('web3_config')
      .select('*')
      .eq('active', true)
      .single()

    if (!config) {
      return NextResponse.json(
        { error: 'Web3 not configured' },
        { status: 400 }
      )
    }

    await logAdminAction(adminId, {
      action: 'test_mint',
      entity: 'web3_config',
      entity_id: config.id,
      after: { image_url, to_address },
    })

    // В реальной имплементации здесь будет вызов контракта
    // Сейчас возвращаем конфигурацию для фронтенда
    return NextResponse.json({
      success: true,
      config: {
        chain: config.chain,
        contract: config.contract_address,
        function: config.mint_function,
        image_url,
        to_address: to_address || 'current_user_address',
      },
      message: 'Ready to mint. Please confirm transaction in MetaMask.',
    })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

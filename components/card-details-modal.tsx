'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { X, Send, DollarSign, Coins, Loader2, AlertCircle } from 'lucide-react'
import { useTonAddress, useTonConnectUI } from '@tonconnect/ui-react'

interface CardDetailsModalProps {
  card: {
    id: string
    cardId: string
    name: string
    description: string
    imageUrl: string
    rarity: string
    craftedAt: Date
    owner?: string
    userId?: string // UUID пользователя
    model?: string
    background?: string
  }
  totalMinted: number
  maxSupply: number
  floorPrice: number | null
  onClose: () => void
  onTransfer: (username: string) => Promise<void>
  onMint: (chain: 'ton' | 'eth') => Promise<void>
}

export function CardDetailsModal({ 
  card, 
  totalMinted, 
  maxSupply,
  floorPrice,
  onClose,
  onTransfer,
  onMint
}: CardDetailsModalProps) {
  const [showTransferInput, setShowTransferInput] = useState(false)
  const [showMintOptions, setShowMintOptions] = useState(false)
  const [transferUsername, setTransferUsername] = useState('')
  const [isTransferring, setIsTransferring] = useState(false)
  const [isMinting, setIsMinting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // TON Connect
  const tonAddress = useTonAddress()
  const [tonConnectUI] = useTonConnectUI()
  const isTonConnected = !!tonAddress

  const handleTransfer = async () => {
    if (!transferUsername.trim()) {
      setError('Введите username получателя')
      return
    }

    setIsTransferring(true)
    setError(null)

    try {
      await onTransfer(transferUsername)
      onClose()
    } catch (err: any) {
      setError(err.message || 'Ошибка при передаче')
    } finally {
      setIsTransferring(false)
    }
  }

  const handleMint = async (chain: 'ton' | 'eth') => {
    if (chain === 'ton' && !isTonConnected) {
      tonConnectUI.openModal()
      return
    }

    setIsMinting(true)
    setError(null)

    try {
      if (chain === 'ton') {
        // Получаем userId из карточки или localStorage
        const userId = card.userId || localStorage.getItem('qora_autologin_userId')
        
        if (!userId) {
          throw new Error('Пользователь не авторизован. Войдите в систему.')
        }
        
        
        
        // Реальный TON минт через TonConnect
        const response = await fetch('/api/mint/ton', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: userId, // UUID пользователя
            cardId: card.id,
            walletAddress: tonAddress,
          })
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Ошибка подготовки транзакции')
        }

        // Отправляем транзакцию через TonConnect
        
        const result = await tonConnectUI.sendTransaction(data.transaction)
        
        

        // Подтверждаем минт на сервере
        const confirmResponse = await fetch('/api/mint/ton', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cardId: card.id,
            txHash: result.boc, // transaction hash
          })
        })

        const confirmData = await confirmResponse.json()

        if (!confirmResponse.ok) {
          throw new Error(confirmData.error || 'Ошибка подтверждения минта')
        }

        alert(`✅ ${confirmData.message}\n\nТранзакция: ${confirmData.explorerUrl}`)
        
        // Вызываем callback для обновления инвентаря
        await onMint(chain)
        
        onClose()
      } else {
        throw new Error('Ethereum минт пока не поддерживается')
      }
    } catch (err: any) {
      console.error('❌ Ошибка минта:', err)
      if (err.message && !err.message.includes('User rejects')) {
        setError(err.message || 'Ошибка при минте')
      }
    } finally {
      setIsMinting(false)
    }
  }

  // Рандомные данные для демонстрации
  const model = card.model || 'Hellfire'
  const background = card.background || 'Neon Blue'
  const owner = card.owner || 'demo_user'

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1c1c1e] rounded-3xl max-w-md w-full overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="relative p-4 border-b border-white/10">
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-white transition"
          >
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-semibold text-white pr-8">Информация о карте</h2>
        </div>

        {/* Scrollable Content */}
        <div className="max-h-[70vh] overflow-y-auto">
          {/* Card Image */}
          <div className="p-4">
            <div className="rounded-2xl overflow-hidden bg-white/5">
              <img 
                src={card.imageUrl} 
                alt={card.name}
                className="w-full h-64 object-cover"
              />
            </div>
          </div>

          {/* Info Table - Telegram Style */}
          <div className="px-4 pb-4">
            <div className="bg-[#2c2c2e] rounded-2xl overflow-hidden">
              {/* Владелец */}
              <div className="flex items-center justify-between p-4 border-b border-white/5">
                <span className="text-gray-400 text-sm">Владелец</span>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold">
                    {owner.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-white font-medium">@{owner}</span>
                </div>
              </div>

              {/* Модель */}
              <div className="flex items-center justify-between p-4 border-b border-white/5">
                <span className="text-gray-400 text-sm">Модель</span>
                <span className="text-white font-medium">{model} <span className="text-blue-400 text-xs">0.5%</span></span>
              </div>

              {/* Фон */}
              <div className="flex items-center justify-between p-4 border-b border-white/5">
                <span className="text-gray-400 text-sm">Фон</span>
                <span className="text-white font-medium">{background} <span className="text-blue-400 text-xs">2%</span></span>
              </div>

              {/* Наличие (Выпущено) */}
              <div className="flex items-center justify-between p-4 border-b border-white/5">
                <span className="text-gray-400 text-sm">Выпустили</span>
                <span className="text-white font-medium">{totalMinted}/{maxSupply}</span>
              </div>

              {/* Ценность */}
              <div className="flex items-center justify-between p-4">
                <span className="text-gray-400 text-sm">Ценность</span>
                <button 
                  onClick={() => {
                    if (floorPrice === null) {
                      alert('На маркетплейсе пока нет таких карт. Станьте первым, кто выставит её на продажу!')
                    }
                  }}
                  className="text-blue-400 font-medium hover:underline text-sm"
                >
                  {floorPrice ? `$${floorPrice.toFixed(2)}` : 'None'} подробнее
                </button>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mx-4 mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Transfer Input */}
          {showTransferInput && (
            <div className="px-4 pb-4">
              <div className="bg-[#2c2c2e] rounded-2xl p-4">
                <label className="block text-sm text-gray-400 mb-2">
                  Username получателя
                </label>
                <input
                  type="text"
                  value={transferUsername}
                  onChange={(e) => setTransferUsername(e.target.value)}
                  placeholder="@username"
                  className="w-full px-4 py-3 bg-[#1c1c1e] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
                  autoFocus
                />
                <div className="flex gap-2 mt-3">
                  <Button
                    onClick={() => setShowTransferInput(false)}
                    variant="outline"
                    className="flex-1 bg-transparent border-white/10 text-white hover:bg-white/5"
                    disabled={isTransferring}
                  >
                    Отмена
                  </Button>
                  <Button
                    onClick={handleTransfer}
                    disabled={isTransferring || !transferUsername.trim()}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    {isTransferring ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Передача...
                      </>
                    ) : (
                      'Подтвердить'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Mint Options */}
          {showMintOptions && (
            <div className="px-4 pb-4">
              <div className="bg-[#2c2c2e] rounded-2xl p-4">
                <p className="text-sm text-gray-400 mb-3">Выберите сеть для минта:</p>
                
                {/* TON Network */}
                <div className="space-y-2">
                  <button
                    onClick={() => isTonConnected ? handleMint('ton') : tonConnectUI.openModal()}
                    disabled={isMinting}
                    className="w-full p-4 bg-[#1c1c1e] hover:bg-[#0088cc]/20 border border-white/10 hover:border-[#0088cc] rounded-xl text-left transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#0088cc] flex items-center justify-center">
                        <Coins className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">TON Network</p>
                        {isTonConnected ? (
                          <p className="text-xs text-green-400">✓ Кошелек подключен: {tonAddress.slice(0, 8)}...{tonAddress.slice(-6)}</p>
                        ) : (
                          <p className="text-xs text-yellow-400">⚠ Нажмите чтобы подключить кошелек</p>
                        )}
                      </div>
                    </div>
                  </button>
                  
                  {/* Ethereum */}
                  <button
                    onClick={() => handleMint('eth')}
                    disabled={isMinting}
                    className="w-full p-4 bg-[#1c1c1e] hover:bg-purple-500/20 border border-white/10 hover:border-purple-500 rounded-xl text-left transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
                        <Coins className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">Ethereum</p>
                        <p className="text-xs text-gray-400">MetaMask скоро будет добавлен</p>
                      </div>
                    </div>
                  </button>
                </div>
                <Button
                  onClick={() => setShowMintOptions(false)}
                  variant="outline"
                  className="w-full mt-3 bg-transparent border-white/10 text-white hover:bg-white/5"
                  disabled={isMinting}
                >
                  Отмена
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons - Telegram Style */}
        {!showTransferInput && !showMintOptions && (
          <div className="p-4 border-t border-white/10 bg-[#1c1c1e]">
            <div className="grid grid-cols-3 gap-2">
              {/* Передать */}
              <button
                onClick={() => setShowTransferInput(true)}
                className="flex flex-col items-center gap-2 p-4 bg-[#34c759]/10 hover:bg-[#34c759]/20 rounded-2xl transition"
              >
                <div className="w-12 h-12 rounded-full bg-[#34c759] flex items-center justify-center">
                  <Send className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-white font-medium">Передать</span>
              </button>

              {/* Продать - заблокировано */}
              <button
                onClick={() => alert('Функция "Продать" будет доступна после реализации маркетплейса')}
                className="flex flex-col items-center gap-2 p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition opacity-50 cursor-not-allowed"
                disabled
              >
                <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-gray-400 font-medium">Продать</span>
              </button>

              {/* Mint */}
              <button
                onClick={() => setShowMintOptions(true)}
                className="flex flex-col items-center gap-2 p-4 bg-blue-500/10 hover:bg-blue-500/20 rounded-2xl transition"
              >
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
                  <Coins className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-white font-medium">Mint</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

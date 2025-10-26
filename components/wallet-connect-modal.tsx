'use client'

import { useState, useEffect } from 'react'
import { X, Wallet } from 'lucide-react'
import { Button } from './ui/button'
import { useTonConnectUI, useTonWallet } from '@tonconnect/ui-react'

interface WalletConnectModalProps {
  isOpen: boolean
  onClose: () => void
}

export function WalletConnectModal({ isOpen, onClose }: WalletConnectModalProps) {
  const [tonConnectUI] = useTonConnectUI()
  const tonWallet = useTonWallet()
  const [ethereumAddress, setEthereumAddress] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)

  // Проверяем подключенный Ethereum кошелек при открытии
  useEffect(() => {
    if (isOpen && typeof window !== 'undefined' && window.ethereum) {
      window.ethereum
        .request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            setEthereumAddress(accounts[0])
          }
        })
        .catch(console.error)
    }
  }, [isOpen])

  // Закрытие по Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const connectTonWallet = async () => {
    try {
      setIsConnecting(true)
      await tonConnectUI.openModal()
    } catch (error) {
      console.error('TON connection error:', error)
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectTonWallet = async () => {
    try {
      await tonConnectUI.disconnect()
    } catch (error) {
      console.error('TON disconnect error:', error)
    }
  }

  const connectEthereumWallet = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      alert('Пожалуйста, установите MetaMask для подключения Ethereum кошелька')
      return
    }

    try {
      setIsConnecting(true)
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })
      if (accounts.length > 0) {
        setEthereumAddress(accounts[0])
      }
    } catch (error: any) {
      console.error('Ethereum connection error:', error)
      if (error.code === 4001) {
        alert('Подключение отклонено пользователем')
      } else {
        alert('Ошибка подключения к MetaMask')
      }
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectEthereumWallet = () => {
    setEthereumAddress(null)
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const isTonConnected = !!tonWallet
  const isEthConnected = !!ethereumAddress

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#030014] p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-white/60 transition-colors hover:text-white"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-3">
            <Wallet className="h-8 w-8 text-[#7FA0E3]" />
            <h2
              className="text-3xl font-bold text-white"
              style={{ fontFamily: "'MuseoModerno', sans-serif" }}
            >
              Кошелек
            </h2>
          </div>
          <p
            className="text-white/60"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Подключите TON или Ethereum кошелек
          </p>
        </div>

        {/* Wallet buttons */}
        <div className="space-y-4">
          {/* TON Wallet */}
          {isTonConnected ? (
            <div className="flex items-center justify-between rounded-2xl border border-[#0088CC]/30 bg-[#0088CC]/10 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0088CC]/20">
                  <span className="text-xl">💎</span>
                </div>
                <div>
                  <div
                    className="text-sm font-medium text-white"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    TON
                  </div>
                  <div className="text-xs text-white/60">
                    {tonWallet.account.address && formatAddress(tonWallet.account.address)}
                  </div>
                </div>
              </div>
              <Button
                onClick={disconnectTonWallet}
                variant="outline"
                size="sm"
                className="border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20"
              >
                Отключить
              </Button>
            </div>
          ) : (
            <Button
              onClick={connectTonWallet}
              disabled={isConnecting}
              className="w-full rounded-2xl border border-[#0088CC]/30 bg-[#0088CC]/10 py-6 text-white transition-all hover:bg-[#0088CC]/20"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0088CC]/20">
                  <span className="text-xl">💎</span>
                </div>
                <div className="text-left">
                  <div className="font-semibold">TON Connect</div>
                  <div className="text-xs text-white/60">Tonkeeper, MyTonWallet</div>
                </div>
              </div>
            </Button>
          )}

          {/* Ethereum Wallet */}
          {isEthConnected ? (
            <div className="flex items-center justify-between rounded-2xl border border-[#627EEA]/30 bg-[#627EEA]/10 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#627EEA]/20">
                  <span className="text-xl font-bold text-white">Ξ</span>
                </div>
                <div>
                  <div
                    className="text-sm font-medium text-white"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    ETH
                  </div>
                  <div className="text-xs text-white/60">{formatAddress(ethereumAddress)}</div>
                </div>
              </div>
              <Button
                onClick={disconnectEthereumWallet}
                variant="outline"
                size="sm"
                className="border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20"
              >
                Отключить
              </Button>
            </div>
          ) : (
            <Button
              onClick={connectEthereumWallet}
              disabled={isConnecting}
              className="w-full rounded-2xl border border-[#627EEA]/30 bg-[#627EEA]/10 py-6 text-white transition-all hover:bg-[#627EEA]/20"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#627EEA]/20">
                  <span className="text-xl font-bold">Ξ</span>
                </div>
                <div className="text-left">
                  <div className="font-semibold">Ethereum</div>
                  <div className="text-xs text-white/60">MetaMask, WalletConnect</div>
                </div>
              </div>
            </Button>
          )}
        </div>

        {/* Footer hint */}
        <p
          className="mt-6 text-center text-xs text-white/40"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Ваши кошельки будут использоваться для покупки и продажи NFT
        </p>
      </div>
    </div>
  )
}

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>
      on: (event: string, handler: (...args: any[]) => void) => void
      removeListener: (event: string, handler: (...args: any[]) => void) => void
    }
  }
}

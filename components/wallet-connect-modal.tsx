'use client'

import { useState, useEffect } from 'react'
import { Wallet } from 'lucide-react'
import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
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

  const connectTonWallet = async () => {
    try {
      setIsConnecting(true)
      await tonConnectUI.openModal()
    } catch (error) {
      console.error('TON Connect error:', error)
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectTonWallet = async () => {
    try {
      await tonConnectUI.disconnect()
    } catch (error) {
      console.error('TON Disconnect error:', error)
    }
  }

  const connectEthereumWallet = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      alert('Установите MetaMask!')
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
    } catch (error) {
      console.error('Ethereum connection error:', error)
      alert('Ошибка подключения MetaMask')
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md border-white/10 bg-black/90 backdrop-blur-xl relative z-[10000]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
            <Wallet className="h-7 w-7 text-blue-400" />
            Кошелек
          </DialogTitle>
          <DialogDescription className="text-white/60">
            Подключите TON или Ethereum кошелек
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-6 relative z-10">
          {isTonConnected ? (
            <div className="flex items-center justify-between rounded-2xl border border-[#0088CC]/30 bg-[#0088CC]/10 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0088CC]/20">
                  <span className="text-xl">💎</span>
                </div>
                <div>
                  <div className="text-sm font-medium text-white">TON</div>
                  <div className="text-xs text-white/60 font-mono">
                    {tonWallet.account.address && formatAddress(tonWallet.account.address)}
                  </div>
                </div>
              </div>
              <Button
                onClick={disconnectTonWallet}
                variant="outline"
                size="sm"
                className="border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 relative z-10"
              >
                Отключить
              </Button>
            </div>
          ) : (
            <Button
              onClick={connectTonWallet}
              disabled={isConnecting}
              className="w-full rounded-2xl border border-[#0088CC]/30 bg-[#0088CC]/10 py-6 text-white transition-all hover:bg-[#0088CC]/20 relative z-10 cursor-pointer"
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

          {isEthConnected ? (
            <div className="flex items-center justify-between rounded-2xl border border-[#627EEA]/30 bg-[#627EEA]/10 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#627EEA]/20">
                  <span className="text-xl font-bold text-white">Ξ</span>
                </div>
                <div>
                  <div className="text-sm font-medium text-white">ETH</div>
                  <div className="text-xs text-white/60 font-mono">{formatAddress(ethereumAddress)}</div>
                </div>
              </div>
              <Button
                onClick={disconnectEthereumWallet}
                variant="outline"
                size="sm"
                className="border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 relative z-10"
              >
                Отключить
              </Button>
            </div>
          ) : (
            <Button
              onClick={connectEthereumWallet}
              disabled={isConnecting}
              className="w-full rounded-2xl border border-[#627EEA]/30 bg-[#627EEA]/10 py-6 text-white transition-all hover:bg-[#627EEA]/20 relative z-10 cursor-pointer"
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

        <p className="mt-6 text-center text-xs text-white/40 relative z-10">
          Ваши кошельки будут использоваться для покупки и продажи NFT
        </p>
      </DialogContent>
    </Dialog>
  )
}

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>
    }
  }
}

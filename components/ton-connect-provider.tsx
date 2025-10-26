'use client'

import { TonConnectUIProvider } from '@tonconnect/ui-react'
import { ReactNode } from 'react'

export function TonConnectProvider({ children }: { children: ReactNode }) {
  // Динамически определяем URL manifest в зависимости от окружения
  const manifestUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/tonconnect-manifest.json`
    : 'http://localhost:3000/tonconnect-manifest.json'

  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      {children}
    </TonConnectUIProvider>
  )
}

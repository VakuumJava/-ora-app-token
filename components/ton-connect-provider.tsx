'use client'

import { TonConnectUIProvider } from '@tonconnect/ui-react'
import { ReactNode } from 'react'

export function TonConnectProvider({ children }: { children: ReactNode }) {
  return (
    <TonConnectUIProvider
      manifestUrl="http://localhost:3000/tonconnect-manifest.json"
    >
      {children}
    </TonConnectUIProvider>
  )
}

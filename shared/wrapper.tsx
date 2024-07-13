import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import type React from "react"
import { WagmiProvider } from "wagmi"

import { config } from "~lib/wagmi-config"

const queryClient = new QueryClient()

export default function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
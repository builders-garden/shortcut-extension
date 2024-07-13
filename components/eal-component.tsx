import {
  DynamicWidget,
  useDynamicContext,
  useIsLoggedIn
} from "@dynamic-labs/sdk-react-core"
import { useEffect, useState } from "react"

import "../assets/style.css"

import type { WalletClient } from "viem"

export default function EALComponent({ action }: { action: string }) {
  const isLoggedIn = useIsLoggedIn()
  console.log(isLoggedIn)
  const { primaryWallet } = useDynamicContext()
  const [metadata, setMetadata] = useState<any>(null)
  const [selectedAction, setSelectedAction] = useState<any>(null)
  const [lastExecutedAction, setLastExecutedAction] = useState<any>(null)

  useEffect(() => {
    if (action) {
      // fetch the action
      const url = decodeURIComponent(action).replace("eal://", "https://")
      fetch(url)
        .then(async (data) => {
          const jsonData = await data.json()
          console.log(jsonData)
          setMetadata({ ...jsonData, url })
        })
        .catch((error) => console.error(error))
    }
  }, [action])

  useEffect(() => {
    console.log(metadata)
  }, [metadata])

  if (!isLoggedIn) {
    return (
      <div className="w-screen flex items-center justify-center p-8">
        <DynamicWidget />
      </div>
    )
  }

  if (!metadata) {
    return (
      <div className="w-screen flex items-center justify-center p-8">
        <DynamicWidget />
      </div>
    )
  }

  const renderLink = (link: any, index: number) => {
    if (lastExecutedAction && lastExecutedAction.index === index) {
      if (lastExecutedAction.success) {
        return (
          <button
            onClick={() => handleClick(link, index)}
            className="bg-green-500 rounded-xl px-4 py-2 border border-green-800 hover:bg-green-600 cursor-pointer font-semibold text-white flex items-center justify-center">
            {link.label}
          </button>
        )
      } else {
        return (
          <button
            onClick={() => handleClick(link, index)}
            className="bg-red-500 rounded-xl px-4 py-2 border border-red-800 hover:bg-red-600 cursor-pointer font-semibold text-white flex items-center justify-center">
            {link.label}
          </button>
        )
      }
    }

    return (
      <button
        onClick={() => handleClick(link, index)}
        className="bg-blue-500 rounded-xl px-4 py-2 border border-blue-800 hover:bg-blue-600 cursor-pointer font-semibold text-white flex items-center justify-center">
        {link.label}
      </button>
    )
  }

  const renderLinks = (metadata: any) => {
    if (metadata.links.length === 1) {
      return (
        <div className="grid grid-cols-1 gap-2 w-full max-w-[400px] mx-auto">
          {metadata.links.map(renderLink)}
        </div>
      )
    }

    if (metadata.links.length > 1) {
      return (
        <div className="grid grid-cols-2 gap-2 w-full max-w-[400px] mx-auto">
          {metadata.links.map((link: any, index: number) => {
            if (lastExecutedAction && lastExecutedAction.index === index) {
              if (lastExecutedAction.success) {
                return (
                  <button
                    onClick={() => handleClick(link, index)}
                    className="bg-green-500 rounded-xl px-4 py-2 border border-green-800 hover:bg-green-600 cursor-pointer font-semibold text-white flex items-center justify-center">
                    {link.label}
                  </button>
                )
              } else {
                return (
                  <button
                    onClick={() => handleClick(link, index)}
                    className="bg-red-500 rounded-xl px-4 py-2 border border-red-800 hover:bg-red-600 cursor-pointer font-semibold text-white flex items-center justify-center">
                    {link.label}
                  </button>
                )
              }
            }

            return (
              <button
                onClick={() => handleClick(link, index)}
                className="bg-blue-500 rounded-xl px-4 py-2 border border-blue-800 hover:bg-blue-600 cursor-pointer font-semibold text-white flex items-center justify-center">
                {link.label}
              </button>
            )
          })}
        </div>
      )
    }
    return <div />
  }

  const handleClick = async (link: any, index: number) => {
    if (selectedAction) return
    setSelectedAction(link)
    setLastExecutedAction(null)
    try {
      if (link.type === "link") {
        window.open(link.targetUrl, "_blank", "noopener,noreferrer")
      }
      if (link.type === "tx") {
        const txDataRes = await fetch(link.targetUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address: primaryWallet.address })
        })
        const { transactions } = await txDataRes.json()

        await primaryWallet.sync()

        for (const transaction of transactions) {
          const { chainId } = transaction

          const network = await primaryWallet.getNetwork()

          const walletClient = (await primaryWallet.getWalletClient(
            chainId
          )) as WalletClient

          if (network !== chainId) {
            console.log(network)
            await walletClient.switchChain({ id: parseInt(chainId) })
          }

          const tx = await walletClient.sendTransaction({
            ...transaction,
            from: primaryWallet.address as `0x${string}`
          })
        }
      }
      if (link.type === "signature") {
        const signDataRes = await fetch(link.targetUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address: primaryWallet.address })
        })

        const { message } = await signDataRes.json()
        console.log(message)
        const walletClient = (await primaryWallet.getWalletClient(
          "84532"
        )) as WalletClient
        console.log("[Shortcut] Signing.")
        const signature = await primaryWallet.signMessage(message)
        console.log(signature, "[Shortcut] Signed.")
        await fetch(link.postUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            address: primaryWallet.address,
            signature,
            message
          })
        })
      }
      if (link.type === "one-click-login") {
        const oneClickDataRes = await fetch(link.targetUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address: primaryWallet.address })
        })

        const { message } = await oneClickDataRes.json()

        const walletClient = (await primaryWallet.getWalletClient(
          (await primaryWallet.getNetwork()).toString()
        )) as WalletClient

        console.log("[Shortcut] Signing.")
        const signature = await walletClient.signMessage({
          message,
          account: primaryWallet.address as `0x${string}`
        })

        const postUrlRes = await fetch(`${link.postUrl}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            signedMessage: signature,
            address: primaryWallet.address,
            chain: "EVM",
            messageToSign: message
          })
        })

        const { url } = await postUrlRes.json()

        if (url) {
          window.open(url, "_blank", "noopener,noreferrer")
        }
      }
      setLastExecutedAction({ ...link, index, success: true })
    } catch (error) {
      console.error(error)
      setLastExecutedAction({ ...link, index, success: false })
    } finally {
      setSelectedAction(null)
    }
  }

  return (
    <div className="p-4 space-y-4">
      <div className="border rounded-xl">
        <DynamicWidget />
      </div>

      <div className="flex flex-col items-center p-4 border rounded-xl space-y-2 w-auto max-w-[400px] mx-auto">
        <img src={metadata.image} width={400} height={400} />
        <a
          href={metadata.url}
          target="_blank"
          className="text-xs text-gray-500 opacity-40 hover:opacity-100">
          {metadata.url.split("https://")[1]}
        </a>
        <div className="text-center">
          <p className="font-bold text-lg">{metadata.title}</p>
          <p>{metadata.description}</p>
        </div>
        {renderLinks(metadata)}
        {selectedAction && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded-xl">
              <p className="animate-pulse text-lg">Loading..</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

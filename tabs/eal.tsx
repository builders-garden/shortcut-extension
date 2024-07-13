import { EthereumWalletConnectors } from "@dynamic-labs/ethereum"
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core"

import EALComponent from "../components/eal-component"

function DeltaFlyerPage() {
  // get query params
  const urlParams = new URLSearchParams(window.location.search)
  const action = urlParams.get("action")

  return (
    <DynamicContextProvider
      settings={{
        environmentId: "b53b73ff-d0a3-49c6-b19a-a3fc144702d2",
        walletConnectors: [EthereumWalletConnectors]
      }}>
      <EALComponent action={action} />
    </DynamicContextProvider>
  )
}

export default DeltaFlyerPage

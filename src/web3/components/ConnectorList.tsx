import { injectedConnector, walletConnect } from "../connectors";
import { Connector } from "./Connector";
import MetamaskLogo from "@/assets/wallet/Metamask.svg";
import WalletConnectLogo from "@/assets/wallet/WalletConnect.svg";

export interface ConnectorListProps {
}
export function ConnectorList(props: ConnectorListProps) {

  return (
    <div className="flex flex-col gap-4">
      <Connector
        name="Metamask"
        logo={MetamaskLogo}
        connector={injectedConnector}
        onConnected={() => {}}
      />
      <Connector
        name="Wallet Connect"
        logo={WalletConnectLogo}
        connector={walletConnect}
        onConnected={() => {}}
      />
    </div>
  )
}
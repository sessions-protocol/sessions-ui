import { metamask, walletconnect } from "../connectors";
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
        connector={metamask}
        onConnected={() => {}}
      />
      <Connector
        name="Wallet Connect"
        logo={WalletConnectLogo}
        connector={walletconnect}
        onConnected={() => {}}
      />
    </div>
  )
}
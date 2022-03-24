import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'

export const metamask = new InjectedConnector({ supportedChainIds: [1] })

export const walletconnect = new WalletConnectConnector({
  rpc: {
    1: "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
  },
  chainId: 1,
  qrcode: true,
  supportedChainIds: [1],
})
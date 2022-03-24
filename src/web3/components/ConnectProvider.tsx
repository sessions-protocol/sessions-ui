import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'

export interface ConnectProviderProps {
  children: React.ReactNode;
}
export function ConnectProvider(props: ConnectProviderProps) {
  return (
    <Web3ReactProvider getLibrary={(provider) => {
      return new Web3Provider(provider)
    }}>
      {props.children}
    </Web3ReactProvider>
  )
}
import { Button } from '@chakra-ui/react';
import { Web3Provider } from '@ethersproject/providers';
import { AbstractConnector } from '@web3-react/abstract-connector';
import { useWeb3React } from "@web3-react/core";

export interface ConnectorProps {
  name: string;
  logo: string;
  connector: AbstractConnector;
  onConnected: () => void;
}
export function Connector(props: ConnectorProps) {
  const context = useWeb3React<Web3Provider>()
  const { activate } = context

  return (
    <Button
      size='lg'
      onClick={async () => {
        try {
          await activate(props.connector, undefined, true)
          props.onConnected()
        } catch (error) {
          console.log({error})
        }
      }}
    >
      <div className="w-8 h-8 flex justify-center items-center">
        <img className="max-w-full max-h-full" src={props.logo} alt={`${props.name} logo`} />
      </div>
      <div className="text-base ml-2 text-gray-600 dark:text-gray-300">{props.name}</div>
    </Button>
  )
}
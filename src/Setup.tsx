import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { ReactQueryDevtools } from 'react-query/devtools';
import { AppColorModeScript } from './components/AppColorModeScript';
import { useEagerConnect, useInactiveListener } from './web3/components/hooks';
import { useWeb3ClientState } from '@/context/Web3ClientState';

export interface SetupProps {
  children: React.ReactNode;
}
export default function Setup(props: SetupProps) {
  const [web3ClientState, setWeb3ClientState] = useWeb3ClientState();

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect()
  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager)

  useEffect(() => {
    console.log('1')
    setWeb3ClientState({ isEagerConnectTried: triedEager })
  }, [setWeb3ClientState, triedEager]);

  return (
    <div className='Setup'>
      <AppColorModeScript />

      {props.children}

      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      <ReactQueryDevtools initialIsOpen={false} />
    </div>
  )
}

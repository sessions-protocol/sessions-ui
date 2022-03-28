import { Toaster } from 'react-hot-toast';
import { ReactQueryDevtools } from 'react-query/devtools';
import { AppColorModeScript } from './components/AppColorModeScript';
import { useEagerConnect, useInactiveListener } from './web3/components/hooks';

export interface SetupProps {
  children: React.ReactNode;
}
export default function Setup(props: SetupProps) {

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect()
  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager)

  return (
    <div className='Setup'>
      <AppColorModeScript />

      {props.children}

      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      <ReactQueryDevtools initialIsOpen={false} />
    </div>
  )
}

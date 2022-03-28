import { ChakraProvider, extendTheme, localStorageManager } from '@chakra-ui/react';
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import './App.css';
import { AppColorModeScript, APP_INITIAL_COLOR_MODE } from './components/AppColorModeScript';
import Router from './Router';
import { ConnectProvider } from './web3/components/ConnectProvider';
import { useEagerConnect, useInactiveListener } from './web3/components/hooks';
import { mode } from '@chakra-ui/theme-tools'

const theme = extendTheme({
  config: {
    useSystemColorMode: true,
    initialColorMode: APP_INITIAL_COLOR_MODE,
  },
  styles: {
    global: (props: any) => ({
      body: {
        bg: mode('#f5f5f5', '#292929')(props),
      },
    }),
  },
  breakpoints: {
    'sm': '640px',
    'md': '768px',
    'lg': '1024px',
    'xl': '1280px',
    '2xl': '1536px',
  },
});

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  }
})

function App() {

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect()

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager)

  return (
    <div className="App">
      <div className="text-gray-700 dark:text-white">
        <AppColorModeScript />

        <ChakraProvider theme={theme} colorModeManager={localStorageManager}>
        <ConnectProvider>
        <QueryClientProvider client={queryClient}>

          <Router />

          <Toaster position="top-center" toastOptions={{ duration: 3000 }} />

        <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
        </ConnectProvider>
        </ChakraProvider>
      </div>
    </div>
  )
}

export default App

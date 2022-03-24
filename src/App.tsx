import './App.css';
import Router from './Router';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Toaster } from "react-hot-toast";
import { ConnectProvider } from './web3/components/ConnectProvider';
import { useEagerConnect, useInactiveListener } from './web3/components/hooks';

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
      <div className="text-black dark:text-white">
        <ConnectProvider>
        <QueryClientProvider client={queryClient}>

          <Router />

          <Toaster position="top-center" toastOptions={{ duration: 3000 }} />

        <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
        </ConnectProvider>
      </div>
    </div>
  )
}

export default App

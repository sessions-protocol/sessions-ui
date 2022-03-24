import './App.css';
import Router from './Router';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

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
  return (
    <div className="App">
      <div className="text-black dark:text-white">
        <QueryClientProvider client={queryClient}>

          <Router />

        <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </div>
    </div>
  )
}

export default App

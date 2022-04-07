import { ChakraProvider, localStorageManager } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { RecoilRoot } from "recoil";
import "./App.css";
import { TimezoneProvider } from "./context/TimezoneContext";
import Router from "./Router";
import Setup from "./Setup";
import { chakraTheme } from "./styles/chakra";
import { ConnectProvider } from "./web3/components/ConnectProvider";


// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function App() {
  return (
    <div className="App">
      <div className="text-gray-700 dark:text-white">
        <RecoilRoot>
          <ConnectProvider>
            <TimezoneProvider>
              <ChakraProvider
                theme={chakraTheme}
                colorModeManager={localStorageManager}
              >
                <QueryClientProvider client={queryClient}>
                  <Setup>
                    <Router />
                  </Setup>
                </QueryClientProvider>
              </ChakraProvider>
            </TimezoneProvider>
          </ConnectProvider>
        </RecoilRoot>
      </div>
    </div>
  );
}

export default App;

import { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { injectedConnector } from '../connectors'

export function useEagerConnect() {
  const { activate, active } = useWeb3React()

  const [tried, setTried] = useState(false)

  useEffect(() => {
    injectedConnector.isAuthorized().then((isAuthorized: boolean) => {
      if (isAuthorized) {
        activate(injectedConnector, undefined, true).catch((error) => {
          console.error(error)
          setTried(true)
        })
      } else {
        setTried(true)
      }
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (!tried && active) {
      setTried(true)
    }
  }, [tried, active])

  return tried
}

export function useInactiveListener(suppress = false) {
  const { active, error, activate } = useWeb3React()
  useEffect((): any => {
    const { ethereum } = window as any
    if (ethereum && ethereum.on && !active && !error && !suppress) {
      const handleConnect = () => {
        console.log("Handling 'connect' event")
        activate(injectedConnector)
      }
      const handleChainChanged = (chainId: string | number) => {
        console.log("Handling 'chainChanged' event with payload", chainId)
        activate(injectedConnector)
      }
      const handleAccountsChanged = (accounts: string[]) => {
        console.log("Handling 'accountsChanged' event with payload", accounts)
        if (accounts.length > 0) {
          activate(injectedConnector)
        }
      }

      ethereum.on('connect', handleConnect)
      ethereum.on('chainChanged', handleChainChanged)
      ethereum.on('accountsChanged', handleAccountsChanged)

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener('connect', handleConnect)
          ethereum.removeListener('chainChanged', handleChainChanged)
          ethereum.removeListener('accountsChanged', handleAccountsChanged)
        }
      }
    }
  }, [active, error, suppress, activate])
}

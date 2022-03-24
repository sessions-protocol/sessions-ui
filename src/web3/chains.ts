
interface Chain {
  id: number;
  urls: string[]
  name: string
}

const CHAIN_ETH: Chain = {
  id: 1,
  urls: [
    "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
  ],
  name: 'Mainnet',
}
const CHAIN_POLYGON: Chain = {
  id: 137,
  urls: [
    "https://rpc-mainnet.matic.network/",
    "https://polygon-rpc.com/",
    "https://matic-mainnet-full-rpc.bwarelabs.com/",
  ],
  name: 'Mainnet',
}

export const CHAINS: { [chainId: number]: Chain } = {
  // Ethereum
  1: CHAIN_ETH,
  // Polygon
  137: CHAIN_POLYGON,
}

export const URLS: { [chainId: number]: string[] } = Object.keys(CHAINS).reduce<{ [chainId: number]: string[] }>(
  (accumulator, chainId) => {
    const validURLs: string[] = CHAINS[Number(chainId)].urls

    if (validURLs.length) {
      accumulator[Number(chainId)] = validURLs
    }

    return accumulator
  },
  {}
)

export const SUPPORTED_CHAINS = [1]
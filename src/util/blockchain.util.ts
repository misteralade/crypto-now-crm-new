// Blockchain Explorer Utility - Comprehensive version for all networks

import type {CryptoNetworkType} from "../schemas/enum.schema.ts";
import { CRYPTO_NETWORK } from "./enum.ts";

interface ExplorerConfig {
  name: string
  baseUrl: string
  txPath: string
  addressPath: string
  tokenPath?: string
}

// Comprehensive explorer configurations for all networks
const EXPLORER_CONFIGS: Record<CRYPTO_NETWORK, ExplorerConfig> = {
  [CRYPTO_NETWORK.BTC]: {
    name: 'Blockchain.com',
    baseUrl: 'https://www.blockchain.com/explorer',
    txPath: '/transactions/btc/',
    addressPath: '/addresses/btc/',
  },
  [CRYPTO_NETWORK.ERC20]: {
    name: 'Etherscan',
    baseUrl: 'https://etherscan.io',
    txPath: '/tx/',
    addressPath: '/address/',
    tokenPath: '/token/',
  },
  [CRYPTO_NETWORK.TRC20]: {
    name: 'Tronscan',
    baseUrl: 'https://tronscan.org',
    txPath: '/#/transaction/',
    addressPath: '/#/address/',
    tokenPath: '/#/token20/',
  },
  [CRYPTO_NETWORK.BEP20]: {
    name: 'BscScan',
    baseUrl: 'https://bscscan.com',
    txPath: '/tx/',
    addressPath: '/address/',
    tokenPath: '/token/',
  },
  [CRYPTO_NETWORK.BSC]: {
    name: 'BscScan',
    baseUrl: 'https://bscscan.com',
    txPath: '/tx/',
    addressPath: '/address/',
    tokenPath: '/token/',
  },
  [CRYPTO_NETWORK.SOLANA]: {
    name: 'Solscan',
    baseUrl: 'https://solscan.io',
    txPath: '/tx/',
    addressPath: '/account/',
    tokenPath: '/token/',
  },
  [CRYPTO_NETWORK.POLYGON]: {
    name: 'PolygonScan',
    baseUrl: 'https://polygonscan.com',
    txPath: '/tx/',
    addressPath: '/address/',
    tokenPath: '/token/',
  },
  [CRYPTO_NETWORK.ARBITRUM]: {
    name: 'Arbiscan',
    baseUrl: 'https://arbiscan.io',
    txPath: '/tx/',
    addressPath: '/address/',
    tokenPath: '/token/',
  },
  [CRYPTO_NETWORK.OPTIMISM]: {
    name: 'Optimistic Etherscan',
    baseUrl: 'https://optimistic.etherscan.io',
    txPath: '/tx/',
    addressPath: '/address/',
    tokenPath: '/token/',
  },
  [CRYPTO_NETWORK.AVALANCHE]: {
    name: 'SnowTrace',
    baseUrl: 'https://snowtrace.io',
    txPath: '/tx/',
    addressPath: '/address/',
    tokenPath: '/token/',
  },
  [CRYPTO_NETWORK.FANTOM]: {
    name: 'FTMScan',
    baseUrl: 'https://ftmscan.com',
    txPath: '/tx/',
    addressPath: '/address/',
    tokenPath: '/token/',
  },
  [CRYPTO_NETWORK.CARDANO]: {
    name: 'Cardanoscan',
    baseUrl: 'https://cardanoscan.io',
    txPath: '/transaction/',
    addressPath: '/address/',
  },
  [CRYPTO_NETWORK.POLKADOT]: {
    name: 'Subscan',
    baseUrl: 'https://polkadot.subscan.io',
    txPath: '/extrinsic/',
    addressPath: '/account/',
  },
  [CRYPTO_NETWORK.COSMOS]: {
    name: 'Mintscan',
    baseUrl: 'https://www.mintscan.io/cosmos',
    txPath: '/txs/',
    addressPath: '/account/',
  },
  [CRYPTO_NETWORK.TERRA]: {
    name: 'Terra Finder',
    baseUrl: 'https://finder.terra.money/mainnet',
    txPath: '/tx/',
    addressPath: '/address/',
  },
  [CRYPTO_NETWORK.NEAR]: {
    name: 'NEAR Explorer',
    baseUrl: 'https://explorer.near.org',
    txPath: '/transactions/',
    addressPath: '/accounts/',
  },
  [CRYPTO_NETWORK.HARMONY]: {
    name: 'Harmony Explorer',
    baseUrl: 'https://explorer.harmony.one',
    txPath: '/tx/',
    addressPath: '/address/',
  },
  [CRYPTO_NETWORK.MOONBEAM]: {
    name: 'Moonscan',
    baseUrl: 'https://moonscan.io',
    txPath: '/tx/',
    addressPath: '/address/',
    tokenPath: '/token/',
  },
  [CRYPTO_NETWORK.CRONOS]: {
    name: 'Cronoscan',
    baseUrl: 'https://cronoscan.com',
    txPath: '/tx/',
    addressPath: '/address/',
    tokenPath: '/token/',
  },
  [CRYPTO_NETWORK.KCC]: {
    name: 'KCC Explorer',
    baseUrl: 'https://explorer.kcc.io',
    txPath: '/tx/',
    addressPath: '/address/',
    tokenPath: '/token/',
  },
  [CRYPTO_NETWORK.HECO]: {
    name: 'HecoInfo',
    baseUrl: 'https://hecoinfo.com',
    txPath: '/tx/',
    addressPath: '/address/',
    tokenPath: '/token/',
  },
  [CRYPTO_NETWORK.XDAI]: {
    name: 'Gnosisscan',
    baseUrl: 'https://gnosisscan.io',
    txPath: '/tx/',
    addressPath: '/address/',
    tokenPath: '/token/',
  },
  [CRYPTO_NETWORK.CELO]: {
    name: 'CeloScan',
    baseUrl: 'https://celoscan.io',
    txPath: '/tx/',
    addressPath: '/address/',
    tokenPath: '/token/',
  },
  [CRYPTO_NETWORK.ALGORAND]: {
    name: 'AlgoExplorer',
    baseUrl: 'https://algoexplorer.io',
    txPath: '/tx/',
    addressPath: '/address/',
  },
  [CRYPTO_NETWORK.TEZOS]: {
    name: 'TzStats',
    baseUrl: 'https://tzstats.com',
    txPath: '/',
    addressPath: '/',
  },
  [CRYPTO_NETWORK.ELROND]: {
    name: 'Elrond Explorer',
    baseUrl: 'https://explorer.elrond.com',
    txPath: '/transactions/',
    addressPath: '/accounts/',
  },
  [CRYPTO_NETWORK.KLAYTN]: {
    name: 'Klaytnscope',
    baseUrl: 'https://scope.klaytn.com',
    txPath: '/tx/',
    addressPath: '/account/',
  },
  [CRYPTO_NETWORK.OKEX]: {
    name: 'OKLink',
    baseUrl: 'https://www.oklink.com/okexchain',
    txPath: '/tx/',
    addressPath: '/address/',
  },
}

/**
 * Get the explorer configuration for a given network
 * @param network - Blockchain network from CRYPTO_NETWORK enum
 * @returns Explorer configuration or null if not supported
 */
export const getExplorerConfig = (
  network: CryptoNetworkType | string | null | undefined
): ExplorerConfig | null => {
  if (!network) return null
  
  // Try direct match first
  if (network in EXPLORER_CONFIGS) {
    return EXPLORER_CONFIGS[network as CRYPTO_NETWORK]
  }
  
  // Try normalized match
  const normalized = network.toUpperCase().replace(/[^A-Z0-9]/g, '')
  const matchingKey = Object.keys(CRYPTO_NETWORK).find(
    key => key === normalized
  )
  
  if (matchingKey) {
    return EXPLORER_CONFIGS[CRYPTO_NETWORK[matchingKey as keyof typeof CRYPTO_NETWORK]]
  }
  
  return null
}

/**
 * Generate a blockchain explorer URL for a transaction
 * @param txHash - Transaction hash
 * @param network - Blockchain network
 * @returns Full URL to view transaction on explorer
 */
export const getTransactionExplorerUrl = (
  txHash: string | null | undefined,
  network: CryptoNetworkType | string | null | undefined
): string | null => {
  if (!txHash || !network) return null
  
  const config = getExplorerConfig(network)
  if (!config) return null
  
  return `${config.baseUrl}${config.txPath}${txHash}`
}

/**
 * Generate a blockchain explorer URL for an address/wallet
 * @param address - Wallet address
 * @param network - Blockchain network
 * @returns Full URL to view address on explorer
 */
export const getAddressExplorerUrl = (
  address: string | null | undefined,
  network: CryptoNetworkType | string | null | undefined
): string | null => {
  if (!address || !network) return null
  
  const config = getExplorerConfig(network)
  if (!config) return null
  
  return `${config.baseUrl}${config.addressPath}${address}`
}

/**
 * Generate a blockchain explorer URL for a token
 * @param tokenAddress - Token contract address
 * @param network - Blockchain network
 * @returns Full URL to view token on explorer
 */
export const getTokenExplorerUrl = (
  tokenAddress: string | null | undefined,
  network: CryptoNetworkType | string | null | undefined
): string | null => {
  if (!tokenAddress || !network) return null
  
  const config = getExplorerConfig(network)
  if (!config || !config.tokenPath) return null
  
  return `${config.baseUrl}${config.tokenPath}${tokenAddress}`
}

/**
 * Get the explorer name for a given network
 * @param network - Blockchain network
 * @returns Explorer name (e.g., "Etherscan", "BscScan")
 */
export const getExplorerName = (
  network: CryptoNetworkType | string | null | undefined
): string => {
  const config = getExplorerConfig(network)
  return config?.name || 'Explorer'
}

/**
 * Check if a network is supported
 * @param network - Blockchain network
 * @returns true if network is supported
 */
export const isNetworkSupported = (
  network: CryptoNetworkType | string | null | undefined
): boolean => {
  if (!network) return false
  return getExplorerConfig(network) !== null
}

/**
 * Get all supported networks
 * @returns Array of supported network names
 */
export const getSupportedNetworks = (): CRYPTO_NETWORK[] => {
  return Object.values(CRYPTO_NETWORK)
}

/**
 * Generate explorer URLs for a transaction with complete information
 * @param txHash - Transaction hash
 * @param network - Blockchain network
 * @param walletAddress - Optional wallet address
 * @param tokenAddress - Optional token contract address
 * @returns Object with all relevant explorer URLs and metadata
 */
export const getExplorerLinks = (
  txHash: string | null | undefined,
  network: CryptoNetworkType | string | null | undefined,
  walletAddress?: string | null,
  tokenAddress?: string | null
): {
  txUrl: string | null
  addressUrl: string | null
  tokenUrl: string | null
  explorerName: string
  isSupported: boolean
  network: CryptoNetworkType | null
} => {
  const config = getExplorerConfig(network)
  
  if (!config || !network) {
    return {
      txUrl: null,
      addressUrl: null,
      tokenUrl: null,
      explorerName: 'Explorer',
      isSupported: false,
      network: null,
    }
  }
  
  return {
    txUrl: txHash ? getTransactionExplorerUrl(txHash, network) : null,
    addressUrl: walletAddress ? getAddressExplorerUrl(walletAddress, network) : null,
    tokenUrl: tokenAddress ? getTokenExplorerUrl(tokenAddress, network) : null,
    explorerName: config.name,
    isSupported: true,
    network: network as CRYPTO_NETWORK,
  }
}

/**
 * Format transaction hash for display (truncate middle)
 * @param txHash - Transaction hash
 * @param prefixLength - Number of characters to show at start (default: 10)
 * @param suffixLength - Number of characters to show at end (default: 10)
 * @returns Formatted hash string
 */
export const formatTxHash = (
  txHash: string | null | undefined,
  prefixLength: number = 10,
  suffixLength: number = 10
): string => {
  if (!txHash) return ''
  if (txHash.length <= prefixLength + suffixLength) return txHash
  
  return `${txHash.slice(0, prefixLength)}...${txHash.slice(-suffixLength)}`
}

/**
 * Format wallet address for display (truncate middle)
 * @param address - Wallet address
 * @param prefixLength - Number of characters to show at start (default: 6)
 * @param suffixLength - Number of characters to show at end (default: 4)
 * @returns Formatted address string
 */
export const formatAddress = (
  address: string | null | undefined,
  prefixLength: number = 6,
  suffixLength: number = 4
): string => {
  if (!address) return ''
  if (address.length <= prefixLength + suffixLength) return address
  
  return `${address.slice(0, prefixLength)}...${address.slice(-suffixLength)}`
}

/**
 * Get network display name (formatted for UI)
 * @param network - Blockchain network
 * @returns Formatted network name
 */
export const getNetworkDisplayName = (
  network: CryptoNetworkType | string | null | undefined
): string => {
  if (!network) return 'Unknown Network'
  
  const displayNames: Partial<Record<CRYPTO_NETWORK, string>> = {
    [CRYPTO_NETWORK.BTC]: 'Bitcoin',
    [CRYPTO_NETWORK.ERC20]: 'Ethereum (ERC-20)',
    [CRYPTO_NETWORK.TRC20]: 'Tron (TRC-20)',
    [CRYPTO_NETWORK.BEP20]: 'BNB Smart Chain (BEP-20)',
    [CRYPTO_NETWORK.BSC]: 'BNB Smart Chain',
    [CRYPTO_NETWORK.SOLANA]: 'Solana',
    [CRYPTO_NETWORK.POLYGON]: 'Polygon',
    [CRYPTO_NETWORK.ARBITRUM]: 'Arbitrum',
    [CRYPTO_NETWORK.OPTIMISM]: 'Optimism',
    [CRYPTO_NETWORK.AVALANCHE]: 'Avalanche',
    [CRYPTO_NETWORK.FANTOM]: 'Fantom',
    [CRYPTO_NETWORK.CARDANO]: 'Cardano',
    [CRYPTO_NETWORK.POLKADOT]: 'Polkadot',
    [CRYPTO_NETWORK.COSMOS]: 'Cosmos',
    [CRYPTO_NETWORK.TERRA]: 'Terra',
    [CRYPTO_NETWORK.NEAR]: 'NEAR Protocol',
    [CRYPTO_NETWORK.HARMONY]: 'Harmony',
    [CRYPTO_NETWORK.MOONBEAM]: 'Moonbeam',
    [CRYPTO_NETWORK.CRONOS]: 'Cronos',
    [CRYPTO_NETWORK.KCC]: 'KCC',
    [CRYPTO_NETWORK.HECO]: 'HECO',
    [CRYPTO_NETWORK.XDAI]: 'Gnosis Chain',
    [CRYPTO_NETWORK.CELO]: 'Celo',
    [CRYPTO_NETWORK.ALGORAND]: 'Algorand',
    [CRYPTO_NETWORK.TEZOS]: 'Tezos',
    [CRYPTO_NETWORK.ELROND]: 'MultiversX (Elrond)',
    [CRYPTO_NETWORK.KLAYTN]: 'Klaytn',
    [CRYPTO_NETWORK.OKEX]: 'OKX Chain',
  }
  
  return displayNames[network as CRYPTO_NETWORK] || network.toString()
}

/**
 * Get network icon/color for UI display
 * @param network - Blockchain network
 * @returns Color class for Tailwind or hex color
 */
export const getNetworkColor = (
  network: CryptoNetworkType | string | null | undefined
): string => {
  if (!network) return 'bg-gray-500'
  
  const colors: Partial<Record<CRYPTO_NETWORK, string>> = {
    [CRYPTO_NETWORK.BTC]: 'bg-orange-500',
    [CRYPTO_NETWORK.ERC20]: 'bg-blue-600',
    [CRYPTO_NETWORK.TRC20]: 'bg-red-500',
    [CRYPTO_NETWORK.BEP20]: 'bg-yellow-500',
    [CRYPTO_NETWORK.BSC]: 'bg-yellow-500',
    [CRYPTO_NETWORK.SOLANA]: 'bg-purple-600',
    [CRYPTO_NETWORK.POLYGON]: 'bg-purple-500',
    [CRYPTO_NETWORK.ARBITRUM]: 'bg-blue-500',
    [CRYPTO_NETWORK.OPTIMISM]: 'bg-red-600',
    [CRYPTO_NETWORK.AVALANCHE]: 'bg-red-500',
    [CRYPTO_NETWORK.FANTOM]: 'bg-blue-700',
    [CRYPTO_NETWORK.CARDANO]: 'bg-blue-600',
    [CRYPTO_NETWORK.POLKADOT]: 'bg-pink-600',
    [CRYPTO_NETWORK.COSMOS]: 'bg-indigo-600',
    [CRYPTO_NETWORK.TERRA]: 'bg-blue-500',
    [CRYPTO_NETWORK.NEAR]: 'bg-black',
    [CRYPTO_NETWORK.HARMONY]: 'bg-teal-500',
    [CRYPTO_NETWORK.MOONBEAM]: 'bg-teal-400',
    [CRYPTO_NETWORK.CRONOS]: 'bg-blue-800',
    [CRYPTO_NETWORK.CELO]: 'bg-green-500',
  }
  
  return colors[network as CRYPTO_NETWORK] || 'bg-gray-500'
}

/**
 * Validate if a string looks like a valid transaction hash for a given network
 * @param txHash - Transaction hash to validate
 * @param network - Blockchain network
 * @returns true if format appears valid
 */
export const isValidTxHashFormat = (
  txHash: string | null | undefined,
  network: CryptoNetworkType | string | null | undefined
): boolean => {
  if (!txHash || !network) return false
  
  const networkKey = network.toString().toUpperCase()
  
  // EVM-based chains (Ethereum, BSC, Polygon, etc.)
  const evmNetworks = [
    'ERC20', 'BEP20', 'BSC', 'POLYGON', 'ARBITRUM', 'OPTIMISM',
    'AVALANCHE', 'FANTOM', 'HARMONY', 'MOONBEAM', 'CRONOS',
    'KCC', 'HECO', 'XDAI', 'CELO', 'KLAYTN', 'OKEX'
  ]
  
  if (evmNetworks.includes(networkKey)) {
    // EVM transaction hash: 0x followed by 64 hex characters
    return /^0x[a-fA-F0-9]{64}$/.test(txHash)
  }
  
  // Bitcoin
  if (networkKey === 'BTC') {
    // Bitcoin transaction hash: 64 hex characters
    return /^[a-fA-F0-9]{64}$/.test(txHash)
  }
  
  // Solana
  if (networkKey === 'SOLANA') {
    // Solana signature: base58 string, typically 87-88 characters
    return /^[1-9A-HJ-NP-Za-km-z]{87,88}$/.test(txHash)
  }
  
  // For other networks, just check if it's not empty
  return txHash.length > 0
}

/**
 * Validate if a string looks like a valid wallet address for a given network
 * @param address - Wallet address to validate
 * @param network - Blockchain network
 * @returns true if format appears valid
 */
export const isValidAddressFormat = (
  address: string | null | undefined,
  network: CryptoNetworkType | string | null | undefined
): boolean => {
  if (!address || !network) return false
  
  const networkKey = network.toString().toUpperCase()
  
  // EVM-based chains
  const evmNetworks = [
    'ERC20', 'BEP20', 'BSC', 'POLYGON', 'ARBITRUM', 'OPTIMISM',
    'AVALANCHE', 'FANTOM', 'HARMONY', 'MOONBEAM', 'CRONOS',
    'KCC', 'HECO', 'XDAI', 'CELO', 'KLAYTN', 'OKEX'
  ]
  
  if (evmNetworks.includes(networkKey)) {
    // EVM address: 0x followed by 40 hex characters
    return /^0x[a-fA-F0-9]{40}$/.test(address)
  }
  
  // Bitcoin
  if (networkKey === 'BTC') {
    // Bitcoin address formats (simplified)
    return /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(address) || // P2PKH/P2SH
      /^bc1[a-z0-9]{39,59}$/.test(address) // Bech32
  }
  
  // Solana
  if (networkKey === 'SOLANA') {
    // Solana address: base58 string, typically 32-44 characters
    return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address)
  }
  
  // Tron
  if (networkKey === 'TRC20') {
    // Tron address: starts with T, 34 characters
    return /^T[a-zA-Z0-9]{33}$/.test(address)
  }
  
  // For other networks, just check if it's not empty
  return address.length > 0
}

/**
 * Copy text to clipboard with fallback
 * @param text - Text to copy
 * @returns Promise that resolves when copied
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      document.body.appendChild(textArea)
      textArea.select()
      const successful = document.execCommand('copy')
      document.body.removeChild(textArea)
      return successful
    }
  } catch (err) {
    console.error('Failed to copy:', err)
    return false
  }
}

import type { Channel } from '@keypering/specs'
import { MAINNET_ID, TESTNET_ID, DEVNET_ID, RICH_NODE_MAINNET_INDEXER_URL, RICH_NODE_TESTNET_INDEXER_URL } from '../utils'
const networks = new Map<Channel.NetworkId, { name: string, url: string }>([
  [
    MAINNET_ID,
    {
      name: 'mainnet',
      url: RICH_NODE_MAINNET_INDEXER_URL,
    },
  ],
  [
    TESTNET_ID,
    {
      name: 'testnet',
      url: RICH_NODE_TESTNET_INDEXER_URL,
    },
  ],
  [
    DEVNET_ID,
    {
      name: 'devnet',
      url: RICH_NODE_MAINNET_INDEXER_URL,
    }
  ]
])

export default networks

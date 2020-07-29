import { MAINNET_ID, TESTNET_ID } from '../utils'
const networks = new Map([
  [MAINNET_ID, {
    name: 'mainnet',
    url: 'http://localhost:8114'
  }],
  [TESTNET_ID, {
    name: 'testnet',
    url: 'http://localhost:8114'
  }]
])

export default networks

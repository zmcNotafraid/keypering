import { RICH_NODE_MAINNET_INDEXER_URL, RICH_NODE_TESTNET_INDEXER_URL } from '../utils/const'

export const getCells = async (codeHash: string, lockArgs: string, network: 'ckb' | 'ckb_test') => {
  const payload = {
    id: 3,
    jsonrpc: '2.0',
    method: 'get_cells',
    params: [
      {
        script: {
          code_hash: codeHash,
          hash_type: 'type',
          args: lockArgs,
        },
        script_type: 'lock',
      },
      'asc',
      '0x3e8',
    ],
  }
  const body = JSON.stringify(payload, null, '  ')
  try {
    let res = await fetch(network === 'ckb' ? RICH_NODE_MAINNET_INDEXER_URL : RICH_NODE_TESTNET_INDEXER_URL, {
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/json',
      },
    })
    res = await res.json()

    return (res as any).result.objects
  } catch (error) {
    console.error('error', error)
  }
}

export default {
  getCells,
}

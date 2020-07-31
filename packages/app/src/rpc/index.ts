import fetch from 'node-fetch'
import { getSetting } from '../setting'
import { NetworkNotFoundException } from '../exception'

export const getCells = async (codeHash: string, lockArgs: string, networkId: string) => {
  const { networks } = getSetting()
  const indexerUrl = networks[networkId]?.url
  if (!indexerUrl) {
    throw new NetworkNotFoundException()
  }

  const payload = {
    id: 3,
    jsonrpc: '2.0',
    method: 'get_cells',
    params: [
      {
        script: {
          // eslint-disable-next-line
          code_hash: codeHash,
          // eslint-disable-next-line
          hash_type: 'type',
          args: lockArgs,
        },
        // eslint-disable-next-line
        script_type: 'lock',
      },
      'asc',
      '0x3e8',
    ],
  }
  const body = JSON.stringify(payload)
  try {
    let res = await fetch(indexerUrl, {
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

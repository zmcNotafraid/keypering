import { SECP256K1_SCRIPT } from '../../utils'

export const getCapacityByArgs = ({ args, indexerUrl }: { args: string; indexerUrl: string }) =>
  fetch(indexerUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: 1,
      jsonrpc: '2.0',
      method: 'get_cells_capacity',
      params: [
        {
          script: {
            code_hash: SECP256K1_SCRIPT.CODE_HASH,
            hash_type: SECP256K1_SCRIPT.HASH_TYPE,
            args,
          },
          script_type: 'lock',
        },
      ],
    }),
  })
    .then(res => res.json())
    .then(res => {
      if (res?.result?.capacity) {
        return BigInt(res.result.capacity)
      }
      throw new Error('Fail to get capacity')
    })
    .catch(err => {
      console.error(err)
      return null
    })

export default getCapacityByArgs

const CODE_HASH = '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8'
const HASH_TYPE = 'type'

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
          script: { code_hash: CODE_HASH, hash_type: HASH_TYPE, args },
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

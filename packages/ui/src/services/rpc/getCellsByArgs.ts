import { SECP256K1_SCRIPT } from '../../utils'

/* eslint-disable camelcase */
export interface ScriptObject {
  argss: string
  code_hash: string
  hash_type: string

}

export interface CellObject {
  block_number: string
  out_point: {
    index: string
    tx_hash: string
  }
  output: {
    capacity: string
    lock: ScriptObject
    type: ScriptObject | null
    tx_index: string
  }
  output_data: string
}

export const getCellsByArgs = (args: string, indexerUrl: string, lastCursor?: string) => {
  if (args.length !== 42) {
    throw new Error('Invalid args')
  }

  return fetch(indexerUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: 1,
      jsonrpc: '2.0',
      method: 'get_cells',
      params: [
        {
          script: {
            code_hash: SECP256K1_SCRIPT.CODE_HASH,
            hash_type: SECP256K1_SCRIPT.HASH_TYPE,
            args,
          },
          script_type: 'lock',
        },
        'desc',
        '0x64',
        lastCursor,
      ],
    }),
  })
    .then(res => res.json())
    .then(res => {
      if (res.result) {
        return res.result as { last_cursor: string, objects: CellObject[] }
      }
      throw new Error('Fail to fetch cells')
    })
}
export default getCellsByArgs

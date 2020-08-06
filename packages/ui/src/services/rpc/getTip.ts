/* eslint-disable camelcase */
export const getTip = (indexerUrl: string) => fetch(indexerUrl, {

  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id: 2,
    jsonrpc: '2.0',
    method: 'get_tip',
  }),
})
  .then(res => res.json())
  .then(res => {
    if (res.result) {
      return res.result as { block_hash: string, block_number: string }
    }
    throw new Error('Fail to get tip')
  })
  .catch(err => {
    console.error(err)
    return null
  })

export default getTip

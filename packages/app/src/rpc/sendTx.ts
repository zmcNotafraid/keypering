import fetch from 'node-fetch'
import CKB from '@nervosnetwork/ckb-sdk-core'
export const sendTx = (url: string, tx: CKBComponents.Transaction) => {
  const ckb = new CKB()

  const body = {
    id: 1,
    jsonrpc: '2.0',
    method: 'send_transaction',
    params: [
      ckb.rpc.paramsFormatter.toRawTransaction(tx)
    ]
  }

  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body)
  })
    .then(res => res.json())
    .then(res => {
      if (res.error) {
        throw new Error(JSON.stringify(res.error))
      }
      return res.result
    })
}

export default sendTx

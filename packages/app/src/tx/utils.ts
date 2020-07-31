import fetch from 'node-fetch'
import CKB from '@nervosnetwork/ckb-sdk-core'
import { getSetting } from '../setting'
import systemScripts from '../setting/scripts'
import { MAINNET_ID, shannonToCkb } from '../utils'

interface TxCell {
  addr: string
  lockName: string
  type: CKBComponents.Script | null
  data: string | null
  amount: string
}

export interface TxInfo {
  referer: string
  meta: string
  tx: {
    hash: string
    inputs: TxCell[]
    outputs: TxCell[]
  }
}

interface GetTxCellInfoParams extends Pick<ReturnType<typeof getSetting>, 'locks'> {
  cell: CKBComponents.CellOutput
  data: string | null
}

export const getAddrByScript = (lock: CKBComponents.Script) => {
  const ckb = new CKB()
  const { networkId } = getSetting()

  const prefix = networkId === MAINNET_ID ?
    ckb.utils.AddressPrefix.Mainnet :
    ckb.utils.AddressPrefix.Testnet

  const secp256k1Script = systemScripts.get('secp256k1')
  const isSecp256k1Lock = lock.codeHash === secp256k1Script?.codeHash && lock.hashType === secp256k1Script?.hashType
  if (isSecp256k1Lock) {
    return ckb.utils.bech32Address(lock.args, {
      prefix,
      type: ckb.utils.AddressType.HashIdx,
      codeHashOrCodeHashIndex: '0x00',
    })
  } else {
    return ckb.utils.fullPayloadToAddress({
      args: lock.args,
      prefix,
      type: lock.hashType === 'data' ?
        ckb.utils.AddressType.DataCodeHash :
        ckb.utils.AddressType.TypeCodeHash,
      codeHash: lock.codeHash,
    })
  }
}

export const getTxCellInfo = ({ cell, data, locks }: GetTxCellInfoParams): TxCell => {
  const { capacity, lock, type = null } = cell
  const addr = getAddrByScript(lock)
  const lockName = locks[`${lock.codeHash}:${lock.hashType}`]?.name ?? 'Unknown'
  return {
    addr,
    lockName,
    type,
    data: data === '0x'
      ? null
      : data,
    amount: `${shannonToCkb(BigInt(capacity).toString())} CKB`,
  }
}

export const getOutputsOfInputs = async ({
  inputs,
  indexerUrl,
}: {
  inputs: CKBComponents.CellInput[]
  indexerUrl: string
}): Promise<{ outputs: CKBComponents.CellOutput[]; data: string[] }> => {
  const rpcUrl = [...indexerUrl.split('/').slice(0, -1), 'rpc'].join('/')
  const ckb = new CKB(rpcUrl)
  const batchRequest = ckb.rpc.createBatchRequest()
  inputs.forEach(input => {
    batchRequest.add('getTransaction', input.previousOutput!.txHash)
  })
  // axios cannot handle https
  const payload = inputs.map((input, i) => {
    return {
      id: i,
      jsonrpc: '2.0',
      method: 'get_transaction',
      params: [input.previousOutput!.txHash]
    }
  })

  const inputCellTxList: CKBComponents.Transaction[] = await fetch(rpcUrl, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': "application/json"
    }
  })
    .then(res => res.json())
    .then(resList => resList.map((res: any) => res.result.transaction))
    .then(txList => txList.map(ckb.rpc.resultFormatter.toTransaction))
  const outputs = inputCellTxList.map((tx, i) => tx.outputs[i])
  const data = inputCellTxList.map((tx, i) => tx.outputsData[i] ?? '')
  return { outputs, data }
}

export const getTxProfile = async (
  tx: CKBComponents.Transaction,
  referer: string,
  description: string
): Promise<TxInfo> => {
  const meta = description
  const { locks, networks, networkId } = getSetting()
  const indexerUrl = networks[networkId]?.url
  const outputsOfInputs = await getOutputsOfInputs({ inputs: tx.inputs, indexerUrl })
  const inputs = outputsOfInputs.outputs.map((output, i) =>
    getTxCellInfo({ cell: output, data: outputsOfInputs.data[i], locks })
  )
  const outputs = tx.outputs.map((output, i) => getTxCellInfo({ cell: output, data: tx.outputsData[i] ?? '', locks }))

  return { meta, referer, tx: { hash: tx.hash, inputs, outputs } }
}

export default undefined

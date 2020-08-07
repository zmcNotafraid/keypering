import type { KeyperingAgency } from '@keypering/specs'
import CKB from '@nervosnetwork/ckb-sdk-core'
import { requestAuth } from '../auth'
import { getWalletIndex } from '../wallet'
import { getAddresses } from '../address'
import { requestSignTx, requestSendTx } from '../tx'
import { getSetting } from '../setting'
import { networksToRpcUrl } from '../utils/transformer'

export const handleAuth = async (_params: KeyperingAgency.Auth.Params['params'], origin: string, url: string) => {
  const token = await requestAuth(origin, url)
  return { token }
}

export const handleSign = async (params: KeyperingAgency.SignTransaction.Params['params'], url: string) => {
  const tx = await requestSignTx({
    tx: params.tx as CKBComponents.Transaction,
    lockHash: params.lockHash,
    description: params.description as string,
    referer: url,
    signConfig: params.inputSignConfig,
  })
  return { tx }
}

export const handleSend = async (params: KeyperingAgency.SendTransaction.Params['params'], url: string) => {
  const txHash = await requestSendTx({
    tx: params.tx as CKBComponents.Transaction,
    description: params.description as string,
    referer: url,
  })

  return { txHash }
}

export const handleSignAndSend = async (params: KeyperingAgency.SignAndSendTransaction.Params['params'], url: string) => {
  const tx: any = await requestSignTx({
    lockHash: params.lockHash,
    tx: params.tx as CKBComponents.Transaction,
    description: params.description as string,
    referer: url,
    signConfig: params.inputSignConfig,
  })
  if (tx) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { hash, ...txToSend } = tx
    const rpcUrl = networksToRpcUrl(getSetting())
    const ckb = new CKB(rpcUrl)
    const txHash = await ckb.rpc.sendTransaction(txToSend)
    return { txHash, tx }
  }
  return tx
}

export const handleQueryAddresses = async () => {
  const { current } = getWalletIndex()
  const setting = getSetting()
  const addresses = await getAddresses(current, setting.networkId)
  return {
    userId: current,
    addresses
  }
}

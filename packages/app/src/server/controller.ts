import type { KeyperingAgency } from '@keypering/specs'
import { requestAuth } from '../auth'
import { getWalletIndex } from '../wallet'
import { getAddrList } from '../address'
import { requestSignTx, requestSendTx } from '../tx'
import { getSetting } from '../setting'
import { networksToRpcUrl } from '../utils/transformer'
import sendTx from '../rpc/sendTx'

export const handleAuth = async (_params: KeyperingAgency.Auth.Params['params'], origin: string, url: string) => {
  const token = await requestAuth(origin, url)
  return { token }
}

export const handleSign = async (params: KeyperingAgency.SignTransaction.Params['params'], url: string) => {
  const tx = await requestSignTx({
    tx: params.tx as CKBComponents.Transaction,
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
    tx: params.tx as CKBComponents.Transaction,
    description: params.description as string,
    referer: url,
    signConfig: params.inputSignConfig,
  })
  const rpcUrl = networksToRpcUrl(getSetting())
  if (tx) {
    delete tx.hash
    const txHash = sendTx(rpcUrl, tx as CKBComponents.Transaction)
    return { txHash }
  }
  return tx
}

export const handleQueryAddresses = async () => {
  const { current } = getWalletIndex()
  const addrList = await getAddrList(current, 'ckb')
  return {
    userId: current,
    addresses: addrList
  }
}
import type { KeyperingAgency } from '@keypering/specs'
import { requestAuth } from '../auth'
import { requestSignTx } from '../tx'

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

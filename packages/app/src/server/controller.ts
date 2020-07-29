import type { KeyperingAgency } from '@keypering/specs'
import { requestAuth } from '../auth'
import { requestSignTx } from '../tx'

export const handleAuth = async (_params: KeyperingAgency.Auth.Params['params'], origin: string, url: string) => {
  const token = await requestAuth(origin, url)
  return { token }
}

export const handleSign = async (params: KeyperingAgency.SignTransaction.Params['params'], url: string) => {
  const result = await requestSignTx({
    tx: params.tx as any,
    origin: url
  })
  return { result }
}

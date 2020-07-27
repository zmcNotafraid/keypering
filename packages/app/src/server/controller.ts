import type { KeyperingAgency } from '@keypering/specs'
import { requestAuth } from '../auth'

export const handleAuth = async (_params: KeyperingAgency.Auth.Params, origin: string, url: string) => {
  const token = await requestAuth(origin, url)
  return { token  }
}

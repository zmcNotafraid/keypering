import type { IncomingHttpHeaders } from 'http'
import { isAuthedByCurrentWallet } from '../auth'
import { InvalidTokenException } from '../exception'
export default (headers: IncomingHttpHeaders) => {
  const token = headers?.authorization?.slice(7)
  if (!token || !isAuthedByCurrentWallet(token)) {
    throw new InvalidTokenException()
  }
}

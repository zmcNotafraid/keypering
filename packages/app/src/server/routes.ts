import type { IncomingHttpHeaders } from 'http'
import { KeyperingAgency } from '@keypering/specs'
import { handleAuth, handleSign, handleSend, handleSignAndSend, handleQueryAddresses } from './controller'
import { MethodNotFoundException } from '../exception'
import useGuard from './useGuard'

// TODO: overload types

const routes = async (method: KeyperingAgency.Method, params: any, headers: IncomingHttpHeaders) => {
  if (method !== 'auth') {
    useGuard(headers)
  }
  const { origin = '', referer } = headers
  switch (method) {
    case 'auth': {
      return handleAuth(params, origin, referer || origin)
    }
    case 'query_addresses': {
      return handleQueryAddresses()
    }
    case 'sign_transaction': {
      return handleSign(params, referer || origin)
    }
    case 'send_transaction': {
      return handleSend(params, referer || origin)
    }
    case 'sign_and_send_transaction': {
      return handleSignAndSend(params, referer || origin)
    }
    default: {
      throw new MethodNotFoundException(method || 'undefined')
    }
  }
}

export default routes

import type { IncomingHttpHeaders } from 'http'
import { KeyperingAgency } from '@keypering/specs'
import { handleAuth, handleSign } from './controller'
import { MethodNotFoundException } from '../exception'
import useGuard from './useGuard'

// TODO: overload types

const routes = async (method: KeyperingAgency.Method, params: any, headers: IncomingHttpHeaders) => {
  if (method !== 'auth') {
    useGuard(headers)
  }
  switch (method) {
    case 'auth': {
      return handleAuth(params, headers.origin ?? '', headers.referer ?? '')
    }
    case 'query_addresses': {
      return params
    }
    case 'sign_transaction': {
      return handleSign(params, headers.referer ?? '')
    }
    case 'send_transaction': {
      return params
    }
    case 'sign_and_send_transaction': {
      return params
    }
    default: {
      throw new MethodNotFoundException(method || 'undefined')
    }
  }
}

export default routes

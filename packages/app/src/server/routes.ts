import { KeyperingAgency } from '@keypering/specs'
import { handleAuth, handleSign } from './controller'
import { MethodNotFoundException } from '../exception'

interface Options {
  origin: string
  url: string

}

// TODO: overload types

const routes = async (method: KeyperingAgency.Method, params: any, { origin, url }: Options) => {
  switch (method) {
    case 'auth': {
      return handleAuth(params, origin, url)
    }
    case 'query_addresses': {
      return params
    }
    case 'sign_transaction': {
      return handleSign(params, url)
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

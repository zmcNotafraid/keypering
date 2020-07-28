import { KeyperingAgency } from '@keypering/specs'
import { handleAuth} from './controller'
import { MethodNotFoundException } from '../exception'

interface Options {
  origin: string
  url: string

}

export default async (method: KeyperingAgency.Method, params: any, { origin, url }: Options) => {
  switch (method) {
    case 'auth': {
      return handleAuth(params, origin, url)
    }
    case 'query_addresses': {
      return params
    }
    case 'sign_transaction': {
      return params
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


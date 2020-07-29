export enum Code {
  Rejected = 1001,
  InvalidToken,
  RemoteError,
  UnknownError,
}
export enum Method {
  Auth = 'auth',
  QueryAddresses = 'query_addresses',
  SignTransaction = 'sign_transaction',
  SendTransaction = 'send_transaction',
  SignAndSendTransactoin = 'sign_and_send_transaction',
}

export interface ParamsBase<M = Method, P = unknown> {
  id: number
  jsonrpc: '2.0'
  method: M
  params: P
}

export interface SuccessResponse<R = unknown> {
  id: number
  jsonrpc: '2.0'
  result: R
}

export interface ErrorResponse {
  id: number
  jsonrpc: '2.0'
  error: Error
}

export type ResponseBase<R> = SuccessResponse<R> | ErrorResponse

export namespace Auth {
  export type Params = ParamsBase<Method.Auth, { description?: string }>
  export type Response = ResponseBase<{ token: string }>
}

export namespace QueryAddresses {
  export interface Address {
    address: string
    lockHash: string
    lockScript: {
      codeHash: string
      hashType: string
      args: string
    }
    publicKey: string
    lockScriptMeta: {
      name: string
      cellDeps: {
        outPoint: {
          txHash: string
          index: string
        }
      }[]
      headerDeps: string[]
    }
  }
  export type Params = ParamsBase<Method.QueryAddresses, unknown>
  export type Response = ResponseBase<{
    token: string
    userId: string
    addresses: Address[]
  }>
}

export namespace SignTransaction {
  export type Transaction = unknown
  export type InputSignConfig = {
    index: number
    length: number
  } | null
  export type Params = ParamsBase<
    Method.SignTransaction,
    {
      tx: Transaction
      lockHash: string
      description: string
      inputSignConfig?: InputSignConfig
    }
  >

  export type Response = ResponseBase<{ token: string; tx: Transaction }>
}

export namespace SendTransaction {
  export type Transaction = unknown

  export type Params = ParamsBase<Method.SendTransaction, { description: string; tx: Transaction }>
  export type Response = ResponseBase<{ token: string; txHash: string }>
}

export namespace SignAndSendTransaction {
  export type Transaction = unknown
  export type Params = ParamsBase<
    Method.SignAndSendTransactoin,
    {
      tx: Transaction
      lockHash: string
      description: string
      inputSignConfig: {
        index: number
        length: number
      }
    }
  >

  export type Response = ResponseBase<{
    token: string
    tx: Transaction
    txHash: string
  }>
}

export declare namespace API {
  interface JsonRpcRequest<RequestParams> {
    id: string
    jsonrpc: string
    method: string
    params: RequestParams
  }
  enum ErrorCode {
    Rejected = 1,
    TokenInvalid
  }

  interface JsonRpcResponseError<C = ErrorCode> {
    code: C
    message: string
  }

  interface JsonRpcResponse<ResponseResult, ResponseError> {
    id: string
    jsonrpc: string
    result?: ResponseResult
    error?: ResponseError
  }

  // auth
  interface AuthParams {
    url: string
    description: string
  }

  interface AuthResult {
    token: string
  }

  type AuthError = JsonRpcResponseError<typeof ErrorCode.Rejected>
  type AuthRequest = JsonRpcRequest<AuthParams>
  type AuthResponse = JsonRpcResponse<AuthResult, AuthError>

  type FnAuth = (request: AuthRequest) => Promise<AuthResponse>

  // query_addresses
  interface QueryAddressesParams {
    token: string
  }

  type Hash256 = string
  type ScriptHashType = "data" | "type"
  type Bytes = string
  type Uint64 = string

  interface Script {
    codeHash: Hash256
    hashType: ScriptHashType
    args: Bytes
  }

  type DepType = "code" | "depGroup"

  interface OutPoint {
    txHash: Hash256
    index: string
  }

  interface CellDep {
    outPoint: OutPoint | null
    depType: DepType
  }

  interface LockScriptMeta {
    name: string
    cellDeps: CellDep[]
    headerDeps?: Hash256[]
  }

  interface AddressInfo {
    address: string
    lockHash: string
    lockScriptMeta: LockScriptMeta
    lockScript: Script
  }

  interface QueryAddressesResult {
    addresses: AddressInfo[]
  }

  type QueryAddressesError = JsonRpcResponseError
  type QueryAddressesRequest = JsonRpcRequest<QueryAddressesParams>

  type QueryAddressesResponse = JsonRpcResponse<QueryAddressesResult, QueryAddressesError>
  type FnQueryAddresses = (request: QueryAddressesRequest) => Promise<QueryAddressesResponse>

  // query_live_cells

  interface QueryLiveCellsParams {
    token: string
    lockHash: string
    withData?: boolean
  }

  interface CellOutput {
    capacity: string
    lock: Script
    type: Script | null
    outputDataLength: Uint64
  }

  interface CellCreatedBy {
    blockNumber: Uint64
    index: Uint64
    txHash: Hash256
  }

  interface CellData {
    content: string
    hash: Hash256
  }

  interface LiveCell {
    cellOutput: CellOutput
    cellbase: boolean
    createdBy: CellCreatedBy
    outputDataLen: Uint64
    data?: CellData
  }

  interface QueryLiveCellsResult {
    liveCells: LiveCell[]
  }

  type QueryLiveCellsError = JsonRpcResponseError
  type QueryLiveCellsRequest = JsonRpcRequest<QueryLiveCellsParams>
  type QueryLiveCellsResponse = JsonRpcResponse<QueryLiveCellsResult, QueryLiveCellsError>
  type FnQueryLiveCells = (request: QueryLiveCellsRequest) => Promise<QueryLiveCellsResponse>

  // sign_send
  interface SignConfig {
    index: number
    length: number
  }

  type Transaction = any
  type SignedTransaction = any

  interface SignSendParams {
    token: string
    description: string
    tx: Transaction
    lockHash: Hash256
    config?: SignConfig
  }

  interface SignSendResult {
    tx: SignedTransaction
    txHash: Hash256
  }

  type SignSendError = JsonRpcResponseError
  type SignSendRequest = JsonRpcRequest<SignSendParams>
  type SignSendResponse = JsonRpcResponse<SignSendRequest, SignSendError>
  type FnSignSend = (request: SignSendRequest) => Promise<SignSendResponse>
}

export declare namespace Channel {
  enum Code {
    Success = 0,
    Error = 1
  }
  type ChannelName =
    | 'create-wallet'
    | 'select-wallet'
    | 'delete-wallet'
    | 'update-wallet'
    | 'get-mnemonic'
    | 'get-setting'
    | 'update-setting'
    | 'get-wallet-index'
    | 'get-tx-list'
    | 'get-addr-list'
    | 'get-auth-list'
    | 'submit-password'

  // eslint-disable-next-line
  type SuccessResponse<T = any> = {
    code: Code.Success,
    result: T
  }
  type ErrorResponse = {
    code: Code.Error,
    message: string
  }

  // Wallet
  interface WalletProfile {
    name: string
    id: string
    xpub: string
  }

  namespace GetWalletIndex {

    type Response = SuccessResponse<{ current: string, wallets: WalletProfile[] }> | ErrorResponse
  }

  namespace CreateWallet {
    interface Params {
      name: string
      mnemonic: string
      password: string
    }
    type Response = SuccessResponse<boolean> | ErrorResponse
  }

  namespace DeleteWallet {
    interface Params {
      id: string
      password: string
    }

    type Response = SuccessResponse<boolean> | ErrorResponse
  }

  namespace SelectWallet {
    interface Params {
      id: string
    }
    type Response = SuccessResponse<boolean> | ErrorResponse
  }

  namespace UpdateWallet {
    interface Params {
      id: string
      name: string
    }

    type Response = SuccessResponse<boolean> | ErrorResponse
  }
  namespace GetMnemonic {
    type Response = SuccessResponse<string> | ErrorResponse
  }

  // Setting
  interface Setting {
    locks: {
      [id: string]: {
        name: string
        enabled: boolean
      }
    },

    networks: {
      [id: string]: {
        name: string
        url: string
        enabled: boolean
      }
    }
  }

  namespace GetSetting {
    type Response = SuccessResponse<Setting> | ErrorResponse
  }

  namespace UpdateSetting {
    type Params = Setting
    type Response = SuccessResponse<boolean> | ErrorResponse
  }

}

declare namespace KeyperingAgency {
  enum Method {
    Auth = 'auth',
    QueryAddresses = 'query_addresses',
    SignTransaction = 'sign_transaction',
    SendTransaction = 'send_transaction',
    SignAndSendTransactoin = 'sign_and_send_transaction'
  }
  enum Code {
    Rejected = 1001,
    InvalidToken,
    RemoteError,

  }
  interface ParamsBase<M = Method, P = unknown> {
    id: number
    jsonrpc: '2.0'
    method: M
    params: P
  }

  interface SuccessResponse<R = unknown> {
    id: number
    jsonrpc: '2.0',
    result: R
  }

  interface ErrorResponse {
    id: number
    jsonrpc: '2.0'
    error: Error
  }

  type ResponseBase<R> = SuccessResponse<R> | ErrorResponse

  namespace Auth {
    type Params = ParamsBase<Method.Auth, { description?: string }>
    type Response = ResponseBase<{ token: string }>
  }

  namespace QueryAddresses {
    interface Address {
      address: string
      lockHash: string
      lockScript: {
        codeHash: string
        hashType: string
        args: string
      },
      publicKey: string
      lockScriptMeta: {
        name: string
        cellDeps: {
          outPoint: {
            txHash: string, index: string
          }
        }[],
        headerDeps: string[]
      }
    }
    type Params = ParamsBase<Method.QueryAddresses, unknown>
    type Response = ResponseBase<{
      token: string,
      userId: string,
      addresses: Address[]
    }>
  }

  namespace SignTransaction {
    type Transaction = unknown
    type Params = ParamsBase<Method.SignTransaction, {
      tx: Transaction
      lockHash: string
      description: string
      inputSignConfig: {
        index: number
        length: number
      }
    }>

    type Response = ResponseBase<{ token: string, tx: Transaction }>
  }

  namespace SendTransaction {
    type Transaction = unknown

    type Params = ParamsBase<Method.SendTransaction, { description: string, tx: Transaction }>
    type Response = ResponseBase<{ token: string, txHash: string }>
  }

  namespace SignAndSendTransaction {
    type Transaction = unknown
    type Params = ParamsBase<Method.SignAndSendTransactoin, {
      tx: Transaction
      lockHash: string
      description: string
      inputSignConfig: {
        index: number
        length: number
      }
    }>

    type Response = ResponseBase<{
      token: string
      tx: Transaction
      txHash: string
    }>

  }
}

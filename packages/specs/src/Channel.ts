export enum Code {
  Success = 0,
  Error = 1,
}

export enum ChannelName {
  CreateWallet = 'create-wallet',
  ImportKeystore = 'import-keystore',
  SelectWallet = 'select-wallet',
  DeleteWallet = 'delete-wallet',
  UpdateWallet = 'update-wallet',
  BackupWallet = 'backup-wallet',
  CheckCurrentPassword = 'check-current-password',
  GetMnemonic = 'get-mnemonic',
  GetSetting = 'get-setting',
  UpdateSetting = 'update-setting',
  UpdateScriptsDir = 'update-scripts-dir',
  GetWalletIndex = 'get-wallet-index',
  GetTxList = 'get-tx-list',
  RequestSign = 'request-sign',
  GetAddrList = 'get-addr-list',
  GetAuthList = 'get-auth-list',
  DeleteAuth = 'delete-auth',
  SubmitPassword = 'submit-password',
  OpenInBrowser = 'open-in-browser',
}

export type SuccessResponse<T = any> = {
  code: Code.Success
  result: T
}
export type ErrorResponse = {
  code: Code.Error
  message: string
}

// Wallet
export interface WalletProfile {
  name: string
  id: string
  xpub: string
}

export namespace GetWalletIndex {
  export type Response = SuccessResponse<{ current: string; wallets: WalletProfile[] }> | ErrorResponse
}

export namespace CreateWallet {
  export interface Params {
    name: string
    mnemonic: string
    password: string
  }
  export type Response = SuccessResponse<boolean> | ErrorResponse
}

export namespace ImportKeystore {
  export interface Params {
    name: string
    keystorePath: string
    password: string
  }
  export type Response = SuccessResponse<boolean> | ErrorResponse
}

export namespace DeleteWallet {
  export type Response = SuccessResponse<boolean> | ErrorResponse
}

export namespace SelectWallet {
  export interface Params {
    id: string
  }
  export type Response = SuccessResponse<boolean> | ErrorResponse
}

export namespace UpdateWallet {
  export interface Params {
    id: string
    name: string
  }

  export type Response = SuccessResponse<boolean> | ErrorResponse
}

export namespace BackupWallet {
  export type Response = SuccessResponse<boolean> | ErrorResponse
}

export namespace CheckCurrentPassword {
  export interface Params {
    password: string
  }

  export type Response = SuccessResponse<boolean> | ErrorResponse
}

export namespace SubmitPassword {
  export interface Params {
    currentPassword: string
    newPassword: string
  }

  export type Response = SuccessResponse<boolean> | ErrorResponse
}

export namespace GetMnemonic {
  export type Response = SuccessResponse<string> | ErrorResponse
}

// Address
export interface Address {
  tag: string
  address: string
  free: number
  inUse: number
}

export namespace GetAddrList {
  export type Response = SuccessResponse<Address[]> | ErrorResponse
}

// Setting
export interface Setting {
  locks: {
    // id: code hash : hash type
    [id: string]: {
      name: string
      enabled: boolean
      system: boolean
    }
  }

  networks: {
    [id: string]: {
      name: string
      url: string
    }
  }
  networkId: string
}

export namespace GetSetting {
  export type Response = SuccessResponse<Setting> | ErrorResponse
}

export namespace UpdateSetting {
  export interface LocksParams {
    lockIds: string[]
  }
  export interface NetworkParams {
    networkId: string
  }
  export type Params = LocksParams | NetworkParams
  export type Response = SuccessResponse<boolean> | ErrorResponse
}

export namespace GetAuthList {
  export interface AuthProfile {
    url: string
    time: string
  }

  export type Response = SuccessResponse<AuthProfile[]> | ErrorResponse
}

export namespace DeleteAuth {
  export interface Params {
    url: string
  }

  export type Response = SuccessResponse<boolean> | ErrorResponse
}

export namespace GetTxList {
  export interface TxProfile {
    hash: string
    referer: string
    meta: string
    isApproved: boolean
    time: string
  }

  export type Response = SuccessResponse<TxProfile[]> | ErrorResponse
}

export namespace RequestSign {
  export interface Params {
    tx: any
  }
  export type Response = SuccessResponse<{ tx: any; token?: string }> | ErrorResponse
}

export namespace OpenInBrowser {
  export interface Params {
    url: string
  }
  export type Response = SuccessResponse<boolean> | ErrorResponse
}

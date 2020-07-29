import { KeyperingAgency } from '@keypering/specs'

export class UnsupportedCipherException extends Error {
  constructor() {
    super(`Unsupported cipher`)
  }
}

export class IncorrectPasswordException extends Error {
  constructor() {
    super(`Password is incorrect`)
  }
}

export class InvalidKeystoreException extends Error {
  constructor() {
    super(`Keystore is invalid`)
  }
}

export class InvalidMnemonicException extends Error {
  constructor() {
    super(`Mnemonic is invalid`)
  }
}

export class WalletNotFoundException extends Error {
  constructor() {
    super(`Wallet not found`)
  }
}

export class CurrentWalletNotSetException extends Error {
  constructor() {
    super(`Current wallet is not set`)
  }
}

export class ParamsRequiredException extends Error {
  constructor(fieldName: string) {
    super(`${fieldName} is required`)
  }
}

export class AuthNotFoundException extends Error {
  constructor() {
    super(`Authentication is not found`)
  }
}

export class MethodNotFoundException extends Error {
  code = 404
  constructor(method: string) {
    super(`Method ${method} is not found`)
  }
}
export class InvalidJsonRpcRequestException extends Error {
  code = 400
  constructor() {
    super(`Invalid jsonrpc request`)
  }
}

export class AuthRejected extends Error {
  code = KeyperingAgency.Code.Rejected
  constructor() {
    super(`Authentication request is rejected`)
  }
}

export class RequestRejected extends Error {
  code = KeyperingAgency.Code.Rejected
  constructor() {
    super(`Request of signing transaction is rejected`)
  }
}

export class FileNotFoundException extends Error {
  constructor() {
    super(`File is not found`)
  }
}

export class NetworkNotFoundException extends Error {
  constructor() {
    super(`Network is not found`)
  }
}

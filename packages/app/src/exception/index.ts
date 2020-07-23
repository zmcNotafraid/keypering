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

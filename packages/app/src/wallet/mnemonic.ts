import { Keychain } from './Keychain'
import { getKeystoreFromXPrv } from './keystore'
import { InvalidMnemonicException } from '../exception'
import { generateMnemonic, mnemonicToSeedSync, validateMnemonic } from 'bip39'

const SEED_SIZE = 128
export const getMnemonic = () => generateMnemonic(SEED_SIZE)
export const getKeystoreFromMnemonic = (params: { mnemonic: string, password: string }) => {
  if (!validateMnemonic(params.mnemonic)) {
    throw new InvalidMnemonicException
  }

  const seed = mnemonicToSeedSync(params.mnemonic)
  const keychain = Keychain.fromSeed(seed)
  if (!keychain.privateKey) {
    throw new InvalidMnemonicException
  }

  const xPrv = Buffer.concat([keychain.privateKey, keychain.chainCode])
  const keystore = getKeystoreFromXPrv(xPrv, params.password)
  return keystore
}

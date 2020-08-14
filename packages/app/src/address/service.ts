import { Channel, API } from '@keypering/specs'
import CKB from '@nervosnetwork/ckb-sdk-core'
import { getWalletPublicKey, getRemoteAddressCapacity, getLocalAddressCapacity } from './utils'
import { getSetting } from '../setting'

export const getAddrList = (id: string, network: Channel.NetworkId): Channel.Address[] => {
  getRemoteAddressCapacity(id, network)
  return getLocalAddressCapacity(id, network)
}

export const getAddresses = async (id: string, network: Channel.NetworkId): Promise<API.AddressInfo[]> => {
  const {locks} = getSetting()
  const ckb = new CKB()
  const { AddressPrefix, pubkeyToAddress, scriptToHash } = ckb.utils
  const prefix = network === 'ckb' ? AddressPrefix.Mainnet : AddressPrefix.Testnet
  const publicKey = getWalletPublicKey(id)

  const addresses = Object.keys(locks).map(key => {
    let lock = locks[key].ins
    let args = lock.script(publicKey).args
    let lockScript = {
      codeHash: lock.codeHash, args, hashType: lock.hashType
    }
    return {
      address: pubkeyToAddress(publicKey, { prefix } as any),
      lockScript,
      lockHash: scriptToHash(lockScript),
      publicKey,
      lockScriptMeta: {
        name: lock.name,
        cellDeps: lock.deps(),
        headerDeps: lock.headers ? lock.headers() : [],
      },
    }
  });
  return addresses
}

export default { getAddrList, getAddresses }

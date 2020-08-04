import { Channel, API } from '@keypering/specs'
import CKB from '@nervosnetwork/ckb-sdk-core'
import { getWalletIndex } from '../wallet'
import {
  ANYONE_CAN_PAY_CODE_HASH,
  SECP256K1_BLAKE160_CODE_HASH,
  SECP256K1_BLAKE160_MAINNET_TX_HASH,
  SECP256K1_BLAKE160_TESTNET_TX_HASH,
  ANYONE_CAN_PAY_TX_HASH,
} from '../utils/const'
import { getCells } from '../rpc'

const parseCells = (cells = [] as any[]) => {
  const inuse = cells
    .filter(cell => cell.output_data !== '0x')
    .map(cell => parseInt(cell.output.capacity))
    .reduce((acc, curr) => acc + curr, 0)
    .toString()

  const free = cells
    .filter(cell => cell.output_data === '0x')
    .map(cell => parseInt(cell.output.capacity))
    .reduce((acc, curr) => acc + curr, 0)
    .toString()

  return {
    inuse,
    free,
  }
}

export const getAddrList = async (id: string, network: Channel.NetworkId): Promise<Channel.Address[]> => {
  const { wallets } = getWalletIndex()
  const currentWallets = wallets.filter(wallet => wallet.id === id)
  if (!currentWallets) {
    return []
  }
  const ckb = new CKB()
  const { AddressPrefix, AddressType, blake160, fullPayloadToAddress, pubkeyToAddress } = ckb.utils
  const prefix = network === 'ckb' ? AddressPrefix.Mainnet : AddressPrefix.Testnet
  const publicKey = '0x' + currentWallets[0].xpub.slice(0, 66)
  const args = '0x' + blake160(publicKey, 'hex')
  const secp256k1Cells = parseCells(await getCells(SECP256K1_BLAKE160_CODE_HASH, args, network))
  const anyoneCanPayCells = parseCells(await getCells(ANYONE_CAN_PAY_CODE_HASH, args, network))

  let list: Channel.Address[] = [
    {
      tag: 'Secp256k1',
      address: pubkeyToAddress(publicKey, { prefix } as any),
      free: secp256k1Cells.free,
      inUse: secp256k1Cells.inuse,
    },
  ]
  if (network === 'ckb_test') {
    list.push({
      tag: 'anyone-can-pay',
      address: fullPayloadToAddress({
        args,
        type: AddressType.TypeCodeHash,
        prefix,
        codeHash: ANYONE_CAN_PAY_CODE_HASH,
      }),
      free: anyoneCanPayCells.free,
      inUse: anyoneCanPayCells.inuse,
    })
  }
  return list
}

export const getAddresses = async (id: string, network: Channel.NetworkId): Promise<API.AddressInfo[]> => {
  const { wallets } = getWalletIndex()
  const currentWallets = wallets.filter(wallet => wallet.id === id)
  if (!currentWallets) {
    return []
  }
  const ckb = new CKB()
  const { AddressPrefix, AddressType, blake160, scriptToHash, pubkeyToAddress } = ckb.utils
  const prefix = network === 'ckb' ? AddressPrefix.Mainnet : AddressPrefix.Testnet
  const publicKey = '0x' + currentWallets[0].xpub.slice(0, 66)
  const args = '0x' + blake160(publicKey, 'hex')

  const secp256k1LockScript: CKBComponents.Script = {
    codeHash: SECP256K1_BLAKE160_CODE_HASH,
    args,
    hashType: 'type',
  }
  const secp256k1LockHash = scriptToHash(secp256k1LockScript)

  const anyoneCanPayLockScript: CKBComponents.Script = {
    codeHash: ANYONE_CAN_PAY_CODE_HASH,
    args,
    hashType: 'type',
  }
  const anyoneCanPayLockHash = scriptToHash(anyoneCanPayLockScript)

  let addresses: API.AddressInfo[] = [
    {
      address: pubkeyToAddress(publicKey, { prefix } as any),
      lockScript: secp256k1LockScript,
      lockHash: secp256k1LockHash,
      publicKey,
      lockScriptMeta: {
        name: 'Secp256k1',
        cellDeps: [
          {
            outPoint: {
              txHash: network === 'ckb' ? SECP256K1_BLAKE160_MAINNET_TX_HASH : SECP256K1_BLAKE160_TESTNET_TX_HASH,
              index: '0x0',
            },
            depType: 'depGroup',
          },
        ],
        headerDeps: [],
      },
    },
  ]
  if (network === 'ckb_test') {
    addresses.push({
      address: pubkeyToAddress(publicKey, {
        prefix: AddressPrefix.Testnet,
        type: AddressType.TypeCodeHash,
        codeHashOrCodeHashIndex: ANYONE_CAN_PAY_CODE_HASH,
      }),
      lockScript: anyoneCanPayLockScript,
      lockHash: anyoneCanPayLockHash,
      publicKey,
      lockScriptMeta: {
        name: 'anyone-can-pay',
        cellDeps: [
          {
            outPoint: {
              txHash: ANYONE_CAN_PAY_TX_HASH,
              index: '0x0',
            },
            depType: 'depGroup',
          },
        ],
        headerDeps: [],
      },
    })
  }
  return addresses
}

export default { getAddrList, getAddresses }

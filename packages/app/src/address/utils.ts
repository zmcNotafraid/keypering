import path from 'path'
import fs from 'fs'
import { Channel } from '@keypering/specs'
import CKB from '@nervosnetwork/ckb-sdk-core'
import { getWalletIndex } from '../wallet'
import {
  ANYONE_CAN_PAY_CODE_HASH,
  SECP256K1_BLAKE160_CODE_HASH,
} from '../utils/const'
import { getCells } from '../rpc'
import { getDataPath, } from '../utils'
import { WalletNotFoundException } from '../exception'
import MainWindow from '../MainWindow'
import { getAddrList } from './service'

enum LockType {
  Secp256k1 = 0,
  AnyoneCanPay
}

interface CellCapacity {
  inuse: string
  free: string
}

interface AddressTag {
  address: string
  tag: string
}

const dataPath = getDataPath('address')
const getAddressDataPath = (id: string, networkId: string, lockType: LockType) => 
  path.resolve(dataPath, `${id}:${networkId}:${lockType}.json`)

const broadcast = (list: ReturnType<typeof getAddrList>) => {
  MainWindow.broadcast<Channel.Address[]>(Channel.ChannelName.GetAddrList, list)
}

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

export const getRemoteLockCellCapacity = (id: string, network: Channel.NetworkId) => {
  const { wallets } = getWalletIndex()
  const currentWallets = wallets.filter(wallet => wallet.id === id)
  if (!currentWallets) {
    throw new WalletNotFoundException()
  }
  const ckb = new CKB() 
  const { blake160 } = ckb.utils
  const publicKey = '0x' + currentWallets[0].xpub.slice(0, 66)
  const args = '0x' + blake160(publicKey, 'hex')

  const filePath0 = getAddressDataPath(id, network, LockType.Secp256k1)
  const filePath1 = getAddressDataPath(id, network, LockType.AnyoneCanPay)

  Promise.all([getCells(SECP256K1_BLAKE160_CODE_HASH, args, network), 
    getCells(ANYONE_CAN_PAY_CODE_HASH, args, network)]).then(cellsList => {
    cellsList.forEach(cells => {
      if (cells && cells.length > 0) {
        switch(cells[0].output.lock.code_hash) {
          case SECP256K1_BLAKE160_CODE_HASH: 
            fs.writeFileSync(filePath0, JSON.stringify(parseCells(cells)))
            break
          case ANYONE_CAN_PAY_CODE_HASH: 
            fs.writeFileSync(filePath1, JSON.stringify(parseCells(cells)))
            break
          default:
            break
        }
      }
    })
    const addressTags = getAddressTags(id, network)
    const cellCapacity = getLocalLockCellCapacity(id, network)
    broadcast(generateAddressList(addressTags, cellCapacity))
  })
}

export const getLocalLockCellCapacity = (id: string, network: Channel.NetworkId): {secp256k1: CellCapacity, anyoneCanPay: CellCapacity} => {
  const { wallets } = getWalletIndex()
  const currentWallets = wallets.filter(wallet => wallet.id === id)
  if (!currentWallets) {
    throw new WalletNotFoundException()
  }
  const filePath0 = getAddressDataPath(id, network, LockType.Secp256k1)
  const filePath1 = getAddressDataPath(id, network, LockType.AnyoneCanPay)

  let cellCapacity = {
    secp256k1: {inuse: '0', free: '0'},
    anyoneCanPay: {inuse: '0', free: '0'}
  }

  if (fs.existsSync(filePath0)) {
    cellCapacity.secp256k1 = JSON.parse(fs.readFileSync(filePath0, 'utf8'))
  }
  if (fs.existsSync(filePath1)) {
    cellCapacity.anyoneCanPay = JSON.parse(fs.readFileSync(filePath1, 'utf8'))
  }
  return cellCapacity
}

export const getAddressTags = (id: string, network: Channel.NetworkId): {secp256k1: AddressTag, anyoneCanPay?: AddressTag} => {
  const { wallets } = getWalletIndex()
  const currentWallets = wallets.filter(wallet => wallet.id === id)
  if (!currentWallets) {
    throw new WalletNotFoundException()
  }
  const ckb = new CKB()
  const { AddressPrefix, AddressType, blake160, fullPayloadToAddress, pubkeyToAddress } = ckb.utils
  const prefix = network === 'ckb' ? AddressPrefix.Mainnet : AddressPrefix.Testnet
  const publicKey = '0x' + currentWallets[0].xpub.slice(0, 66)
  const args = '0x' + blake160(publicKey, 'hex')
 
  return {
    secp256k1: {
      tag: 'Secp256k1',
      address: pubkeyToAddress(publicKey, { prefix } as any),
    },
    anyoneCanPay: network === 'ckb_test' ? 
    {
      tag: 'anyone-can-pay',
      address: fullPayloadToAddress({
        args,
        type: AddressType.TypeCodeHash,
        prefix,
        codeHash: ANYONE_CAN_PAY_CODE_HASH,
      })
    } : undefined
  }
}

export const generateAddressList = (addressTags: any, cellCapacity: any) => {
  let list: Channel.Address[] = [
    {
      tag: addressTags.secp256k1.tag,
      address: addressTags.secp256k1.address,
      free: cellCapacity.secp256k1.free,
      inUse: cellCapacity.secp256k1.inuse,
    },
  ]
  if (addressTags.anyoneCanPay) {
    list.push({
      tag: addressTags.anyoneCanPay.tag,
      address: addressTags.anyoneCanPay.address,
      free: cellCapacity.anyoneCanPay.free,
      inUse: cellCapacity.anyoneCanPay.inuse,
    })
  }
  return list
}
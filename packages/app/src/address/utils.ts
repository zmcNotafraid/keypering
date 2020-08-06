import path from 'path'
import fs from 'fs'
import { Channel } from '@keypering/specs'
import CKB from '@nervosnetwork/ckb-sdk-core'
import { getWalletIndex } from '../wallet'
import {
  SECP256K1_BLAKE160_CODE_HASH,
} from '../utils/const'
import { getCells } from '../rpc'
import { getDataPath, } from '../utils'
import { WalletNotFoundException } from '../exception'
import MainWindow from '../MainWindow'
import { getAddrList } from './service'
import { getSetting } from '../setting'

const dataPath = getDataPath('address')
const getAddressDataPath = (id: string, networkId: string, name: string) => 
  path.resolve(dataPath, `${id}:${networkId}:${name}.json`)

const broadcast = (list: ReturnType<typeof getAddrList>) => {
  MainWindow.broadcast<Channel.Address[]>(Channel.ChannelName.GetAddrList, list)
}

const parseCells = (cells = [] as any[]) => {
  const inUse = cells
    .filter(cell => cell.output_data !== '0x' || cell.type)
    .map(cell => parseInt(cell.output.capacity))
    .reduce((acc, curr) => acc + curr, 0)
    .toString()

  const free = cells
    .filter(cell => cell.output_data === '0x' && !cell.type)
    .map(cell => parseInt(cell.output.capacity))
    .reduce((acc, curr) => acc + curr, 0)
    .toString()

  return {
    inUse,
    free,
  }
}

export const getWalletXpub = (id: string) => {
  const { wallets } = getWalletIndex()
  const currentWallets = wallets.filter(wallet => wallet.id === id)
  if (!currentWallets) {
    throw new WalletNotFoundException()
  }
  return currentWallets[0].xpub
}

export const getRemoteAddressCapacity = (id: string, network: Channel.NetworkId) => {
  const { locks } = getSetting()
  const ckb = new CKB()
  const { AddressPrefix, AddressType, fullPayloadToAddress, pubkeyToAddress } = ckb.utils
  const prefix = network === 'ckb' ? AddressPrefix.Mainnet : AddressPrefix.Testnet
  const publicKey = '0x' + getWalletXpub(id).slice(0, 66)

  const requests = [] as Promise<any>[]
  const paths = [] as {key: string, path: string}[]
  let addresses = [] as Channel.Address[]
  Object.keys(locks).forEach(key => {
    let lock = locks[key].ins
    let args = lock.script(publicKey).args
    paths.push({key: `${id}:${network}:${lock.codeHash}`, path: getAddressDataPath(id, network, lock.name)})
    requests.push(getCells(lock.codeHash, args))
    addresses.push({
      codeHash: lock.codeHash,
      address: lock.codeHash === SECP256K1_BLAKE160_CODE_HASH ? 
        pubkeyToAddress(publicKey, { prefix } as any) : 
        fullPayloadToAddress({
          args,
          type: lock.hashType === "data" ? AddressType.DataCodeHash : AddressType.TypeCodeHash,
          prefix,
          codeHash: lock.codeHash,
        }),
      tag: lock.name,
      inUse: '0', 
      free: '0',
    })
  });

  Promise.all(requests).then((cellsList: any[]) => {
     cellsList.forEach(cells => {
      if (cells && cells.length > 0) {
        addresses = addresses.map(address => 
          address.codeHash === cells[0].output.lock.code_hash ? {
            ...address,
            ...parseCells(cells),
          } : address
        )
      }
    })
    paths.forEach(path => {
      addresses.forEach(address => {
        if (path.key === `${id}:${network}:${address.codeHash}`) {
          fs.writeFileSync(path.path, JSON.stringify(address))
        }
      })
    })
    broadcast(addresses)
  })
}

export const getLocalAddressCapacity = (id: string, network: Channel.NetworkId): Channel.Address[] => {
  const { locks } = getSetting()
  return Object.keys(locks).map(key => {
    let lock = locks[key].ins
    let path = getAddressDataPath(id, network, lock.name)
    return JSON.parse(fs.readFileSync(path, 'utf8'))
  });
}

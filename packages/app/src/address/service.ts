import { Channel } from '@keypering/specs'
import CKB from '@nervosnetwork/ckb-sdk-core'
import { getWalletIndex } from '../wallet'
import { ANYONE_CAN_PAY_CODE_HASH, SECP256K1_BLAKE160_CODE_HASH } from '../utils/const'
import { getCells } from '../rpc'

const parseCells = (cells = [] as any[]) => {
  const inuse = cells
    .filter(cell => cell.output_data !== '0x')
    .map(cell => parseInt(cell.output.capacity))
    .reduce((acc, curr) => acc + curr, 0)

  const free = cells
    .filter(cell => cell.output_data === '0x')
    .map(cell => parseInt(cell.output.capacity))
    .reduce((acc, curr) => acc + curr, 0)

  return {
    inuse,
    free,
  }
}

export const getAddrList = async (id: string, network: 'ckb' | 'ckb_test'): Promise<Channel.Address[]> => {
  const { wallets } = getWalletIndex()
  const currentWallets = wallets.filter(wallet => wallet.id === id)
  if (!currentWallets) {
    return []
  }
  const ckb = new CKB()
  const { AddressPrefix, AddressType } = ckb.utils
  const prefix = network === 'ckb'
    ? AddressPrefix.Mainnet
    : AddressPrefix.Testnet
  const publicKey = '0x' + currentWallets[0].xpub.slice(0, 66)
  const args = '0x' + ckb.utils.blake160(publicKey, 'hex')
  const secp256k1Cells = parseCells(await getCells(SECP256K1_BLAKE160_CODE_HASH, args, network))
  const anyoneCanPayCells = parseCells(await getCells(ANYONE_CAN_PAY_CODE_HASH, args, network))

  const list: Channel.Address[] = [
    {
      tag: 'Secp256k1',
      address: ckb.utils.pubkeyToAddress(publicKey, { prefix } as any),
      free: secp256k1Cells.free,
      inUse: secp256k1Cells.inuse,
    },
    {
      tag: 'anyone-can-pay',
      address: ckb.utils.fullPayloadToAddress({
        args,
        type: AddressType.TypeCodeHash,
        prefix,
        codeHash: ANYONE_CAN_PAY_CODE_HASH,
      }),
      free: anyoneCanPayCells.free,
      inUse: anyoneCanPayCells.inuse,
    },
  ]
  return list
}

export default { getAddrList }

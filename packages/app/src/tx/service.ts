import fs from 'fs'
import path from 'path'
import type { Channel } from '@keypering/specs'
import CKB from '@nervosnetwork/ckb-sdk-core'
import RequestWindow from './RequestWindow'
import PasswordWindow from '../wallet/PasswordWindow'
import { getDataPath } from '../utils'
import { getWalletIndex } from '../wallet'
import { WalletNotFoundException, FileNotFoundException, RequestRejected } from '../exception'

const dataPath = getDataPath('tx')
const getTxDataPath = (id: string, chainId: string) => path.resolve(dataPath, `${id}:${chainId}.json`)

export const getTxList = ({ id, chainId }: { id: string; chainId: string }) => {
  const filePath = getTxDataPath(id, chainId)
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
  }
  return []
}

export const addTx = ({ id, chainId, tx }: { id: string; chainId: string; tx: Channel.GetTxList.TxProfile }) => {
  const { wallets } = getWalletIndex()

  if (!wallets.some(w => w.id === id)) {
    throw new WalletNotFoundException()
  }

  const filePath = getTxDataPath(id, chainId)
  const list = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, 'utf8')) : []
  // TODO: validate tx
  fs.writeFileSync(filePath, JSON.stringify([...list, tx]))
  return true
}

export const deleteTxFile = (id: string, chainId: string) => {
  const filePath = getTxDataPath(id, chainId)
  if (!fs.existsSync(filePath)) {
    throw new FileNotFoundException()
  }
  fs.unlinkSync(filePath)
  return true
}

export const deleteTxFilesByWalletId = (id: string) => {
  const files = fs.readdirSync(dataPath, 'utf8')
  const targets = files.filter(file => file.startsWith(`${id}:`))
  targets.forEach(file => {
    fs.unlinkSync(file)
  })
}

export const requestSignTx = async (params: { tx: CKBComponents.Transaction, origin: string}) => {
  if (!params.tx.hash) {
    const core = new CKB()
    params.tx.hash = core.utils.rawTransactionToHash(params.tx)
  }
  const requestWindow = new RequestWindow(params)
  const approve = await requestWindow.response()
  if (!approve) {
    throw new RequestRejected()
  }
  const pwdWindow = new PasswordWindow(params.tx.hash, 'Sign Transaction')
  pwdWindow.win.setParentWindow(requestWindow.win)
  const res = await pwdWindow.response()
  requestWindow.close()
  // TODO: sign tx
  return res
}

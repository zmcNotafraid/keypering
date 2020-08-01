import fs from 'fs'
import path from 'path'
import { Channel, KeyperingAgency } from '@keypering/specs'
import CKB from '@nervosnetwork/ckb-sdk-core'
import MainWindow from '../MainWindow'
import RequestWindow from './RequestWindow'
import PasswordWindow from '../wallet/PasswordWindow'
import { getDataPath, networksToRpcUrl } from '../utils'
import { getTxProfile } from './utils'
import sendTx from '../rpc/sendTx'
import { getWalletIndex, signTransaction, getKeystoreByWalletId } from '../wallet'
import { getSetting } from '../setting'
import {
  WalletNotFoundException,
  FileNotFoundException,
  RequestRejected,
  CurrentWalletNotSetException,
  NetworkNotFoundException,
} from '../exception'

const dataPath = getDataPath('tx')
const getTxDataPath = (id: string, networkId: string) => path.resolve(dataPath, `${id}:${networkId}.json`)

const broadcast = (list: ReturnType<typeof getTxList>) => {
  MainWindow.broadcast<Channel.GetTxList.TxProfile[]>(Channel.ChannelName.GetTxList, list)
}

export const getTxList = (id: string, networkId: string): Channel.GetTxList.TxProfile[] => {
  const filePath = getTxDataPath(id, networkId)
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
  }
  return []
}

export const addTx = ({ id, networkId, tx }: { id: string; networkId: string; tx: Channel.GetTxList.TxProfile }) => {
  const { wallets } = getWalletIndex()

  if (!wallets.some(w => w.id === id)) {
    throw new WalletNotFoundException()
  }

  const filePath = getTxDataPath(id, networkId)
  const list = fs.existsSync(filePath)
    ? JSON.parse(fs.readFileSync(filePath, 'utf8'))
    : []
  // TODO: validate tx
  const newList = [...list, tx]
  fs.writeFileSync(filePath, JSON.stringify(newList))

  const { current } = getWalletIndex()
  const { networkId: currentNetworkId } = getSetting()
  if (current === id && currentNetworkId === networkId) {
    broadcast(newList)
  }
  return true
}

export const deleteTxFile = (id: string, networkId: string) => {
  const filePath = getTxDataPath(id, networkId)
  if (!fs.existsSync(filePath)) {
    throw new FileNotFoundException()
  }
  fs.unlinkSync(filePath)

  const { current } = getWalletIndex()
  const { networkId: currentNetworkId } = getSetting()
  if (current === id && currentNetworkId === networkId) {
    broadcast([])
  }

  return true
}

export const deleteTxFilesByWalletId = (id: string) => {
  const files = fs.readdirSync(dataPath, 'utf8')
  const targets = files.filter(file => file.startsWith(`${id}:`))
  targets.forEach(file => {
    fs.unlinkSync(path.resolve(dataPath, file))
  })

  const { current } = getWalletIndex()
  if (current === id) {
    broadcast([])
  }
}

export const requestSignTx = async (params: {
  tx: CKBComponents.Transaction
  description: string
  referer: string
  signConfig?: KeyperingAgency.SignTransaction.InputSignConfig
}) => {
  if (!params.tx.hash) {
    const ckb = new CKB()
    params.tx.hash = ckb.utils.rawTransactionToHash(params.tx)
  }
  const dataToConfirm = await getTxProfile(params.tx, params.referer, params.description)
  const { current } = getWalletIndex()
  if (!current) {
    throw new CurrentWalletNotSetException()
  }
  const { networkId } = getSetting()
  const txProfile = {
    hash: params.tx.hash,
    referer: params.referer,
    meta: params.description,
  }

  try {
    const requestWindow = new RequestWindow(dataToConfirm)
    const approve = await requestWindow.response()
    if (!approve) {
      throw new RequestRejected()
    }
    const pwdWindow = new PasswordWindow(params.tx.hash, 'Sign Transaction')
    pwdWindow.win.setParentWindow(requestWindow.win)
    const passwordRes = await pwdWindow.response()
    requestWindow.close()

    if (typeof passwordRes === 'string') {
      const keystore = getKeystoreByWalletId(current)
      const signedTx = signTransaction({
        keystore,
        tx: params.tx,
        password: passwordRes,
        signConfig: params.signConfig,
      })
      addTx({
        id: current,
        networkId,
        tx: { ...txProfile, isApproved: true, time: Date.now().toString() },
      })
      return signedTx
    }
    if (passwordRes === false) {
      throw new RequestRejected()
    }
    return false
  } catch (err) {
    if (err instanceof RequestRejected) {
      addTx({
        id: current,
        networkId,

        tx: { ...txProfile, isApproved: false, time: Date.now().toString() },
      })
    }
    console.error(err)
    throw err
  }
}

export const requestSendTx = async (params: {
  tx: CKBComponents.Transaction,
  description: string
  referer: string
}) => {

  const { current } = getWalletIndex()
  if (!current) {
    throw new CurrentWalletNotSetException()
  }

  const { networkId, networks } = getSetting()
  const indexerUrl = networks[networkId]?.url
  if (!indexerUrl) {
    throw new NetworkNotFoundException()
  }
  const rpcUrl = networksToRpcUrl({ networkId, networks })

  const ckb = new CKB(rpcUrl)
  if (!params.tx.hash) {
    params.tx.hash = ckb.utils.rawTransactionToHash(params.tx)
  }
  const dataToConfirm = await getTxProfile(params.tx, params.referer, params.description)
  const txProfile = {
    hash: params.tx.hash,
    referer: params.referer,
    meta: params.description,
  }
  try {
    const requestWindow = new RequestWindow(dataToConfirm)
    const approve = await requestWindow.response()
    requestWindow.close()
    if (!approve) {
      throw new RequestRejected()
    }

    delete params.tx.hash
    return sendTx(ckb.node.url, params.tx)
    // FIXME: axios has error on handling https
    // return ckb.rpc.sendTransaction(params.tx)
  } catch (err) {
    if (err instanceof RequestRejected) {
      addTx({
        id: current,
        networkId,
        tx: { ...txProfile, isApproved: false, time: Date.now().toString() }
      })
    }
    console.error(err)
    throw err
  }
}


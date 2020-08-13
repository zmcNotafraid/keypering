import fs from 'fs'
import path from 'path'
import { dialog } from 'electron'
import { Channel } from '@keypering/specs'
import { getWalletIndex } from '../wallet'
import PasswordWindow from '../wallet/PasswordWindow'
import simpleToken from './strategy/simple'
import { getDataPath } from '../utils'
import { broadcastAuthList as broadcast } from '../broadcast'
import {
  ParamsRequiredException,
  AuthNotFoundException,
  CurrentWalletNotSetException,
  AuthRejected,
  FileNotFoundException,
} from '../exception'

const dataPath = getDataPath('auth')
const getAuthFilePath = (id: string) => path.resolve(dataPath, `${id}.json`)

export const getAuthList = (id: string): (Channel.GetAuthList.AuthProfile & { token: string })[] => {
  if (!id) {
    throw new ParamsRequiredException(`Wallet id`)
  }
  const filePath = getAuthFilePath(id)
  if (!fs.existsSync(filePath)) {
    return []
  }
  const res = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  return res
}

export const deleteAuthList = (id: string) => {
  const filePath = getAuthFilePath(id)
  if (!fs.existsSync(filePath)) {
    throw new FileNotFoundException()
  }
  fs.unlinkSync(filePath)
  return true
}

export const addAuth = (id: string, url: string) => {
  if (!url) {
    throw new ParamsRequiredException(`Url`)
  }
  const authList = getAuthList(id)
  const auth = authList.find(a => a.url === url)

  if (auth) {
    return auth.token
  }

  const filePath = getAuthFilePath(id)
  const time = Date.now().toString()
  const token = simpleToken(id, Date.now().toString(), Math.random().toString())
  const newList = [...authList, { url, time, token }]

  fs.writeFileSync(filePath, JSON.stringify(newList))

  const { current } = getWalletIndex()
  if (id === current) {
    broadcast(newList)
  }

  return token
}

export const deleteAuth = async (id: string, url: string): Promise<boolean> => {
  if (!url) {
    throw new ParamsRequiredException(`Url`)
  }
  const authList = getAuthList(id)
  if (!authList.find(auth => auth.url === url)) {
    throw new AuthNotFoundException()
  }
  const { response } = await dialog.showMessageBox({
    type: 'question',
    message: `Revoke authorization of ${url}`,
    buttons: ['Decline', 'Approve'],
    cancelId: 0,
    defaultId: 1,
  })

  if (response === 0) {
    return false
  }

  const newList = authList.filter(auth => auth.url !== url)
  const filePath = getAuthFilePath(id)
  fs.writeFileSync(filePath, JSON.stringify(newList))

  const { current } = getWalletIndex()
  if (current === id) {
    broadcast(newList)
  }
  return true
}

export const requestAuth = async (origin: string, url: string): Promise<string> => {
  const { current } = getWalletIndex()
  if (!current) {
    throw new CurrentWalletNotSetException()
  }
  const { response } = await dialog.showMessageBox({
    type: 'question',
    title: 'Authorization Request',
    message: `Request from: ${url}\nYou are going to share following information to ${origin}\n\n︎☑️ Addresses`,
    buttons: ['Decline', 'Approve'],
    cancelId: 0,
    defaultId: 1,
  })
  if (response === 0) {
    throw new AuthRejected()
  }
  const requestId = `auth:${Date.now()}`

  const pwdWindow = new PasswordWindow(requestId, 'Approve Authorization')

  const res = await pwdWindow.response()
  pwdWindow.win.close()

  if (!res) {
    throw new AuthRejected()
  }

  const token = addAuth(current, origin)

  return token
}

export const isAuthedByCurrentWallet = (token: string) => {
  const { current } = getWalletIndex()
  if (!current) {
    throw new CurrentWalletNotSetException()
  }
  const authList = getAuthList(current)
  return authList.some(auth => auth.token === token)
}

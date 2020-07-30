import path from 'path'
import fs from 'fs'
import type { Channel } from '@keypering/specs'
import { getXpub, Keystore, checkPassword, decryptKeystore, getKeystoreFromXPrv } from './keystore'
import { getDataPath } from '../utils'
import { IncorrectPasswordException, WalletNotFoundException, CurrentWalletNotSetException, RequestPasswordRejected, DirectoryNotFound } from '../exception'
import { deleteAuthList } from '../auth'
import PasswordWindow from './PasswordWindow'
import { dialog } from 'electron'

const dataPath = getDataPath('wallet')
const indexPath = path.resolve(dataPath, 'index.json')

const getKeystorePath = (id: string) => path.resolve(dataPath, `${id}.json`)

const udpateWalletIndex = (current: string, wallets: Channel.WalletProfile[]) => {
  fs.writeFileSync(indexPath, JSON.stringify({ current, wallets }))
}

export const getWalletIndex = (): { current: string, wallets: Channel.WalletProfile[] } => {
  if (fs.existsSync(indexPath)) {
    return JSON.parse(fs.readFileSync(indexPath, 'utf8'))
  } else {
    return { current: '', wallets: [] }
  }
}

export const addKeystore = ({ name, password, keystore }: { name: string, password: string, keystore: Keystore }) => {
  const { wallets, current } = getWalletIndex()

  if (wallets.some(w => w.name === name)) {
    throw new Error(`Wallet name is used`)
  }

  if (wallets.some(w => w.id === keystore.id)) {
    throw new Error(`Wallet exists`)
  }

  const xpub = getXpub(keystore, password)

  const exist = wallets.find(w => w.xpub === xpub)

  if (exist) {
    throw new Error(`Wallet has been created as ${exist.name}`)
  }

  fs.writeFileSync(getKeystorePath(keystore.id), JSON.stringify(keystore))
  const profile = { name, xpub, id: keystore.id }
  udpateWalletIndex(current || profile.id, [...wallets, profile])
  return profile
}

export const selectWallet = (id: string) => {
  const { wallets } = getWalletIndex()
  if (!wallets.some(w => w.id === id)) {
    throw new WalletNotFoundException()
  }
  udpateWalletIndex(id, wallets)
}

export const updateWallet = ({ id, name }: { id: string, name: string }) => {
  const { wallets, current } = getWalletIndex()
  if (wallets.some(w => w.name === name)) {
    throw new Error(`Wallet name is used`)
  }
  const wallet = wallets.find(w => w.id === id)
  if (!wallet) {
    throw new WalletNotFoundException()
  }
  wallet.name = name
  udpateWalletIndex(current, wallets)
  return true
}

export const deleteWallet = async () => {
  const { current, wallets } = getWalletIndex()
  if (!current) {
    throw new CurrentWalletNotSetException()
  }
  const pwdWindow = new PasswordWindow("Password", 'Enter password to delete wallet')
  const approve = await pwdWindow.response()
  if (!approve) {
    throw new RequestPasswordRejected()
  }
  pwdWindow.close()

  const keystorePath = getKeystorePath(current)
  fs.unlinkSync(keystorePath)
  try {
    deleteAuthList(current)
  } catch (err) {
    console.error(err)
  }

  const newWallets = wallets.filter(w => w.id !== current)
  const newCurrent = newWallets.length > 0 ? newWallets[0].id : undefined
  if (newCurrent) {
    udpateWalletIndex(newCurrent, newWallets)
  }
  return newCurrent
}

export const exportKeystore = async() => {
  const { current } = getWalletIndex()
  if (!current) {
    throw new CurrentWalletNotSetException()
  }
  const keystore = JSON.parse(fs.readFileSync(getKeystorePath(current), 'utf8'))
  const pwdWindow = new PasswordWindow("Password", 'Enter password to export keystore')
  const approve = await pwdWindow.response()
  if (!approve) {
    throw new RequestPasswordRejected()
  }
  pwdWindow.close()
  const {filePath, canceled} = (await dialog.showSaveDialog({
    filters: [{
        name: 'keystore',
        extensions: ['json'] 
    }],
    defaultPath: 'keystore',
    title: 'Export',
    buttonLabel: 'Export'
  }))
  if (canceled) {
    return false
  }
  if (typeof filePath !== 'string') {
    throw new DirectoryNotFound()
  }
  fs.writeFileSync(filePath, JSON.stringify(keystore), 'utf8')
  return true
}

export const checkCurrentPassword = (password: string) => {
  const { current } = getWalletIndex()
  if (!current) {
    throw new CurrentWalletNotSetException()
  }
  const keystore = JSON.parse(fs.readFileSync(getKeystorePath(current), 'utf8'))
  return checkPassword(keystore, password)
}

export const updateCurrentPassword = (currentPassword: string, newPassword: string) => {
  try {
    const { current, wallets } = getWalletIndex()
    if (!current) {
      throw new CurrentWalletNotSetException()
    }
    const keystore = JSON.parse(fs.readFileSync(getKeystorePath(current), 'utf8'))
    if (!checkPassword(keystore, currentPassword)) {
      throw new IncorrectPasswordException()
    }
    const xprv = decryptKeystore(keystore, currentPassword)
    const newKeystore = getKeystoreFromXPrv(Buffer.from(xprv), newPassword)
    const xpub = getXpub(newKeystore, newPassword)
    fs.writeFileSync(getKeystorePath(newKeystore.id), JSON.stringify(newKeystore))
    const profile = { name, xpub, id: newKeystore.id }
    udpateWalletIndex(current || profile.id, [...wallets, profile])
  } catch (err) {
    console.error(err)
  }
  return true
}

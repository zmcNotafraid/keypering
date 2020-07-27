import path from 'path'
import fs from 'fs'
import type { Channel } from '@keypering/specs'
import { getXpub, Keystore, checkPassword } from './keystore'
import { getDataPath } from '../utils'
import { IncorrectPasswordException, WalletNotFoundException } from '../exception'

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

export const deleteWallet = ({ id, password }: { id: string, password: string }) => {
  const { wallets, current } = getWalletIndex()
  if (!wallets.some(w => w.id === id)) {
    throw new WalletNotFoundException()
  }

  const keystorePath = getKeystorePath(id)
  const keystore = JSON.parse(fs.readFileSync(keystorePath, 'utf8'))

  if (!checkPassword(keystore, password)) {
    throw new IncorrectPasswordException()
  }

  const newWalletList = wallets.filter(w => w.id !== id)
  const newCurrent = current === id ? newWalletList[0]?.id ?? '' : current

  udpateWalletIndex(newCurrent, newWalletList)
  fs.unlinkSync(keystorePath)
  return true
}

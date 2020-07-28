import path from 'path'
import { BrowserWindow, ipcMain, dialog } from 'electron'
import type { Channel } from '@keypering/specs'
import * as walletManager from './wallet'
import * as settingManager from './setting'

const channelName: { [key: string]: Channel.ChannelName } = {
  getWalletIndex: 'get-wallet-index',
  createWallet: 'create-wallet',
  selectWallet: 'select-wallet',
  deleteWallet: 'delete-wallet',
  updateWallet: 'update-wallet',
  getMnemonic: 'get-mnemonic',
  importKeystore: 'import-keystore',
  getSetting: 'get-setting',
  updateSetting: 'update-setting',
  getTxList: 'get-tx-list',
  getAddrList: 'get-addr-list',
  getAuthList: 'get-auth-list',
  submitPassword: 'submit-password'
}

enum Code {
  Success,
  Error
}

export default class MainWindow {
  #win = new BrowserWindow({
    width: 440,
    height: 690,
    resizable: false,
    maximizable: false,
    fullscreenable: false,
    autoHideMenuBar: true,
    skipTaskbar: true,
    title: 'Keypering',
    show: false,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  get win() {
    return this.#win
  }

  constructor() {
    this.#registerChannels()
  }

  #registerChannels = () => {
    ipcMain.handle(channelName.getWalletIndex, () => {
      try {
        const result = walletManager.getWalletIndex()
        return { code: Code.Success, result }
      } catch (err) {
        dialog.showErrorBox('Error', err.message)
        return { code: Code.Error, message: err.message }
      }
    })

    ipcMain.handle(channelName.createWallet, (_e, params: Channel.CreateWallet.Params) => {
      try {
        const keystore = walletManager.getKeystoreFromMnemonic(params)
        const profile = walletManager.addKeystore({ ...params, keystore })
        return { code: Code.Success, result: profile }
      } catch (err) {
        dialog.showErrorBox('Error', err.message)
        return { code: Code.Error, message: err.message }
      }
    })

    ipcMain.handle(channelName.selectWallet, (_e, params: Channel.SelectWallet.Params) => {
      try {
        const res = walletManager.selectWallet(params.id)
        return { code: Code.Success, result: res }
      } catch (err) {
        dialog.showErrorBox('Error', err.message)
        return { code: Code.Error, message: err.message }
      }
    })

    ipcMain.handle(channelName.deleteWallet, (_e, params: Channel.DeleteWallet.Params) => {
      try {
        const result = walletManager.deleteWallet(params)
        return { code: Code.Success, result }
      } catch (err) {
        dialog.showErrorBox('Error', err.message)
        return { code: Code.Error, message: err.message }
      }
    })

    ipcMain.handle(channelName.updateWallet, (_e, params: Channel.UpdateWallet.Params) => {
      try {
        const result = walletManager.updateWallet(params)
        return { code: Code.Success, result }
      } catch (err) {
        dialog.showErrorBox('Error', err.message)
        return { code: Code.Error, message: err.message }
      }
    })

    ipcMain.handle(channelName.getMnemonic, () => {
      try {
        const result = walletManager.getMnemonic()
        return { code: Code.Success, result }
      } catch (err) {
        dialog.showErrorBox('Error', err.message)
        return { code: Code.Error, message: err.message }
      }
    })

    ipcMain.handle(channelName.importKeystore, (_e, params: Channel.ImportKeystore.Params) => {
      const {keystorePath, password} = params
      try {
        const keystore = walletManager.checkPasswordFromPath(keystorePath, password)
        const profile = walletManager.addKeystore({ ...params, keystore })
        return { code: Code.Success, result: profile }
      } catch (err) {
        dialog.showErrorBox('Error', err.message)
        return { code: Code.Error, message: err.message }
      }
    })

    ipcMain.handle(channelName.getSetting, () => {
      try {
        const result = settingManager.getSetting()
        return { code: Code.Success, result }
      } catch (err) {
        dialog.showErrorBox('Error', err.message)
        return { code: Code.Error, message: err.message }
      }
    })

    ipcMain.handle(channelName.updateSetting, (_e, params: Channel.UpdateSetting.Params) => {
      try {
        const result = settingManager.updateSetting(params)
        return { code: Code.Success, result }
      } catch (err) {
        dialog.showErrorBox('Error', err.message)
        return { code: Code.Error, message: err.message }
      }
    })
    ipcMain.handle(channelName.getTxList, () => {
      // TODO:
    })
    ipcMain.handle(channelName.getAddrList, () => {
      // TODO:
    })
    ipcMain.handle(channelName.getAuthList, () => {
      // TODO:
    })
    ipcMain.handle(channelName.submitPassword, () => {
      // TODO:
    })
  }
}

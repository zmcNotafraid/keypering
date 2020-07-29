import path from 'path'
import { BrowserWindow, ipcMain, dialog } from 'electron'
import type { Channel } from '@keypering/specs'
import * as walletManager from './wallet'
import * as settingManager from './setting'
import * as authManager from './auth'
import * as txManager from './tx'

export const channelName: { [key: string]: Channel.ChannelName } = {
  getWalletIndex: 'get-wallet-index',
  createWallet: 'create-wallet',
  selectWallet: 'select-wallet',
  deleteWallet: 'delete-wallet',
  updateWallet: 'update-wallet',
  backupWallet: 'backup-wallet',
  checkCurrentPassword: 'check-current-password',
  getMnemonic: 'get-mnemonic',
  importKeystore: 'import-keystore',
  getSetting: 'get-setting',
  updateSetting: 'update-setting',
  getTxList: 'get-tx-list',
  requestSign: 'request-sign',
  getAddrList: 'get-addr-list',
  getAuthList: 'get-auth-list',
  deleteAuth: 'delete-auth',
  submitPassword: 'submit-password',
}

enum Code {
  Success,
  Error,
}

export default class MainWindow {
  static id: number | undefined
  #win = new BrowserWindow({
    width: 440,
    height: 690,
    resizable: false,
    maximizable: false,
    fullscreenable: false,
    autoHideMenuBar: true,
    title: 'Keypering',
    show: false,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  get win() {
    return this.#win
  }

  #filePath =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000/#welcome'
      : path.join('file://', __dirname, '..', 'public', 'ui', 'index.html#welcome')

  public static broadcast = <P = any>(channel: Channel.ChannelName, params: P) => {
    if (MainWindow.id === undefined) {
      return
    }

    BrowserWindow.fromId(MainWindow.id).webContents.send(channel, params)
  }

  constructor() {
    this.#registerChannels()
    MainWindow.id = this.win.id

    this.#win.on('ready-to-show', () => {
      this.#win.show()
    })
    this.#win.on('closed', () => {
      MainWindow.id = undefined
    })
  }

  public load = () => {
    this.#win.loadURL(this.#filePath)
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
        walletManager.addKeystore({ ...params, keystore })
        return { code: Code.Success, result: true }
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

    ipcMain.handle(channelName.deleteWallet, async _e => {
      try {
        const result = await walletManager.deleteWallet()
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

    ipcMain.handle(channelName.backupWallet, async _e => {
      try {
        const result = JSON.stringify(await walletManager.exportKeystore())
        return { code: Code.Success, result }
      } catch (err) {
        dialog.showErrorBox('Error', err.message)
        return { code: Code.Error, message: err.message }
      }
    })

    ipcMain.handle(channelName.checkCurrentPassword, (_e, params: Channel.CheckCurrentPassword.Params) => {
      try {
        const result = walletManager.checkCurrentPassword(params.password)
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
      const { keystorePath, password } = params
      try {
        const keystore = walletManager.getKeystoreFromPath(keystorePath, password)
        walletManager.addKeystore({ ...params, keystore })
        return { code: Code.Success, result: true }
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

    ipcMain.handle(
      channelName.updateSetting,
      (_e, params: Channel.UpdateSetting.Params): Channel.UpdateSetting.Response => {
        try {
          const result = settingManager.updateSetting(params)
          return { code: Code.Success, result }
        } catch (err) {
          dialog.showErrorBox('Error', err.message)
          return { code: Code.Error, message: err.message }
        }
      }
    )

    ipcMain.handle(channelName.getTxList, () => {
      // TODO:
    })

    ipcMain.handle(channelName.requestSign, async (_e, params: Channel.RequestSign.Params) => {
      try {
        const result = await txManager.requestSignTx({ ...params, origin: 'Keypering' })
        return { code: Code.Success, result }
      } catch (err) {
        return { code: err.code || Code.Error, message: err.message }
      }
    })

    ipcMain.handle(channelName.getAddrList, () => {
      // TODO:
    })

    ipcMain.handle(channelName.getAuthList, () => {
      try {
        const { current } = walletManager.getWalletIndex()
        const list = authManager.getAuthList(current)
        return {
          code: Code.Success,
          result: list.map(auth => ({ url: auth.url, time: auth.time })),
        }
      } catch (err) {
        dialog.showErrorBox('Error', err.message)
        return { code: Code.Error, message: err.message }
      }
    })

    ipcMain.handle(
      channelName.deleteAuth,
      async (_e, params: Channel.DeleteAuth.Params): Promise<Channel.DeleteAuth.Response> => {
        try {
          const { current } = walletManager.getWalletIndex()
          const result = await authManager.deleteAuth(current, params.url)
          return { code: Code.Success, result }
        } catch (err) {
          dialog.showErrorBox('Error', err.message)
          return { code: Code.Error, message: err.message }
        }
      }
    )

    ipcMain.handle(channelName.submitPassword, (_e, params: Channel.SubmitPassword.Params) => {
      const { currentPassword, newPassword } = params
      try {
        const result = walletManager.updateCurrentPassword(currentPassword, newPassword)
        return { code: Code.Success, result }
      } catch (err) {
        dialog.showErrorBox('Error', err.message)
        return { code: Code.Error, message: err.message }
      }
    })
  }
}

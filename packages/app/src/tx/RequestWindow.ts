import path from 'path'
import { BrowserWindow } from 'electron'
import MainWindow from '../MainWindow'
import type { TxInfo } from './utils'

export default class RequestWindow {
  #win = new BrowserWindow({
    width: 600,
    height: 600,
    minWidth: 600,
    maxWidth: 600,
    maximizable: false,
    fullscreenable: false,
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
    title: 'Signing',
    show: false,
    frame: false,
    parent: MainWindow.id ? BrowserWindow.fromId(MainWindow.id) : undefined,
    modal: true,
    backgroundColor: '#fff',
    webPreferences: {
      nodeIntegration: false,
      preload: path.resolve(__dirname, '..', 'preload.js'),
    },
  })

  get win() {
    return this.#win
  }

  #filePath = ''
  #channel = ''
  get channel() {
    return this.#channel
  }

  constructor({ tx, referer, meta }: TxInfo) {
    this.#filePath = path.join('file://', __dirname, '..', '..', 'public', 'dialogs', `signTx.html?tx-hash=${tx.hash}`)
    this.#channel = `sign:${tx.hash}`
    this.#win.on('ready-to-show', () => {
      this.#win.show()
      this.#win.webContents.send(this.#channel, { tx, referer, meta })
    })
  }

  public load = () => {
    this.#win.loadURL(this.#filePath)
  }

  public close = () => {
    this.#win.close()
  }

  public response = (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      this.#win.webContents.once('ipc-message', (_e, channel, args: boolean) => {
        if (channel === this.#channel && typeof args === 'boolean') {
          resolve(args)
        } else {
          reject(args)
        }
      })
      this.load()
    })
  }
}

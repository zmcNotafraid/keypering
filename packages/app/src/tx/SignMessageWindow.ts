import path from 'path'
import { BrowserWindow } from 'electron'
import MainWindow from '../MainWindow'

export default class SignMessageWindow {
  #win = new BrowserWindow({
    width: 430,
    height: 260,
    minWidth: 430,
    maxWidth: 430,
    maximizable: false,
    fullscreenable: false,
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
    title: 'Signing',
    show: false,
    frame: false,
    parent: MainWindow.id
      ? BrowserWindow.fromId(MainWindow.id)
      : undefined,
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

  constructor(message: string, address: string) {
    this.#filePath = path.join('file://', __dirname, '..', '..', 'public', 'dialogs', `signMessage.html?message=${message}&address=${address}`)
    this.#channel = `signMsg:${address}`
    this.#win.on('ready-to-show', () => {
      this.#win.show()
      this.#win.webContents.send(this.#channel, { message, address })
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

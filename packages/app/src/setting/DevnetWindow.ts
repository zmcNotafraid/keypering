import path from 'path'
import { BrowserWindow } from 'electron'

export default class DevnetWindow {
  #win = new BrowserWindow({
    width: 300,
    height: 175,
    resizable: false,
    maximizable: false,
    fullscreenable: false,
    autoHideMenuBar: true,
    title: 'Devnet',
    show: false,
    modal: true,
    alwaysOnTop: true,
    frame: false,
    backgroundColor: '#fff',
    webPreferences: {
      nodeIntegration: false,
      preload: path.resolve(__dirname, '..', 'preload.js'),
    },
  })

  get win() {
    return this.#win
  }

  #filePath = path.join('file://', __dirname, '..', '..', 'public', 'dialogs', `devnet.html`)
  #channel = 'update-devnet-url'

  constructor(url: string) {
    this.#filePath = `${this.#filePath}?url=${url}`
    this.#win.on('ready-to-show', () => {
      this.#win.show()
    })
  }

  public setParent = (win: BrowserWindow) => {
    this.#win.setParentWindow(win)
  }

  public load = () => {
    this.#win.loadURL(this.#filePath)
  }

  public close = () => {
    this.#win.close()
  }

  public response = (): Promise<string | boolean> => {
    return new Promise((resolve, reject) => {
      this.#win.webContents.once('ipc-message', (_e, channel, args: string | boolean) => {
        if (channel === this.#channel) {
          resolve(args)
        } else {
          reject(args)
        }
      })
      this.load()
    })
  }
}

import path from 'path'
import { BrowserWindow } from 'electron'

export default class PasswordWindow {
  #win = new BrowserWindow({
    width: 300,
    height: 175,
    resizable: false,
    maximizable: false,
    fullscreenable: false,
    autoHideMenuBar: true,
    title: 'Password',
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

  #filePath = ''
  #channel = ''
  get channel() {
    return this.#channel
  }

  constructor(requestId: string, title: string) {
    this.#filePath = path.join('file://', __dirname, '..', '..', 'public', 'dialogs', `password.html?id=${requestId}&title=${title}`)
    this.#channel = `password:${requestId}`
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

  public response = (): Promise<boolean | string> => {
    return new Promise((resolve, reject) => {
      this.#win.webContents.once('ipc-message', (_e, channel, args: boolean) => {
        if (channel === this.#channel && (typeof args === 'boolean' || typeof args === 'string')) {
          resolve(args)
        } else {
          reject(args)
        }
      })
      this.load()
    })
  }
}

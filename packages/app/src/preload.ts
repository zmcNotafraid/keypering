import { ipcRenderer } from 'electron'

Object.defineProperty(window, 'ipcRenderer', {
  value: ipcRenderer
})

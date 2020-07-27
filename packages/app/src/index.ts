import './preprocess'
import path from 'path'
import { app } from 'electron'
import MainWindow from './MainWindow'

const createWindow = () => {
  const { win } = new MainWindow()
  win.on('ready-to-show', () => {
    win.show()
  })

  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:3000/#welcome')
  } else {
    win.loadURL(path.join('file://', __dirname, '..', 'public', 'ui', 'index.html#welcome'))
  }
}

app.whenReady().then(createWindow)


import './preprocess'
import { app } from 'electron'
import './server'
import MainWindow from './MainWindow'

const createWindow = () => {
  const mainWindow = new MainWindow()
  mainWindow.load()
}

app.whenReady().then(createWindow)

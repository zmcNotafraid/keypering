import path from 'path'
import { app } from 'electron'
const userDataPath = app.getPath('userData')
app.setPath('userData', path.resolve(userDataPath, '..', '..', 'keypering'))

import fs from 'fs'
import path from 'path'
import { app } from 'electron'
import{ DATA_PATH_BASE} from './const'

export const getDataPath = (name: string) => {
  const dataPath = path.resolve(app.getPath('userData'), DATA_PATH_BASE, name)
  if (!fs.existsSync(dataPath)) {
    fs.mkdirSync(dataPath, { recursive: true })
  }
  return dataPath
}

export default getDataPath
